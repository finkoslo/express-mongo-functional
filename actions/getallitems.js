const S = require ('../lib/sanctuary');
const { Json } = require ('../lib/fluture-express');
const { find } = require ('../lib/db');

module.exports = (req, { db }) => 
  S.map (Json (200))
        (find (db) ({}) ('my-collection') ({}));
