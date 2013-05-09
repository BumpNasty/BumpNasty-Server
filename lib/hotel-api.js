var http = require('http');

var APIKEY = process.env.EANAPIKEY;
var CID = process.env.EANCID;

if (!APIKEY || !CID) {
  var eanConfig = require('../config/ean.js');
  APIKEY = eanConfig.apiKey;
  CID = eanConfig.cid;
};

var API = {
  request: function(options, callback){
    var minStarRating = options.minStarRating;
    var maxStarRating = options.maxStarRating;
    var minRate = options.minRate;
    var maxRate = options.maxRate;
    var maxRadius = options.maxRadius;
    var radiusUnit = options.unit || "KM"; // KM/MI
    
    var sort = options.sort || "PROXIMITY";
    var arrivalDate = new Date();
    var departureDate = new Date(arrivalDate.getFullYear(), arrivalDate.getMonth(), arrivalDate.getDate() + 1);
    var currency = "EUR" // EUR/USD
    
    var url = '/ean-services/rs/hotel/v3/list?cid='+ CID +
              '&minorRev=20&apiKey='+ APIKEY +
              '&locale=en_US&currencyCode='+ currency +
              '&sort='+ sort +
              '&arrivalDate='+ this._formatDate(arrivalDate) + 
              '&departureDate=' + this._formatDate(departureDate) + 
              '&room1=2&_type=json&latitude=' + options.latitude + '&longitude=' + options.longitude;
              
    if (minStarRating) url += "&minStarRating=" + minStarRating;
    if (maxStarRating) url += "&maxStarRating=" + maxStarRating;
    if (minRate) url += "&minRate=" + minRate;
    if (maxRate) url += "&maxRate=" + maxRate;
    if (maxRadius) url += "&searchRadius=" + maxRadius + "&searchRadiusUnit=" + radiusUnit;
    
    var request = { hostname: 'api.ean.com', path: url };
    console.log(url);

    http.get(request, function(response) {
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
    }).on('error', function(e) {
      callback('Error: '+ e.message);
    });
  },
  bookingRequest: function(options) {
    // required
    var hotelId;
    var arrivalDate;
    var departureDate;
    var supplierType;
    var rateKey;
    var roomTypeCode;
    var rateCode;
    var RoomGroup = {
      Room: [],
      numberOfAdults: 2,
      firstName: null,
      lastName: null,
      bedTypeId: null,
      // numberOfBeds: null,
      smokingPreference: null
    };
    var chargeableRate;
    var ReservationInfo = {
      email: null,
      firstName: null,
      lastName: null,
      homePhone: null,
      creditCardType: null,
      creditCardNumber: "",
      creditCardIdentifier: "",
      creditCardExpirationMonth: "",
      creditCardExpirationYear: null
    }
    var AddressInfo = {
      address1: null,
      city: null
    }
    var stateProvinceCode; // US, CA & AU only
    var countryCode;
    var postalCode;
    
    var url = '/ean-services/rs/hotel/v3/res?cid='+ CID +
              '&minorRev=20&apiKey='+ APIKEY +
              '&locale=en_US&currencyCode='+ currency +
              '&sort='+ sort +
              '&arrivalDate='+ this._formatDate(arrivalDate) + 
              '&departureDate=' + this._formatDate(departureDate) + 
              '&room1=2&_type=json&latitude=' + options.latitude + '&longitude=' + options.longitude;
              
    if (minStarRating) url += "&minStarRating=" + minStarRating;
    
    var request = { hostname: 'book.ean.com', path: url };
    console.log(url);

    http.post(request, function(response) {
      // var str = '';
      // response.on('data', function (chunk) {
      //   str += chunk;
      // });
      // 
      // response.on('end', function () {
      //   var jsonObj;
      //   eval("jsonObj = "+str);
      //   
      //   callback(null, jsonObj);
      //   // callback(null, (new Date()).toISOString());
      // });
    }).on('error', function(e) {
      callback('Error: '+ e.message);
    });
  },
  _formatDate: function(date) {
    var pad = this._pad;
    return pad(date.getMonth()+1) + '/' 
      + pad(date.getDate()) + '/'
      + date.getFullYear()
  },
  _pad: function(n){ return n<10 ? '0'+n : n }
}


module.exports = API;