const Future = require ('fluture');
const $ = require ('sanctuary-def');
const { Json } = require ('../lib/fluture-express');
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
  S.map (Json (200))
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
                  (err => err === 404)
                  (_ => Future.resolve (userData))
                  (Future.reject))
                (S.chain
                  (_ => Future.reject (40001))
                  (findOne (db) ({}) ('users') ({ username: userData.username }))))
            (validate (postType) (req.body))));
