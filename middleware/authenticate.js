const Future = require ('fluture');
const { Next, Redirect } = require ('../lib/fluture-express');
const S = require ('../lib/sanctuary');

const getUserSession = session =>
  session && session.user
    ? Future.resolve ({ user: session.user })
    : Future.reject ({ code: 401, message: 'Unaothorized API attempt' });

module.exports = (req, locals) =>
  Future.chainRej
    (_ => Future.resolve (Redirect (302) ('/login')))
    (S.map (Next)
           (S.map (S.concat (locals))
                  (getUserSession (req.session))));
