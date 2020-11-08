const S = require ('../lib/sanctuary');
const { Render } = require ('../lib/fluture-express');
const { find } = require ('../lib/db');

module.exports = (req, { user, db }) => 
  S.map (items => Render ('items') ({title: 'Items', items}))
        (find (db) ({}) ('my-collection') ({}));
