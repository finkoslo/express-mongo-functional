
const $ = require ('sanctuary-def');
const S = require ('../sanctuary');

// isValidEmail :: String -> Boolean
const isValidEmail = S.test (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

// $Email :: Type  
module.exports = $.NullaryType ('Email') ('') ([$.String]) (isValidEmail);
