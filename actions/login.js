const $ = require ('sanctuary-def');
const Future = require ('fluture');
const S = require ('../lib/sanctuary');
const { findOne } = require ('../lib/db');
const { Json } = require ('../lib/fluture-express');
const $Password = require ('../types/password');
const validate = require ('../lib/validate');
const { compareCryptString } = require ('../lib/crypto');
const jwt = require ('../lib/jwt');

// $PostType :: Type
const $PostType = $.RecordType({
  username: $.String,
  password: $Password
});

module.exports = (req, { db, config }) =>
  S.map (Json (200))
        (S.chain
          (S.pair 
            (postData => user => 
              S.chain
                (S.ifElse 
                  (S.I)
                  (_ => jwt.sign (config.apiSecret) (user))
                  (_ => Future.reject ({ code: 401, message: `Wrong password for user ${user.username}` })))
                (compareCryptString (postData.password) (user.password))))
          (S.chain
            (postData => 
              S.map (S.Pair (postData))
                    (findOne (db) ({}) ('users') ({ username: postData.username })))
            (validate ($PostType) (req.body))));
        
  
