import os
import requests

from bs4 import BeautifulSoup

# pip3 install requests
# python -b venv venv
# source venv/Scripts/activate
# pip install beautifulsoup4

year = 2010
month = 10
weekIndex = 3
# rating_pages=[]
# https://workey.codeit.kr/ratings/index?year=2010&month=2&weekIndex=3
url = "https://workey.codeit.kr/ratings/index"
# for i in range(5) :
#     url = "https://workey.codeit.kr/ratings/index?year=2010&month=2&weekIndex={}".format(i)
#     response = requests.get(url)
#     rating_page = response.text
#     rating_pages.append(rating_page)
# print(len(rating_pages))
# print(rating_pages)
# print(response.text)

rating_page = requests.get(url).text

soup = BeautifulSoup(rating_page, 'html.parser')
# print(soup.prettify())
# print(soup.select(".channel"))

program_title_tags = soup.select("td.program")
# program_titles = []
# for tag in program_title_tags:
#     # print(tag.get_text())
#     program_titles.append(tag.get_text())
# print(program_titles)

print(soup.select_one("td.program"))