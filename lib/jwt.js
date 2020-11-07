const jwt = require ('jsonwebtoken');
const Future = require ('fluture');

// sign :: String -> Any -> Future Err String
module.exports.sign = key => item =>
  Future.node (done => jwt.sign (item, key, {expiresIn: '1h'},done));

// verify :: String -> String -> Future Object Any
module.exports.verify = key => token =>
  Future.chainRej
    (err => Future.reject ({code: 401, message: `Invalid auth token. Reason: ${err.message}`}))
    (Future.node (done => jwt.verify (token, key, done)))
