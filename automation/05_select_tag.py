import os
import requests

from bs4 import BeautifulSoup

response  = requests.get("https://workey.codeit.kr/ratings/index")
rating_page = response.text
soup = BeautifulSoup(rating_page, "html.parser")

tr_tag = soup.select("tr")[1] # 두번째 랭크
td_tags = tr_tag.select("td")
print(td_tags)

for td_tag in td_tags:
    print(td_tag.get_text())