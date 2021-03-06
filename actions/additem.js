const $ = require ('sanctuary-def');
const { Json } = require ('../lib/fluture-express');
const S = require ('../lib/sanctuary');
const { insertOne } = require ('../lib/db');
const $Email = require ('../types/email');
const validate = require ('../lib/validate');

// $PostType :: Type
const $PostType = $.RecordType({
  name: $.String,
  email: $Email
});

module.exports = (req, { db }) => 
  S.map (Json (200))  
        (S.chain (insertOne (db) ({}) ('my-collection'))
                 (validate ($PostType) (req.body)))
