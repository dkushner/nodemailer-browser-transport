'use strict';

var wellknown = require('nodemailer-wellknown');
var open = require('node-open');
var EventEmitter = require('events').EventEmitter;

var BrowserTransport = function(options) {
  this.options = options || {};

  if (this.options.service && (hostData = wellknown(this.options.service)) {
    Object.keys(hostData).forEach(function(key) {
      if (!(key in this.options)) {
        this.options[key] = hostData[key];
      }
    }.bind(this));
  }

  this.name = 'Browser';
};

BrowserTransport.prototype.send = function(mail, callback) {
  console.log(mail);
};

module.exports = function(options) {
  return new BrowserTransport(options);
};


