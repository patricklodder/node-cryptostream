Stream object for crypto.

Example Usage:

    var DecryptStream = require('./lib/cryptostream.js').DecryptStream;
    var EncryptStream = require('./lib/cryptostream.js').EncryptStream;
    
    var key = 'nodecryptostream';
    
    var e = new EncryptStream(key);
    var d = new DecryptStream(key);
    
    e.pipe(d);

    d.addListener('data', function(chunk) {
      if (chunk.length > 0)
        console.log('data: ' + chunk);
    });
    
    e.write("Hello world", 'binary');
    e.end();
