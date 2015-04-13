Parse.Cloud.job("jobParseForecast", function(request, status) {
/*	Parse.Cloud.run("parseForecast", {'geocode':'6500600', 'authorizationkey':'CWB-112E2424-51BD-402B-8E27-168BE7BD36AE','dataid':'F-D0047-071'}, {
	  success: function(result) {
		status.success("jobParse72hrForecast successfully.");
	  },
	  error: function(error) {
		status.success("jobParse72hrForecast error.");
	  }
	});*/
	
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
	
	status.success("[jobParse72hrForecast] call parse72hrForecast");
	console.log("[jobParse72hrForecast] call parse72hrForecast");
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
