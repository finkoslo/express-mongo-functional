const Future = require ('fluture');
const S = require ('../lib/sanctuary');
const $ = require ('sanctuary-def');
const { Json } = require ('../lib/fluture-express');

// makeResult :: Integer -> Object
const makeResult = status => {
  switch (status) {
    case 400:
      return S.Pair (400) ('Bad request');
    case 401:
      return S.Pair (401) ('Unauthorized');
    case 403:
      return S.Pair (403) ('Forbidden');
    case 404:
      return S.Pair (404) ('Not found');
    default:
      return S.Pair (500) ('Internal Server Error');
  }
}

// customError :: Type
const customError = $.RecordType({
  code: $.Integer,
  message: $.String
});

module.exports = (err, req, res, next) =>
  S.map
    (S.pair (Json))
    (S.ifElse
      (S.is (customError))
      (err => console.error (err.message) || Future.resolve (makeResult (err.code)))
      (err => console.error (err) || Future.resolve (makeResult (500)))
      (err))

          
