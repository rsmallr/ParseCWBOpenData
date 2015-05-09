中央氣象局氣象資料開放平台API for Parse Cloud Code
================
利用Parse Cloud Code，將中央氣象局氣象資料開放平台包裝成資料量更精簡的API。

安裝
------------
1. 在本機利用Parse command line tool建立好新的Parse Cloud Code後，將main.js覆蓋到cloud/main.js
2. 在Parse後台設定cloud job，選擇jobParseForecast，設定每小時更新一次。

使用
------------
在client side呼叫parseForecast，參數有

1. authorizationkey: 氣象資料開放平台的authorizationkey
2. dataid: 氣象資料開放平台的資料集ID
3. geocode: 鄉鎮代碼
