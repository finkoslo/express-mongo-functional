const Future = require ('fluture');
const $ = require ('sanctuary-def');
const S = require ('./sanctuary');

// isValidEmail :: String -> Boolean
const isValidEmail = S.test (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

// $Email :: Type  
module.exports.$Email = $.NullaryType ('Email') ('') ([$.String]) (isValidEmail);

// validate :: Type -> Any -> Future Int Any
module.exports.validate = type =>
  S.ifElse
    (S.is (type))
    (Future.resolve)
    (_ => Future.reject (400))