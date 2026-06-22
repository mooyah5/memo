import requests
from bs4 import BeautifulSoup

# 여기에 코드를 작성하세요
response = requests.get("https://workey.codeit.kr/orangebottle/index")
htmls = response.text

soup = BeautifulSoup(htmls, 'html.parser')
phone_numbers_texts = soup.select(".phoneNum")

phone_numbers = []
for phone_number in phone_numbers_texts:
    # print(phone_number.get_text())
    phone_numbers.append(phone_number.get_text())
# # 테스트 코드
print(phone_numbers)