var https = require('https');

var APIKEY = process.env.CABFORCEAPIKEY;
var APPID = process.env.CABFORCEAPPID;
var APICHANNEL = process.env.CABFORCECHNL;

if (!APIKEY || !APPID) {
  var cabforceConfig = require('../config/cabforce.js');
  APPID = cabforceConfig.appId;
  APIKEY = cabforceConfig.apiKey;
  APICHANNEL = cabforceConfig.apiChannel;
};

var API = {
  request: function(type, method, options, callback){    
    var url = '/v1/' + type + '/' + method + '/' + 
			  '?appId=' + APPID + 
			  '&appKey=' + APIKEY;
                  
    var request = { hostname: 'apitest.cabforce.com', port: 443, path: url, method: 'POST' };
    console.log(url);

    var req = https.request(request, function(response) {
      var str = '';
      response.on('data', function (chunk) {
		  		  
        str += chunk;
      });

      response.on('end', function () {
        var jsonObj;
        eval("jsonObj = "+str);
        
        callback(null, jsonObj);
        // callback(null, (new Date()).toISOString());
      });
    })
	
	req.on('error', function(e) {
      callback('Error: '+ e.message);
    });
	
	var jsonData = JSON.stringify(options);
	
	console.log(jsonData);
	
	req.write(jsonData);
	req.end();
  },
  formatDate: function(date) {
    var pad = this._pad;
    return date.getFullYear()+"-" +
		date.getMonth()+1 + '-' +
      	date.getDate() + 'T' +
		date.getHours() + ':' +
		date.getMinutes()
  },
  channel: APICHANNEL
}

module.exports = API;