var HotelAPI = require('./hotel-api');
var Backbone = require('backbone');
var _ = require('underscore');

function HotelRequester(organization){
  this.requests = new Backbone.Collection();
  
  this.events = {};
  _.extend(this.events, Backbone.Events);
}

HotelRequester.prototype.request = function(param1, param2, callback) {
  var eventId = this._eventIdGenerator(param1, param2);
  this.events.once(eventId, callback);
  
  this._requestHotel(param1, param2, this._apiRequestDone(eventId));
};

HotelRequester.prototype._apiRequestDone = function(eventId) {
  return function(err, hotels) {
    this.events.trigger(eventId, err, this._hotelFormatter(hotels));
  }.bind(this);
};

HotelRequester.prototype._hotelFormatter = function(hotels) {
  var hotelList, hotel;
  try {
    hotelList = hotels.HotelListResponse.HotelList.HotelSummary;
    var i = 0;
    hotel = hotelList[i];
    while(!hotel.thumbNailUrl) {
      hotel = hotelList[i];
      if (!hotel) {
        hotel = hotelList[0];
        break;
      };
    }
  } catch (e) {}
  return hotel;
};

HotelRequester.prototype._requestHotel = function(param1, param2, callback) {
  var requestOptions = this._filterRequestOptions(param1, param2);
  HotelAPI.request(requestOptions, callback);
};

HotelRequester.prototype._filterRequestOptions = function(param1, param2, callback) {
  var orderedParams = this._ordered(param1, param2);
  param1 = orderedParams[0];
  param2 = orderedParams[1];
  
  var result = {
    latitude: param1.latitude,
    longitude: param1.longitude
  };
  
  result.minStarRating = param1.minStarRating > param2.minStarRating ? param1.minStarRating : param2.minStarRating;
  result.maxStarRating = param1.maxStarRating < param2.maxStarRating ? param1.maxStarRating : param2.maxStarRating;
  result.minRate = param1.minRate > param2.minRate ? param1.minRate : param2.minRate;
  result.maxRate = param1.maxRate < param2.maxRate ? param1.maxRate : param2.maxRate;
  result.maxRadius = param1.maxRadius < param2.maxRadius ? param1.maxRadius : param2.maxRadius;
  
  return result;
}

HotelRequester.prototype._eventIdGenerator = function(param1, param2) {
  var orderedArray = this._ordered(param1, param2);
  return orderedArray[0].id + "-" + orderedArray[1].id;
};

HotelRequester.prototype._ordered = function(param1, param2) {
  var id1 = param1.id, id2 = param2.id;
  if (id1 > id2) {
    return [param1, param2];
  } else {
    return [param2, param1];
  }
};



module.exports = new HotelRequester();
