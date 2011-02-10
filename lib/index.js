var https = require('https'),
    querystring = require('querystring');

var Madmimi = module.exports = function (username, api_key, debug) {

  if (debug) {
    logger = console.log;
  }  else {
    logger = function () {};
  }

  if (!username || !api_key) {
    throw("need to specify username and api key")
  }

  var self = this;
  
  self.username = username,
  self.api_key = api_key;

   self.request = function(requestOptions, body, cb) {
    
    if(!cb) { cb = function () {} };

    var httpBody = undefined
    
    if (arguments.length > 2) {
      httpBody = body; 
    }
    
    var req = https.request(requestOptions, function(res) {
      res.body = "";

      logger('STATUS: ' + res.statusCode);
      logger('HEADERS: ' + JSON.stringify(res.headers));

      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        logger('BODY: ' + chunk);
        res.body += chunk;
      });

      res.on('end', function () {
        logger('end');        
        cb(res.body);
      });
    });

    if(httpBody) {
      req.write(optionsParameterized);
    };

    req.end();
  };



  self.sendMail = function (options, cb) {
    options.username = self.username;
    options.api_key = self.api_key;


    optionsParameterized = querystring.stringify(options, "&", "=");

    var requestOptions = {
      host: 'api.madmimi.com',
      port: '443',
      path: '/mailer',
      method: 'POST',
      headers: {'content-type': 'application/x-www-form-urlencoded'}
    };

    self.request(requestOptions, optionsParameterized, cb);
    
  };
 
  self.mailStatus = function(id, cb) {
    options = {
       username: self.username,
      api_key: self.api_key
     };

    optionsParameterized = querystring.stringify(options, "&", "=");
    transactionPath =  '/mailers/status/'+ id +'?' + optionsParameterized;

     var requestOptions = {
      host: 'madmimi.com',
      port: '443',
      path: transactionPath,
      method: 'GET',
    };
    
    self.request(requestOptions, optionsParameterized, cb);
  };

  
  return self;
};

