'use strict';

var packageData = require('../package.json');
var wellknown = require('nodemailer-wellknown');
var open = require('open');
var Stream = require('stream');
var fs = require('fs');
var path = require('path');
var EventEmitter = require('events').EventEmitter;

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
};

BrowserTransport.prototype.send = function(mail, callback) {
  var filePath = path.join(this.options.dir, 'mailer-' + Date.now().toString());
  var out = fs.createWriteStream(filePath);

  var email = mail.data;
  if (email.html) {
    out.write(email.html);
    out.end();
  }

  var options = this.options;
  out.on('close', function() {
    var proc = open(filePath, options.browser);

    proc.on('error', function(err) {
      callback(err);
    });

    proc.on('exit', function() {
      callback(null, mail);
    });
  });

  out.on('error', function(err) {
    callback(err);
  });
};

module.exports = function(options) {
  return new BrowserTransport(options);
};


