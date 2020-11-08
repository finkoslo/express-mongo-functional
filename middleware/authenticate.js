const Future = require ('fluture');
const { Next, Redirect } = require ('../lib/fluture-express');
const S = require ('../lib/sanctuary');

module.exports = (req, locals) =>
  S.ifElse
    (req => !!req.session && !!req.session.user)
    ( _ => Future.resolve (Next (locals)))
    (_ => Future.resolve (Redirect (302) ('/login')))
    (req)
