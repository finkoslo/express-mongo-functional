var bcrypt = require('bcrypt');
const Future = require ('fluture');

module.exports.cryptString = stringToCrypt =>
  Future.node 
    (callback => 
      bcrypt.genSalt (
        10, 
        (err, salt) => 
          err
            ? callback (err)
            : bcrypt.hash (stringToCrypt, salt, callback)));

module.exports.compareCryptString = plainString => hashString =>
  Future.node (callback => bcrypt.compare (plainString, hashString, callback));
