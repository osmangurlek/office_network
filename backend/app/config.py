import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    USERNAME=os.getenv("USERNAME")
    PASSWORD=os.getenv("PASSWORD")
    MODEM_IP=os.getenv("MODEM_IP")
    DEVICES_URL=os.getenv("DEVICES_URL")
    DATABASE_URL=os.getenv("DATABASE_URL")
    
settings = Config()