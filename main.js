var completeCount = 0;

function requestXmlAsync(dataid, authorizationkey, status, taskTotalCount) {
		var startTime = new Date().getTime();
		
		var url = "http://opendata.cwb.gov.tw/member/opendataapi?dataid="+ dataid +"&authorizationkey=" + authorizationkey;
		console.log("[jobParseForecast] start, url = " + url);
		Parse.Cloud.httpRequest({
		  url: url,
		  headers: {
			'Accept-Encoding':'gzip, deflate',
			'Accept':'text/html, application/xhtml+xml',
			'Accept-Language':'zh-TW',
			'Cache-Control':'no-cache',
			'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36',
			'Host':'opendata.cwb.gov.tw',
			'Connection':'Keep-Alive',
		  },
		  success: function(httpResponse) {		  
			//console.log("[jobParseForecast] " + decodeURIComponent(escape(httpResponse.text.substring(400, 600))));
			var xmlStr = decodeURIComponent(escape(httpResponse.text));
			//console.log("[jobParseForecast] xmlStr = " + xmlStr);
			
			var result = xmlStr;
			
			var file = new Parse.File(dataid + ".xml", { base64: httpResponse.buffer.toString('base64', 0, httpResponse.buffer.length) });
			file.save({
				success: function(file) {
					var ForecastXmlData = Parse.Object.extend("ForecastXmlData");
					var forecastXmlData = new ForecastXmlData();
					 
					forecastXmlData.set("dataid", dataid);
					forecastXmlData.set("xml", file);
					forecastXmlData.save(null, {
					  success: function(forecastXmlData) {
						console.log("[jobParseForecast] New object created with objectId: " + forecastXmlData.id + ", completeCount = " + completeCount);
						//response.success("[jobParseForecast] New object created with objectId: " + forecastXmlData.id);
						
						completeCount++;
						if (completeCount >= taskTotalCount) {
							console.log("[jobParse72hrForecast] complete " + completeCount + " requests.");
							status.success("[jobParse72hrForecast] complete " + completeCount + " requests.");
						}
					  },
					  error: function(forecastXmlData, error) {
						console.log("[jobParseForecast] Create object failed.");
						//response.error("[jobParseForecast] Create object failed.");
						
						completeCount++;
						if (completeCount >= taskTotalCount) {
							console.log("[jobParse72hrForecast] complete " + completeCount + " requests.");
							status.success("[jobParse72hrForecast] complete " + completeCount + " requests.");
						}
					  }
					});
				},
				error: function(error) {
					console.log('[jobParse72hrForecast] Failed to save file: ' + error.description);
					
					completeCount++;
					if (completeCount >= taskTotalCount) {
						console.log("[jobParse72hrForecast] complete " + completeCount + " requests.");
						status.success("[jobParse72hrForecast] complete " + completeCount + " requests.");
					}
				}
			});
			
			var endTime = new Date().getTime() - startTime;
//			console.log('[jobParseForecast] Request success, Execution time: ' + endTime);
		  },
		  error: function(httpResponse) {
			console.error("[jobParseForecast] " + 'Request failed with response code ' + httpResponse.status + ", dataid = " + dataid);
			
			var endTime = new Date().getTime() - startTime;
			console.log('[jobParseForecast] Execution time: ' + endTime);
			
			completeCount++;
			if (completeCount >= dataidArrayLength) {
				console.log("[jobParse72hrForecast] complete " + completeCount + " requests.");
				status.success("[jobParse72hrForecast] complete " + completeCount + " requests.");
			}
		  }
		});
}

Parse.Cloud.job("jobParseForecast", function(request, status) {
	var authorizationkey = request.params.authorizationkey;
	if (authorizationkey == null) {
		console.error("[parseForecast] authorizationkey is required.");
		response.error("[parseForecast] authorizationkey is required.");
		return;
	}
	
	var dataidArray = [
						"F-D0047-001",	// 宜蘭縣未來2天天氣預報
						"F-D0047-003",	// 宜蘭縣未來1週天氣預報
						
						"F-D0047-005",	// 桃園縣未來2天天氣預報
						"F-D0047-007",	// 桃園縣未來1週天氣預報
						
						"F-D0047-009",	// 新竹縣未來2天天氣預報
						"F-D0047-011",	// 新竹縣未來1週天氣預報
						
						"F-D0047-013",	// 苗栗縣未來2天天氣預報
						"F-D0047-015",	// 苗栗縣未來1週天氣預報
						
						"F-D0047-017",	// 彰化縣未來2天天氣預報
						"F-D0047-019",	// 彰化縣未來1週天氣預報
						
						"F-D0047-021",	// 南投縣未來2天天氣預報
						"F-D0047-023",	// 南投縣未來1週天氣預報
						
						"F-D0047-025",	// 雲林縣未來2天天氣預報
						"F-D0047-027",	// 雲林縣未來1週天氣預報
						
						"F-D0047-029",	// 嘉義縣未來2天天氣預報
						"F-D0047-031",	// 嘉義縣未來1週天氣預報
						
						"F-D0047-033",	// 屏東縣未來2天天氣預報
						"F-D0047-035",	// 屏東縣未來1週天氣預報
						
						"F-D0047-037",	// 臺東縣未來2天天氣預報
						"F-D0047-039",	// 臺東縣未來1週天氣預報
						
						"F-D0047-041",	// 花蓮縣未來2天天氣預報
						"F-D0047-043",	// 花蓮縣未來1週天氣預報
						
						"F-D0047-045",	// 澎湖縣未來2天天氣預報
						"F-D0047-047",	// 澎湖縣未來1週天氣預報
						
						"F-D0047-049",	// 基隆市未來2天天氣預報
						"F-D0047-051",	// 基隆市未來1週天氣預報
						
						"F-D0047-053",	// 新竹市未來2天天氣預報
						"F-D0047-055",	// 新竹市未來1週天氣預報
						
						"F-D0047-057",	// 嘉義市未來2天天氣預報
						"F-D0047-059",	// 嘉義市未來1週天氣預報
						
						"F-D0047-061",	// 臺北市未來2天天氣預報
						"F-D0047-063",	// 臺北市未來1週天氣預報
						
						"F-D0047-065",	// 高雄市未來2天天氣預報
						"F-D0047-067",	// 高雄市未來1週天氣預報
						
						"F-D0047-069",	// 新北市未來2天天氣預報
						"F-D0047-071",	// 新北市未來1週天氣預報
						
						"F-D0047-073",	// 臺中市未來2天天氣預報
						"F-D0047-075",	// 臺中市未來1週天氣預報
						
						"F-D0047-077",	// 臺南市未來2天天氣預報
						"F-D0047-079",	// 臺南市未來1週天氣預報
						
						"F-D0047-081",	// 連江縣未來2天天氣預報
						"F-D0047-083",	// 連江縣未來1週天氣預報
						
						"F-D0047-085",	// 金門縣未來2天天氣預報
						"F-D0047-087"	// 金門縣未來1週天氣預報
						];
	
	completeCount = 0;
	var dataidArrayLength = dataidArray.length;
	for (var i=0; i<dataidArrayLength; i++) {
		var startTime = new Date().getTime();
		
		var dataid = dataidArray[i];
		
		requestXmlAsync(dataid, authorizationkey, status, dataidArrayLength);
	}
	
	//status.success("[jobParse72hrForecast] start");
	console.log("[jobParse72hrForecast] start");
});

Parse.Cloud.define("parseForecast", function(request, response) {	
	var startTime = new Date().getTime();

	var authorizationkey = request.params.authorizationkey;
	if (authorizationkey == null) {
		console.error("[parseForecast] authorizationkey is required.");
		response.error("[parseForecast] authorizationkey is required.");
		return;
	}
	
	var dataid = request.params.dataid;
	if (dataid == null) {
		console.error("[parseForecast] dataid is required.");
		response.error("[parseForecast] dataid is required.");
		return;
	}
	
	var geocode = request.params.geocode;
	if (geocode == null) {
		console.error("[parseForecast] geocode is required.");
		response.error("[parseForecast] geocode is required.");
		return;
	}
	
	var ForecastXmlData = Parse.Object.extend("ForecastXmlData");
	var query = new Parse.Query(ForecastXmlData);
	query.equalTo("dataid", dataid);
	query.descending("createdAt");
	query.limit(1);
	query.find({
	  success: function(forecastXmlDataArray) {
		if (forecastXmlDataArray.length > 0) {
			var xml = forecastXmlDataArray[0].get("xml");
			console.log("[parseForecast] xml.url = " + xml.url());
			
			Parse.Cloud.httpRequest({
			  url: xml.url(),
			  success: function(httpResponse) {	
				//console.log("[parseForecast] " + decodeURIComponent(escape(httpResponse.text.substring(400, 600))));
				var xmlStr = decodeURIComponent(escape(httpResponse.text));
				//console.log("[parseForecast] xmlStr = " + xmlStr);
				
				console.log("[parseForecast] geocode = " + geocode);
				
				var geocodePos = xmlStr.indexOf(geocode);
				console.log("[parseForecast] geocodePos = " + geocodePos);
				
				if (geocodePos < 0) {
					response.error("[parseForecast] geocode not found in xml.");
					return;
				}
				
				var start = 0;
				var locationPosList = [];
				
				do {
					var locationPos = xmlStr.indexOf("<location>", start);
					start = locationPos + 1;
					if (locationPos > 0) {
						locationPosList.push(locationPos);
					}
					console.log("[parseForecast] locationPos = " + locationPos);
				} while (start > 0);
				
				console.log("[parseForecast] locationPosList = " + locationPosList);
				
				var result = xmlStr;
				var trimedLength = 0;
				var trimPosStart = 0;
				var trimPosEnd = result.length;
				var locationPosListLength = locationPosList.length;
				console.log("[parseForecast] locationPosListLength = " + locationPosListLength);
				
				var isFound = false;
				for (var i = 0; i < locationPosListLength; i++) {
					if (i<locationPosList.length-1) {
						if (locationPosList[i] < geocodePos && locationPosList[i+1] < geocodePos) { // not in this place
							var removeStr = result.substring(locationPosList[i]-trimedLength, locationPosList[i+1]-trimedLength);
							var pos = result.indexOf(removeStr);
							result = result.replace(removeStr, "");
							trimedLength += locationPosList[i+1] - locationPosList[i];
						}
						
						if (isFound == true) { // not in this place
							var removeStr = result.substring(locationPosList[i]-trimedLength, locationPosList[i+1]-trimedLength);
							var pos = result.indexOf(removeStr);
							result = result.replace(removeStr, "");
							
							trimedLength += locationPosList[i+1] - locationPosList[i];
						}
						
						if (locationPosList[i] < geocodePos &&  geocodePos < locationPosList[i+1]) { // found
							isFound = true;
						}
					} else {	// last element
						console.log("[parseForecast] i = " + i);
						if (isFound) {	// remove last element
							var endPos = xmlStr.indexOf("</location>", locationPosList[i]);
							var removeStr = result.substring(locationPosList[i]-trimedLength, endPos+11-trimedLength);
							var pos = result.indexOf(removeStr);
							result = result.replace(removeStr, "");
						}
					}
				}
				
				var ForecastXmlData = Parse.Object.extend("ForecastXmlData");
				var forecastXmlData = new ForecastXmlData();
				 
				forecastXmlData.set("geocode", geocode);
				forecastXmlData.set("xml", result);
				forecastXmlData.save(null, {
				  success: function(forecastXmlData) {
					response.success("[parse72hrForecast] New object created with objectId: " + forecastXmlData.id);
				  },
				  error: function(forecastXmlData, error) {
					response.error("[parse72hrForecast] Create object failed.");
				  }
				});
				
				var endTime = new Date().getTime() - startTime;
				console.log('[parse72hrForecast] Execution time: ' + endTime);
				
				response.success(result);

			  },
			  error: function(httpResponse) {
				console.error("[parse72hrForecast] " + 'Request failed with response code ' + httpResponse.status);
				response.error("[parse72hrForecast] " + 'Request failed with response code ' + httpResponse.status);
			  }
			});
		} else {
			response.error("[parseForecast] Cannot retrive XML.");
		}
	  },
	  error: function(error) {
		response.error("[parseForecast] Error: " + error.code + " " + error.message);
	  }
	});
	
	return;
	
	var url = "http://opendata.cwb.gov.tw/member/opendataapi?dataid="+ dataid +"&authorizationkey=" + authorizationkey;
	console.log("[parseForecast] start, url = " + url);
	Parse.Cloud.httpRequest({
	  url: url,
	  headers: {
	    'Accept-Encoding':'gzip, deflate',
		'Accept':'text/html, application/xhtml+xml',
		'Accept-Language':'zh-TW',
		'Cache-Control':'no-cache',
        'User-Agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36',
		'Host':'opendata.cwb.gov.tw',
		'Connection':'Keep-Alive',
	  },
	  success: function(httpResponse) {		
	  	//console.log("[parseForecast] " + decodeURIComponent(escape(httpResponse.text.substring(400, 600))));
	    var xmlStr = decodeURIComponent(escape(httpResponse.text));
		//console.log("[parseForecast] xmlStr = " + xmlStr);
		
		console.log("[parseForecast] geocode = " + geocode);
		
		var geocodePos = xmlStr.indexOf(geocode);
		console.log("[parseForecast] geocodePos = " + geocodePos);
		
		if (geocodePos < 0) {
			response.error("[parseForecast] geocode not found in xml.");
			return;
		}
		
		var start = 0;
		var locationPosList = [];
		
		do {
			var locationPos = xmlStr.indexOf("<location>", start);
			start = locationPos + 1;
			if (locationPos > 0) {
				locationPosList.push(locationPos);
			}
			console.log("[parseForecast] locationPos = " + locationPos);
		} while (start > 0);
		
		console.log("[parseForecast] locationPosList = " + locationPosList);
		
		var result = xmlStr;
		var trimedLength = 0;
		var trimPosStart = 0;
		var trimPosEnd = result.length;
		var locationPosListLength = locationPosList.length;
		console.log("[parseForecast] locationPosListLength = " + locationPosListLength);
		
		var isFound = false;
		for (var i = 0; i < locationPosListLength; i++) {
			if (i<locationPosList.length-1) {
				if (locationPosList[i] < geocodePos && locationPosList[i+1] < geocodePos) { // not in this place
					var removeStr = result.substring(locationPosList[i]-trimedLength, locationPosList[i+1]-trimedLength);
					var pos = result.indexOf(removeStr);
					result = result.replace(removeStr, "");
					trimedLength += locationPosList[i+1] - locationPosList[i];
				}
				
				if (isFound == true) { // not in this place
					var removeStr = result.substring(locationPosList[i]-trimedLength, locationPosList[i+1]-trimedLength);
					var pos = result.indexOf(removeStr);
					result = result.replace(removeStr, "");
					
					trimedLength += locationPosList[i+1] - locationPosList[i];
				}
				
				if (locationPosList[i] < geocodePos &&  geocodePos < locationPosList[i+1]) { // found
					isFound = true;
				}
			} else {	// last element
				console.log("[parseForecast] i = " + i);
				if (isFound) {	// remove last element
					var endPos = xmlStr.indexOf("</location>", locationPosList[i]);
					var removeStr = result.substring(locationPosList[i]-trimedLength, endPos+11-trimedLength);
					var pos = result.indexOf(removeStr);
					result = result.replace(removeStr, "");
				}
			}
		}
		
		var ForecastXmlData = Parse.Object.extend("ForecastXmlData");
		var forecastXmlData = new ForecastXmlData();
		 
		forecastXmlData.set("geocode", geocode);
		forecastXmlData.set("xml", result);
		forecastXmlData.save(null, {
		  success: function(forecastXmlData) {
			response.success("[parse72hrForecast] New object created with objectId: " + forecastXmlData.id);
		  },
		  error: function(forecastXmlData, error) {
			response.error("[parse72hrForecast] Create object failed.");
		  }
		});
		
		var endTime = new Date().getTime() - startTime;
		console.log('[parse72hrForecast] Execution time: ' + endTime);
		
		response.success(result);
	  },
	  error: function(httpResponse) {
		console.error("[parse72hrForecast] " + 'Request failed with response code ' + httpResponse.status);
		
		var endTime = new Date().getTime() - startTime;
		console.log('[parse72hrForecast] Execution time: ' + endTime);
		
		response.error();
	  }
	});
});
