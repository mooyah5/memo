import requests
from bs4 import BeautifulSoup

# 여기에 코드를 작성하세요
response = requests.get("https://workey.codeit.kr/music/index")
popular_searches = []

parsed_html = BeautifulSoup(response.text, "html.parser")
# print(parsed_html)

ranks = parsed_html.select(".rank__order li")
for rank in ranks:
    text = rank.get_text()
    popular_searches.append(text.split()[2])
    
# 테스트 코드
print(popular_searches)