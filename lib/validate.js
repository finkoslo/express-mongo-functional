const Future = require ('fluture');
const S = require ('./sanctuary');

// validate :: Type -> Any -> Future Int Any
module.exports = type =>
  S.ifElse
    (S.is (type))
    (Future.resolve)
    (data => Future.reject ({ code: 400, message: `Validation failed, Got: ${data}, expected: ${type}`}))
