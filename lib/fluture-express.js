'use strict';

const daggy = require ('daggy');
const {fork, isFuture} = require ('fluture');
const path = require ('path');

const runAction = (name, action, req, res, next, err) => {
  const ret = err ? action (err) : action (req, res.locals);

  if (!isFuture (ret)) {
    throw new TypeError (
      `The "${name}" action did not return a Future, instead saw:\n\n  ${ret}`
    );
  }

  fork
    (next)
    (val => {
      if (!Response.is (val)) {
        throw new TypeError (`The Future returned by the "${
          name
        }" action did not resolve to a Response, instead saw:\n\n  ${val}`);
      }

      val.cata ({
        Stream: (code, mime, stream) => {
          res.type (mime);
          res.status (code);
          stream.pipe (res);
        },
        Json: (code, json) => {
          res.status (code);
          res.json (json);
        },
        Redirect: (code, url) => {
          res.redirect (code, url);
        },
        Empty: () => {
          res.status (204);
          res.end ();
        },
        Next: locals => {
          res.locals = locals;
          next ();
        },
        Render: (view, pageData) => {
          res.status (200);
          res.render (view, pageData);
        },
      });
    }) (ret);
};

const Response = daggy.taggedSum ('Response', {
  Stream: ['code', 'mime', 'stream'],
  Json: ['code', 'value'],
  Redirect: ['code', 'url'],
  Empty: [],
  Next: ['locals'],
  Render: ['view', 'pageData'],
});

const Stream = code => mime => stream => (
  Response.Stream (code, mime, stream)
);

const Json = code => value => (
  Response.Json (code, value)
);

const Redirect = code => location => (
  Response.Redirect (code, location)
);

const Empty = Response.Empty;

const Next = Response.Next;

const Render = view => pageData => (
  Response.Render (view, pageData)
);

const middleware = action => locals => function dispatcher(req, res, next) {
  res.locals = Object.assign (res.locals, locals);
  runAction (action.name || 'anonymous', action, req, res, next);
};

const errorMiddleware = action => function dispather (err, req, res, next) {
  runAction (action.name || 'anonymous', action, req, res, next, err); 
}

const dispatcher = directory => locals => file => {
  const action = require (path.resolve (directory, file));
  return function dispatcher(req, res, next) {
    res.locals = Object.assign (res.locals, locals);
    runAction (file, action, req, res, next);
  };
};

module.exports = {
  dispatcher,
  middleware,
  errorMiddleware,
  Response,
  Stream,
  Json,
  Redirect,
  Empty,
  Next,
  Render,
};
