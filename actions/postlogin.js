const $ = require ('sanctuary-def');
const Future = require ('fluture');
const S = require ('../lib/sanctuary');
const { findOne } = require ('../lib/db');
const { Redirect, Render } = require ('../lib/fluture-express');
const validate = require ('../lib/validate');
const { compareCryptString } = require ('../lib/crypto');

// postType :: Type
const postType = $.RecordType({
  username: $.String,
  password: $.String
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
                  (_ => { 
                    req.session.user = null; 
                    return Future.reject ({ code: 40101, message: `Wrong password for user ${user.username}` }) }))
                (compareCryptString (postData.password) (user.password))))
          (S.chain
            (postData => 
              Future.mapRej
                (S.ifElse
                  (err => err.code === 404)
                  (_ => ({code: 40101, message: `Could not find user ${postData.username}`}))
                  (S.I))
                (S.map (S.Pair (postData))
                       (findOne (db) ({}) ('users') ({ username: postData.username }))))
            (validate (postType) (req.body))));
        
  
