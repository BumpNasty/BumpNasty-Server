var http = require('http');
var CabforceAPI = require('../lib/cabforce-api');

function Cabforce(app) {
	app.get('/taxi/coverage', function(req, res) {

		var params = {
			lat: parseFloat(req.param('latitude')),
			lng: parseFloat(req.param('longitude'))
		};

		CabforceAPI.request('geo', 'coverage', params, function(err, data) {
			if (err) res.send(err);
			
			var response = {
				coverage: false
			};
			
			if (data.status == 'Ok' && data.result == 'true') 
				response.coverage = true;
			
			res.send(response);
		});
		
	});
	
	app.get('/taxi/search', function(req, res) {
		
		var request = req;
		var result = res;
		
		console.log('test');
		
		http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+parseFloat(req.param('latitude'))+','+parseFloat(req.param('longitude'))+'&sensor=false', function(response) {
			
	        var str = '';
	        response.on('data', function (chunk) {
		  		  
	          str += chunk;
			  
	        });

	        response.on('end', function () {
	          var jsonObj;
	          eval("jsonObj = "+str);
			  			  
	  			var pickup = {
	  				type: "1",
	  				address: jsonObj.results[0].formatted_address,
	  				location: {
	  					lat: parseFloat(request.param('latitude')),
	  					lng: parseFloat(request.param('longitude'))
	  				}
	  			}
					
	  			var destination = {
	  				type: "2",
	  				address: 'Leidseplein 1, Amsterdam, The Netherlands',
	  				location: {
	  					lat: 52.3643347,
	  					lng: 4.8833405
	  				}
	  			}
					
	  			var params = {
	  				chnl: CabforceAPI.channel,
	  				pickupDateTime: CabforceAPI.formatDate(new Date()),
	  				lang: 'en',
	  				addresses: [
	  					pickup,
	  					destination
	  				]
	  			};
					
	  			console.log(params);
			
	  			CabforceAPI.request('booking', 'search', params, function(err, data) {
	  				if (err) result.send(err);
			
	  				result.send(data);
	  			});	
	          // callback(null, (new Date()).toISOString());
	        });
						
		}).on('error', function(e) {			
			res.send(e);
		});
		
	});
}

module.exports = Cabforce;