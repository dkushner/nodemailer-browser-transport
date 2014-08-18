'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var test = require('selenium-webdriver/testing');
var webdriver = require('selenium-webdriver');
var BrowserTransport = require('../src/browser-transport');

var MockBuilder = function(envelope, message) {
  this.envelope = envelope;
  this.message = new(require('stream').PassThrough)();
  this.message.end(message);
};

MockBuilder.prototype.getEnvelope = function() {
  return this.envelope;
};

MockBuilder.prototype.createReadStream = function() {
  return this.message;
};

describe('Browser Transport', function() {
  it ('should expose version number', function() {
    var transport = BrowserTransport();
    expect(transport.name).to.equal("Browser");
    expect(transport.version).to.exist;
  });

  it('should open message contents in browser', function(done) {
    var transport = BrowserTransport({
      browser: 'Firefox',
      directory: '/tmp/mailers'
    });

    transport.send({
      data: {},
      message: new MockBuilder({
        from: 'test@test.sender',
        to: 'test@test.recipient'
      }, 'omnia mutantur nihil interit')
    }, function(err, data) {
      expect(err).to.not.exist;
      if (err) {
        return done (err);
      }
      done();
    });
  });
});
