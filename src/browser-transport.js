'use strict';

var packageData = require('../package.json');
var wellknown = require('nodemailer-wellknown');
var webdriver = require('selenium-webdriver');
var fs = require('fs');
var path = require('path');
var EventEmitter = require('events').EventEmitter;

var Browser;
var BrowserTransport = function(options) {
  this.options = options || {};

  if (this.options.service && (hostData = wellknown(this.options.service))) {
    Object.keys(hostData).forEach(function(key) {
      if (!(key in this.options)) {
        this.options[key] = hostData[key];
      }
    }.bind(this));
  }

  this.name = 'Browser';
  this.version = packageData.version;
  this.options.dir = this.options.dir || "/tmp";

  if (!Browser) {
    var capabilities = webdriver.Capabilities.chrome();
    if (this.browser) {
      if (!Object.hasOwnProperty(this.browser)) {
        throw new Error("The specified browser is not supported.");
      }
      capabilities = webdriver.Capabilities[this.browser]();
    } 
    Browser = new webdriver.Builder().withCapabilities(capabilities).build();
  }
};

BrowserTransport.prototype.send = function(mail, callback) {
  var filePath = path.join(this.options.dir, 'mailer-' + Date.now().toString());
  var out = fs.createWriteStream(filePath);

  mail.message.createReadStream().pipe(out);

  out.on('close', function() {
    Browser.get('file://' + filePath)
    .then(function() {
      callback(null, mail);
    }, function(err) {
      done(err);      
    });
  });

  out.on('error', function(err) {
    callback(err);
  });
};

module.exports = function(options) {
  return new BrowserTransport(options);
};


