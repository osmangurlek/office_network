from pydantic import BaseModel
from typing import List
import json
import time
import re

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

import logging
from datetime import datetime

from config import settings
from database import SessionLocal, engine
import models

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants
MODEM_IP = settings.MODEM_IP
DEVICES_URL = settings.DEVICES_URL
USERNAME = settings.USERNAME
PASSWORD = settings.PASSWORD

# Configure Chrome options for headless mode
chrome_options = Options()
chrome_options.add_argument("--headless")  # Run in headless mode

class Device(BaseModel):
    mac_address: str
    ip_address: str
    hostname: str
    status: str

class DeviceList(BaseModel):
    devices: List[Device]
        
models.Base.metadata.create_all(bind=engine)

# Logging ayarları
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def get_connected_devices() -> List[Device]:
    with webdriver.Chrome(options=chrome_options) as driver:
        try:
            # Login to modem
            driver.get(MODEM_IP)
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "txt_Username"))
            )
                        
            username_input = driver.find_element(By.ID, "txt_Username")
            password_input = driver.find_element(By.ID, "txt_Password")
                        
            username_input.send_keys(USERNAME)
            password_input.send_keys(PASSWORD)
            password_input.send_keys(Keys.RETURN)
            time.sleep(3)

            driver.get(DEVICES_URL)
            data = driver.page_source

            time.sleep(2)

            # Regex pattern to match USERDeviceNew instances
            pattern = re.compile(r'USERDeviceNew\(.*?\)', re.DOTALL)

            # Find all USERDeviceNew instances in the data
            matches = pattern.findall(data)

            connected_devices = []

            for match in matches:
                # Extract relevant fields using regex
                fields = match.split(',')
                
                
                IpAddr = fields[1].strip('\"').replace("\\x2e", ".")
                MacAddr = fields[2].strip('\"').replace("\\x3a", ":")
                DevStatus = fields[6].strip('\"')
                HostName = fields[10].strip('\"')
                        
                # Filter only Online devices
                if DevStatus == "Online":
                    connected_devices.append(Device(
                        mac_address=MacAddr,
                        ip_address=IpAddr,
                        hostname=HostName,
                        status=DevStatus
                    ))
                    
            return connected_devices
        
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        
@app.get("/devices", response_model=DeviceList)
async def read_devices():
    """Get all connected WiFi devices"""
    devices = await get_connected_devices()
    return DeviceList(devices=devices)

# Scheduler oluştur
scheduler = AsyncIOScheduler()

@app.on_event("startup")
async def start_scheduler():
    async def check_devices():
        logger.info("Bağlı cihazlar kontrol ediliyor...")
        try:
            devices = await get_connected_devices()
            logger.info(f"Toplam {len(devices)} cihaz bulundu:")
            
            db = SessionLocal()
            try:
                for device in devices:
                    # MAC adresi kontrolü
                    existing_device = db.query(models.Device).filter(
                        models.Device.mac_address == device.mac_address
                    ).first()
                    
                    # Hostname'e göre çalışanı bul
                    employee = db.query(models.Employee).filter(
                        models.Employee.name == device.hostname
                    ).first()
                    
                    # Eğer çalışan yoksa ve hostname boş değilse, yeni çalışan oluştur
                    if not employee and device.hostname and device.hostname != "N/A":
                        employee = models.Employee(name=device.hostname)
                        db.add(employee)
                        db.flush()  # ID'yi almak için flush yapıyoruz
                        logger.info(f"Yeni çalışan eklendi - İsim: {device.hostname}")
                    
                    if existing_device:
                        # Cihaz varsa sadece IP ve çalışan bilgisini güncelle
                        existing_device.ip_address = device.ip_address
                        if employee:
                            existing_device.employee_id = employee.id
                            logger.info(f"Cihaz güncellendi - MAC: {device.mac_address}, Çalışan: {employee.name}")
                    else:
                        # Yeni cihaz oluştur
                        new_device = models.Device(
                            mac_address=device.mac_address,
                            ip_address=device.ip_address,
                            hostname=device.hostname,
                            employee_id=employee.id if employee else None
                        )
                        db.add(new_device)
                        logger.info(f"Yeni cihaz eklendi - MAC: {device.mac_address}")
                    
                    logger.info(f"MAC: {device.mac_address}, IP: {device.ip_address}, Hostname: {device.hostname}")
                
                db.commit()
            except Exception as e:
                logger.error(f"Veritabanı işlemi sırasında hata: {str(e)}")
                db.rollback()
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f"Cihaz kontrolü sırasında hata: {str(e)}")
    
    scheduler.add_job(check_devices, 'interval', minutes=15, next_run_time=datetime.now())
    scheduler.start()
    logger.info("Scheduler başlatıldı! Her 15 dakikada bir kontrol yapılacak.")

@app.on_event("shutdown")
async def shutdown_scheduler():
    scheduler.shutdown()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    uvicorn.run(app, host="0.0.0.0", port=8000)