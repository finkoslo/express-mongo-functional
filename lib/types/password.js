const $ = require ('sanctuary-def');
const S = require ('../sanctuary');
// The password length must be greater than or equal to 8
// The password must contain one or more uppercase characters
// The password must contain one or more lowercase characters
// The password must contain one or more numeric values
// The password must contain one or more special characters

// isValidPassword :: String -> Boolean
const isValidPassword = S.test (/(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/);

// $Password :: Type
module.exports = $.NullaryType ('Password') ('') ([$.String]) (isValidPassword);
