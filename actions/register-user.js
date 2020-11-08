const Future = require ('fluture');
const $ = require ('sanctuary-def');
const { Redirect } = require ('../lib/fluture-express');
const S = require ('../lib/sanctuary');
const $Password = require ('../lib/types/password');
const validate = require ('../lib/validate');
const { insertOne, findOne } = require ('../lib/db');
const { cryptString } = require ('../lib/crypto');

// postType :: Type
const postType = $.RecordType({
  username: $.String,
  password: $Password
});

module.exports = (req, { db }) =>
  S.map (user => { req.session.user = user; return Redirect (302) ('/') })
        (S.chain 
          (userData =>
            S.chain
              (insertOne (db) ({}) ('users'))
              (S.map
                (encryptedPassword => S.concat (userData) ({ password: encryptedPassword }))
                (cryptString (userData.password))))
          (S.chain
            (userData =>
              Future.chainRej
                (S.ifElse
                  (err => err.code === 404)
                  (_ => Future.resolve (userData))
                  (Future.reject))
                (S.chain
                  (user => Future.reject ({ code: 40301, message: `User: ${user.username} already exists` }))
                  (findOne (db) ({}) ('users') ({ username: userData.username }))))
            (Future.mapRej 
              (_ => ({ code: 40302, message: 'Invalid username or passord submitted when registering' }))
              (validate (postType) (req.body)))));
