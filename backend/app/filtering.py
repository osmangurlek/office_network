from fastapi import FastAPI
import json
import pandas as pd

app = FastAPI()

df = pd.read_csv('../database.csv', sep='\t')
device_list = json.loads(df.to_json(orient='records'))
# Filtreleme işlemini yapıyoruz
routers = [device for device in device_list if device['device_category'] == 'router']
switches = [device for device in device_list if device['device_category'] == 'switch']

# JSON Formatında csv dosyası içerisinde bulunan dummy cihazların gösterilmesi
@app.get("/")
def get_devices():
    return {"devices": device_list}

@app.get("/routers")
def get_routers():
    return {"routers": routers}

@app.get("/switches")
def get_switches():
    return {"switches": switches}

@app.get("/routers/hostname/{hostname}")
def get_dynamic_router_hostname(hostname:str):
    return { "data" : router for router in routers if router['hostname'] == hostname }

@app.get("routers/model/{model}")
def get_dynamic_router_model(model:str):
    return { "data" : router for router in routers if router['model'] == model }