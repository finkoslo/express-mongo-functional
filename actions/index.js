const Future = require ('fluture');
const { Json } = require ('../lib/fluture-express');
const S = require ('../lib/sanctuary');
const { deleteMany } = require ('../lib/db');

module.exports = req => 
  S.map (result => Json (200) (result))
        (deleteMany ('tull') ({d: 'i'}) ({}));