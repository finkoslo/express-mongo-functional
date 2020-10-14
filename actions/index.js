const S = require ('../lib/sanctuary');
const { Json } = require ('../lib/fluture-express');
const { deleteMany } = require ('../lib/db');

module.exports = req => 
  S.map (Json (200))
        (deleteMany ('tull') ({d: 'i'}) ({}));