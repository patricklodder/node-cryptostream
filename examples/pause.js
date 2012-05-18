    var DecryptStream = require('../lib/cryptostream.js').DecryptStream;
    var EncryptStream = require('../lib/cryptostream.js').EncryptStream;
    
    var key = 'nodecryptostream';
    
    var e = new EncryptStream(key);
    var d = new DecryptStream(key);
    
    var buf = '';
    
    e.pipe(d);

    d.on('data', function(chunk) {
      if (chunk.length > 0)
        buf += chunk;
    });
    
    d.on('end', function() {
    	console.log(buf);
    });
    
    e.write("Hello world\n", 'binary');

    d.pause();

    e.write("Hello again world\n", 'binary');
    e.write("Hello once again\n", 'binary');

    setTimeout(function() {
    	d.resume();
    	e.end();
    }, 5000);