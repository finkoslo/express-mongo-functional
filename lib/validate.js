const Future = require ('fluture');
const S = require ('./sanctuary');

// validate :: Type -> Any -> Future Int Any
module.exports = type =>
  S.ifElse
    (S.is (type))
    (Future.resolve)
    (_ => Future.reject (400))
