# 직장 전번 모으기

import requests
from bs4 import BeautifulSoup

response = requests.get("https://workey.codeit.kr/orangebottle/index")
branch_infos = []

soup = BeautifulSoup(response.text, "html.parser")
# print(soup.select(".branch"))

for branch in soup.select(".branch"):
    branch_name = branch.select(".city")[0].get_text()
    address = branch.select(".address")[0].get_text()
    phone_number = branch.select(".phoneNum")[0].get_text()
    branch_infos.append([branch_name, address, phone_number])

print(branch_infos)

# find()랑 select_one()이랑 비슷하고,
# find_all()랑 select() 랑 비슷함

# find(), find_all() 은 css 선택자 안 쓰고 여러 파라미터 활용함

## 태그명
# soup.find_all('p')
## 태그명 리스트
# soup.find_all(['p', 'a'])
## 모든 태그
# soup.find_all(True)
## 태그 속성 (클래스는 _ 붙임) (속성만으로도 가능)
# soup.find_all('tagname', attr1='val1', attr2='val2', class_="some-class")