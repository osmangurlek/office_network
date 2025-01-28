# İlk olarak modem arayüzüne giriş yapmayı deneyelim
import requests
from config import settings

# Modem arayüzüne bağlanmak için gerekli bilgiler
modem_url = "http://192.168.1.1"
username = settings.USERNAME
password = settings.PASSWORD

# Giriş bilgileri
payload = {
    "username": username,
    "password": password
}

# Oturum açma isteği
session = requests.Session()
response = session.get(f"{modem_url}/html/wizard/network.html", data=payload)

if response.status_code == 200:
    print("Giriş Başarılı!")
else:
    print("Giriş Başarısız!")

response = session.get(f"{modem_url}/api/system/HostInfo")
# Yanıt içeriğini kontrol et
print("Status Code:", response.status_code)  # HTTP Durum kodunu yazdır
print("Response Content:", response.text)
# data = response.json()

# for device in data["devices"]:
#     print(f"MAC: {device['MACAddress']}, IP: {device['IPAddress']}")