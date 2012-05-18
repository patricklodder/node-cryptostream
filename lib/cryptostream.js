var crypto = require('crypto');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function CryptoStream(key, cipher) {
  this._key = key;
  this._cipher = cipher;
  
  this.queue = [];
  this.paused = false;
  
  this.writable = true;
  this.readable = true;
}

util.inherits(CryptoStream, EventEmitter);
exports.CryptoStream = CryptoStream;

CryptoStream.prototype.write = function(data) {
	if (!this.writable) {
		throw new Error('The cryptostream is no longer writable.');
	}
	
	if (!this.paused && this.queue.length === 0) {
		this.emit("data", this._cipher.update(data));
	} else {
		this.queue.push(data);
	}
	
	return true;
};

CryptoStream.prototype.end = function(data) {
  if (typeof(data) !== 'undefined') {
    this.emit("data", this._cipher.update(data));
  }
  
  while (this.flush());
  
  this.emit("data", this._cipher.final());
  
  this.writable = false;
  this.readable = false;
  
  this.emit("end");
};

CryptoStream.prototype.pipe = function(dest) {
  util.pump(this, dest);
};

CryptoStream.prototype.pause = function () {
	this.paused = true;
};

CryptoStream.prototype.resume = function() {
	this.paused = false;
	while (this.flush());
};

CryptoStream.prototype.flush = function () {
	
	if ( !this.paused && this.readable && this.queue.length > 0) {	
		this.emit('data', this._cipher.update(this.queue.shift()));	
		return true;
	}
	
	return false;
};

CryptoStream.prototype.destroy = function() {
	
	this.end();
	
	this.queue = [];
	
	this.readable = false;
	this.writable = false;
};

var EncryptStream = function(key) {
  EncryptStream.super_.call(this, key, crypto.createCipher('aes-256-cbc', key));
};

util.inherits(EncryptStream, CryptoStream);
exports.EncryptStream = EncryptStream;

var DecryptStream = function(key) {
  DecryptStream.super_.call(this, key, crypto.createDecipher('aes-256-cbc', key));
};

util.inherits(DecryptStream, CryptoStream);
exports.DecryptStream = DecryptStream;
