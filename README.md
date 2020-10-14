# Express Mongodb Functional Server

This server takes a different approach to how you organize and write code compared to how a normal express server is set up.


## Routes
All routes are defined in app.js, so no use of express router

Route example:
```JavaScript
// This will call the 'index.js' file inside 'actions' the folder
app.get('/', dispatch ('index')); 
```


## Actions
Instead of a route function, you have an action.
  - An action is a separate js file inside a folder called 'actions'
  - Each action needs to return a Future of a response type (i.e. Json).
  - Response types:
    - Json (statusCode) (jsonData)
    - Stream (statusCode) (mimeType) (stream)
    - Redirect (statusCode) (URL)
    - Empty ()
    - Next (localsObjectToBringToNextRoute)
    - Render (view) (pageData)

Action Example:
```JavaScript
const S = require ('../lib/sanctuary');
const { Json } = require ('../lib/fluture-express');
const { deleteMany } = require ('../lib/db');

module.exports = (req, locals) => 
  S.map (Json (200))
        (deleteMany ('my-collection') ({a: 'b'}) ({}))
```
In this example, `deleteMany` returns a `Future Error Result`. 'Result' meaning some JavaScript type that can be `JSON.parse`'d. 

A Future has this beautiful trait that it can have two states, either an error or some result. To access the result, we run and `S.map` on it. If the future was an error, the S.map is ignored, just like if it was an empty `Array` and sends the error to the error handler which sends a proper error message to the client. This means that your don't have to worry about error handling all over your code, you just handle the error where the error can occur, and you can trust that the error is handled by the error handler.

Here is a unreal example of how the `deleteMany` might be implemented, just to show how it's done.
```JavaScript
const deleteMany = collection => findQuery => options =>
  S.chain
    (result => result ? Future.resolve (result): Future.reject (400))
    (someFunctionThatReturnsAFuture (collection) (findQuery) (options))
```
- `Future.resolve` returns a `Future void result`
- `Future.reject` returns a `Future error void`
- `S.chain` does the same as `S.map` exept that it can merge two Futures. So since the first argument to `S.chain` returns a `Future`, we need to use chain instead of map. This is a functional concept that applies to `Monads` that I won't go into here.

The concept in the example above shows how easy it is to make custom errors, even if the `someFunctionThatReturnsAFuture` didn't fail. If it DID fail, we could either do nothing, which would result in a 500 to the client, or we could have manipulated that error to be something else.


## MongoDb
This server uses MongoDb as it's database. All queries to the database is done with Futures instead of promises or callbacks.

### List of functions:
```
find :: String -> Object -> Object -> Future Error (Array Object)

findOne :: String -> Object -> Object -> Future (Int | Error) Object

findOneAndUpdate :: String -> Object -> Object -> Object -> Future (Int | Error) Object

insertOne :: String -> object -> Object -> Future (Int | Error) Object

findOneAndDelete :: String -> Object -> Object -> Future (Int | Error) Object

updateMany = String -> Object -> Object -> Object -> Future (Int | Error) (StrMap Int)

insertMany :: String -> Array Object -> Object -> Future (Int | Error) (StrMap Int)

deleteMany :: String -> Object -> Object -> Future (Int | error) (StrMap Int)
```

## .env
The project makes use of .env files to store your secrets. At a mimimum now to get this project up and running, you need a .env file at the root of your project that looks like this.
```
MONGODB_URL=mongodb://localhost:27017
```

## Coming soon...
- Implementation of middleware
- Authentication
- POST, PUT, INSERT Validation