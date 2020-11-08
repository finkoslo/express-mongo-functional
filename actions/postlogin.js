const $ = require ('sanctuary-def');
const Future = require ('fluture');
const S = require ('../lib/sanctuary');
const { findOne } = require ('../lib/db');
const { Redirect } = require ('../lib/fluture-express');
const $Password = require ('../lib/types/password');
const validate = require ('../lib/validate');
const { compareCryptString } = require ('../lib/crypto');

// postType :: Type
const postType = $.RecordType({
  username: $.String,
  password: $Password
});

module.exports = (req, { db }) =>
  S.map (Redirect (302))
        (S.chain
          (S.pair 
            (postData => user => 
              S.chain
                (S.ifElse 
                  (S.I)
                  (_ => { req.session.user = user; return Future.resolve ('/') })
                  (_ => { req.session.user = null; return Future.reject ({ code: 401, message: `Wrong password for user ${user.username}` }) }))
                (compareCryptString (postData.password) (user.password))))
          (S.chain
            (postData => 
              S.map (S.Pair (postData))
                    (findOne (db) ({}) ('users') ({ username: postData.username })))
            (validate (postType) (req.body))));
        
  
