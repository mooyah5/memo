import requests
from bs4 import BeautifulSoup
import csv #스탠다드 모듈

# create csv file
csv_file = open('시청률_2010년1월1주차.csv', 'w', newline="")   # windows 개행 (newline 추가)
csv_writer = csv.writer(csv_file)


# 테이블 헤더 정보 전달
csv_writer.writerow(['순위', '채널', '프로그램', '시청률'])


# html 파싱
response = requests.get("https://workey.codeit.kr/ratings/index")
rating_page = response.text
soup = BeautifulSoup(rating_page, "html.parser")

for tr_tag in soup.select("tr")[1:]:
    td_tags = tr_tag.select("td")
    row = [
        td_tags[0].get_text(),  # 순위
        td_tags[1].get_text(),  # 채널
        td_tags[2].get_text(),  # 프로그램
        td_tags[3].get_text(),  # 시청률
    ]
    csv_writer.writerow(row)

csv_file.close()
