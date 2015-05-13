中央氣象局氣象資料開放平台Light-weight API for Parse Cloud Code
================
利用Parse Cloud Code，將中央氣象局氣象資料開放平台 (http://http://opendata.cwb.gov.tw/) 提供的資料，包裝成資料量更精簡的API。

目的
------------
目前氣象資料開放平台提供的資料檔案大小過大，不符合手機App開發的需求。這個專案的目的是利用Parse Cloud Code抓取氣象資料開放平台的資料集，回傳輕量的資料供手機端使用。
以鄉鎮天氣預報中的新北市未來1週天氣預報為例，原始資料量為1.6MB左右，如果只回傳某一特定鄉鎮的資料，資料量可以減低至110KB左右。

支援的資料集
------------
請參考氣象資料開放平台的資料清單 (http://opendata.cwb.gov.tw/datalist)

39 鄉鎮天氣預報-臺灣各鄉鎮市區預報資料
- 宜蘭縣未來2天天氣預報 F-D0047-001
- 宜蘭縣未來1週天氣預報 F-D0047-003
- 桃園市未來2天天氣預報 F-D0047-005
- 桃園市未來1週天氣預報	F-D0047-007
- 新竹縣未來2天天氣預報	F-D0047-009
- 新竹縣未來1週天氣預報	F-D0047-011
- 苗栗縣未來2天天氣預報	F-D0047-013
- 苗栗縣未來1週天氣預報	F-D0047-015
- 彰化縣未來2天天氣預報	F-D0047-017
- 彰化縣未來1週天氣預報	F-D0047-019
- 南投縣未來2天天氣預報	F-D0047-021
- 南投縣未來1週天氣預報	F-D0047-023
- 雲林縣未來2天天氣預報	F-D0047-025
- 雲林縣未來1週天氣預報	F-D0047-027
- 嘉義縣未來2天天氣預報	F-D0047-029
- 嘉義縣未來1週天氣預報	F-D0047-031
- 屏東縣未來2天天氣預報	F-D0047-033
- 屏東縣未來1週天氣預報	F-D0047-035
- 臺東縣未來2天天氣預報	F-D0047-037
- 臺東縣未來1週天氣預報	F-D0047-039
- 花蓮縣未來2天天氣預報	F-D0047-041
- 花蓮縣未來1週天氣預報	F-D0047-043
- 澎湖縣未來2天天氣預報	F-D0047-045
- 澎湖縣未來1週天氣預報	F-D0047-047
- 基隆市未來2天天氣預報	F-D0047-049
- 基隆市未來1週天氣預報	F-D0047-051
- 新竹市未來2天天氣預報	F-D0047-053
- 新竹市未來1週天氣預報	F-D0047-055
- 嘉義市未來2天天氣預報	F-D0047-057
- 嘉義市未來1週天氣預報	F-D0047-059
- 臺北市未來2天天氣預報	F-D0047-061
- 臺北市未來1週天氣預報	F-D0047-063
- 高雄市未來2天天氣預報	F-D0047-065
- 高雄市未來1週天氣預報	F-D0047-067
- 新北市未來2天天氣預報	F-D0047-069
- 新北市未來1週天氣預報	F-D0047-071
- 臺中市未來2天天氣預報	F-D0047-073
- 臺中市未來1週天氣預報	F-D0047-075
- 臺南市未來2天天氣預報	F-D0047-077
- 臺南市未來1週天氣預報	F-D0047-079
- 連江縣未來2天天氣預報	F-D0047-081
- 連江縣未來1週天氣預報	F-D0047-083
- 金門縣未來2天天氣預報	F-D0047-085
- 金門縣未來1週天氣預報	F-D0047-087
- 台灣未來2天天氣預報	F-D0047-089
- 台灣未來1週天氣預報	F-D0047-091

安裝
------------
1. 在本機利用Parse command line tool建立好新的Parse Cloud Code後，將main.js覆蓋到cloud/main.js
2. 在Parse後台設定cloud job，選擇jobParseForecast，設定適當的更新頻率(例如每4小時更新一次)。

使用
------------
####呼叫parseForecast
在client side利用Cloud Code Rest API呼叫parseForecast
```
https://api.parse.com/1/functions/parseForecast
```
Header需帶入Parse的X-Parse-Application-Id 和X-Parse-REST-API-Key

(Cloud Code Rest API詳細使用方式請見 https://www.parse.com/docs/rest/guide#quick-reference-request-format)

####API參數

1. authorizationkey: 氣象資料開放平台的authorizationkey
2. dataid: 氣象資料開放平台的資料集ID
3. geocode: 鄉鎮代碼

####回傳的資料

```
{
"result": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\ <cwbopendata xmlns=\"urn:cwb:gov:tw:cwbcommon:0.1\">\ <identifier>\ 0cce976c-b43c-71c9-f614-a386e3b08d6e\ </identifier>\ <sender>\ weather@cwb.gov.tw\ </sender>\ <sent>\ 2015-05-13T16:20:00+08:00\ </sent>\ <status>\ Actual\ </status>\ <scope>\ Public\ </scope>\ <msgType>\ Issue\ </msgType>\ <dataid>\ D0047-071\ </dataid>\ <source>\ MFC\ </source>\ <dataset>\ <datasetInfo>\ <datasetDescription>\ 新北市未來1週天氣預報\ </datasetDescription>\ <datasetLanguage>\ zh-TW\ </datasetLanguage>\ <issueTime>\ 2015-05-13T17:00:00+08:00\ </issueTime>\ <validTime>\ <startTime>\ 2015-05-13T18:00:00+08:00\ </startTime>\ <endTime>\ 2015-05-21T06:00:00+08:00\ </endTime>\ </validTime>\ <update>\ 2015-05-13T16:20:00+08:00\ </update>\ </datasetInfo>\ <contents>\ <contentDescription>\ 臺灣各鄉鎮市區未來2天(逐3小時)及未來1週天氣預報\ </contentDescription>\ </contents>\ <locations>\ <locationsName>\ 新北市\ </locationsName>\ <location>\ <locationName>\ 新店區\ </locationName>\ <geocode>\ 6500600\ </geocode>\ <lat>\ 24.969155\ </lat>\ <lon>\ 121.533397\ </lon>\ <weatherElement>\ <elementName>\ T\ </elementName>\ <time>\ <startTime>\ 2015-05-13T18:00:00+08:00\ </startTime>\ <endTime>\ 2015-05-14T06:00:00+08:00\ </endTime>\ <elementValue>\ <value>\ 24\ </value>\ <measures>\ C\ </measures>\ </elementValue>\ </time>\ <time>\ <startTime>\ 2015-05-14T06:00:00+08:00\ </startTime>\ <endTime>\ 2015-05-14T18:00:00+08:00\ </endTime>\ <elementValue>\ <value>\ 28\ </value>\ <measures>\ C\ </measures>\ </elementValue>\ </time>\ <time>\ <startTime>\ 2015-05-14T18:00:00+08:00\ </startTime>\ <endTime>\ 2015-05-15T06:00:00+08:00\ </endTime>\ 
...
</location>\ \ </locations>\ </dataset>\ </cwbopendata>\ "
}
```
其中location只會有一組，其geocode等於傳入的值

License
----
MIT
