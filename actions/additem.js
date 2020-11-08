const $ = require ('sanctuary-def');
const { Redirect } = require ('../lib/fluture-express');
const S = require ('../lib/sanctuary');
const { insertOne } = require ('../lib/db');
const $Email = require ('../lib/types/email');
const validate = require ('../lib/validate');

const postType = $.RecordType({
  name: $.String,
  email: $Email
});

module.exports = (req, { db }) => 
  S.map (_ => Redirect (302) ('/items'))  
        (S.chain (insertOne (db) ({}) ('my-collection'))
                 (validate (postType) (req.body)));
