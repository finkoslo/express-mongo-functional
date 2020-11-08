const Future = require ('fluture');
const { Next, Redirect } = require ('../lib/fluture-express');
const S = require ('../lib/sanctuary');

module.exports = (req, locals) =>
  S.map (Next)
        (S.map (S.concat (locals))
               (Future.resolve (req.session && req.session.user 
                                  ? { user: req.session.user }
                                  : {})));
