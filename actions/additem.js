const $ = require ('sanctuary-def');
const { Json } = require ('../lib/fluture-express');
const S = require ('../lib/sanctuary');
const { insertOne } = require ('../lib/db');
const { validate, $Email } = require ('../lib/validator');

const postType = $.RecordType({
  name: $.String,
  email: $Email
});

module.exports = (req, { db }) => 
  S.map (Json (200))  
        (S.chain (insertOne (db) ({}) ('my-collection'))
                 (validate (postType) (req.body.item)))
