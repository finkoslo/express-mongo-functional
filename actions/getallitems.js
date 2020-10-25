const S = require ('../lib/sanctuary');
const { Json } = require ('../lib/fluture-express');
const { find } = require ('../lib/db');

module.exports = req => 
  S.map (Json (200))
        (find ({}) ('my-collection') ({}));