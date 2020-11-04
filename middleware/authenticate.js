const Future = require ('fluture');
const { Next } = require ('../lib/fluture-express');
const S = require ('../lib/sanctuary');

const getUserSession = session =>
  session && session.user
    ? Future.resolve ({ user: session.user })
    : Future.reject ({ code: 401, message: 'Unaothorized API attempt' });

module.exports = (req, locals) =>
  S.map (Next)
        (S.map (S.concat (locals))
               (getUserSession (req.session)))
