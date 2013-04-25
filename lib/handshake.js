var calculateDistance = require('./distance-calculation');
var Backbone = require('backbone');

function Handshake(organization){
  this.handshakes = new Backbone.Collection();
  this.handshakeHistory = new Backbone.Collection();
}

Handshake.prototype.request = function(params) {
  this.handshakes.remove(params);
  this.handshakes.add(params);
  this.handshakeHistory.add(params);
  return this.handshakes.get(params.id);
};

Handshake.prototype.doHandshake = function(shakeId) {
  if(this.handshakes.length < 2) return false;
  this._purger();
  
  var shaker = this.handshakes.get(shakeId);
  if (!shaker) return false;
  
  var otherShaker = this.handshakes.find(function (shakee) {
    if (shakee.id == shaker.id) return false;

    var distance = calculateDistance(shakee.get('latitude'), shakee.get('longitude'), shaker.get('latitude'), shaker.get('longitude'), 'M');
    return distance < 0.15;
  });
  
  return otherShaker;
};

Handshake.prototype._purger = function() {
  var purgeTime = 10000; // 10 seconds
  var now = new Date();
  var outdatedHandshakes = this.handshakes.filter(function(handshake) {
    return (now - handshake.get('timestamp')) > 10000;
  });
  this.handshakes.remove(outdatedHandshakes);
};


module.exports = new Handshake();