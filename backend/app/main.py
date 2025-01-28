import os # import module

# scan available Wifi networks
# os.system('cmd /c "netsh wlan show networks"') # windows için
scan_command = "/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -s"
os.system(scan_command)
# system komutu ile cmd komutunu çalıştırabilmek için kullanıyoruz
# yukarıdaki komut ile birlikte tüm aktif ve ulaşılabilir SSID'leri tarıyoruz.
# daha sonrasında burada bize bunların altyapı, kimlik doğrulama ve şifreleme bilgilerini listeliyor

# input Wifi name
# name_of_router = input('Enter Name/SSID of thee Wifi Network you wish to connect to: ')

# connect to the given wifi network
# os.system(f'''cmd /c "netsh wlan connect name={name_of_router}"''')
# Wi-Fi SSID ve Şifre Al
ssid = input("Bağlanmak istediğiniz Wi-Fi ağının adı (SSID): ")
password = input("Şifre: ")

# Wi-Fi ağına bağlan
os.system(f'networksetup -setairportnetwork en0 "{ssid}" "{password}"')

print("Bağlanma işlemi tamamlandı.")
