const $ = require ('sanctuary-def');
const Future = require ('fluture');
const S = require ('../lib/sanctuary');
const { findOne } = require ('../lib/db');
const { Json } = require ('../lib/fluture-express');
const $Password = require ('../lib/types/password');
const validate = require ('../lib/validate');
const { compareCryptString } = require ('../lib/crypto');

// postType :: Type
const postType = $.RecordType({
  username: $.String,
  password: $Password
});

module.exports = (req, { db }) =>
  S.map (Json (200))
        (S.chain
          (S.pair 
            (postData => user => 
              S.chain
                (S.ifElse 
                  (S.I)
                  (_ => { req.session.user = user; return Future.resolve ('OK') })
                  (_ => { req.session.user = null; return Future.reject (401) }))
                (compareCryptString (postData.password) (user.password))))
          (S.chain
            (postData => 
              S.map (S.Pair (postData))
                    (findOne (db) ({}) ('users') ({ username: postData.username })))
            (validate (postType) (req.body))));
        
  
