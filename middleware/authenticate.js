const Future = require ('fluture');
const $ = require ('sanctuary-def');
const { Next } = require ('../lib/fluture-express');
const S = require ('../lib/sanctuary');
const jwt = require ('../lib/jwt');

const getBearerToken = req =>
  S.maybe 
    (Future.reject ({code: 401, message: 'Invalid or missing authorization header'}))
    (Future.resolve)
    (S.chain 
      (authHeader =>
        S.array
          (S.Nothing)
          (head => tail =>
            head === 'Bearer'
              ? S.head (tail)
              : S.Nothing)
          (S.splitOn (' ') (authHeader)))
      (S.get (S.is ($.String)) ('authorization') (req.headers)));

module.exports = (req, locals) =>
  S.map (Next)
        (S.map (S.concat (locals))
               (S.chain (token => 
                          S.map (user => ({ user })) 
                                (jwt.verify (locals.config.apiSecret) (token)))
                        (getBearerToken (req))))
