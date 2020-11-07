# Express Mongodb Functional Server

This server takes a different approach to how you organize and write code compared to how a normal express server is set up.
Because of JavaScripts unsafe nature with dynamic types, keeping your normal Express code safe demands a lot of effort and 
experience from the developer. 

To address this problem, this boilerplates code is based on Strictly Typed Functional Programming style. It will take some effort to learn how to write in this style, but once you get familiar with it, it will make your life a lot simpler with cleaner code and easier error handling. Actually, you won't be able to ignore erros. You will be forced to handle all possible error cases. This might sound like a lot of work, but it really isn't.

We recommend that you familiarize yourself with [Fluture](https://github.com/fluture-js/Fluture) and [Sanctuary](https://sanctuary.js.org), as 90% of the code you will write will be based on these two libraries. Which will make your code feel more like it was a member of the ML Language family. But your are still writing pure JavaScript, so no need to compile your code.

This project will also use types. But instead of taking the approach of using TypeScript and compile your code to JavaScript. You will use JavaScripts built in functions for type checking. Wrapped in helper types from [sanctuary-def](https://github.com/sanctuary-js/sanctuary-def), so you don't have to write a lot of boilerplate code. In addition, you won't have to add types to everything. You can if you want to, but the most common approach is to add types when your not in control of the data (like user input and external API calls).


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

Here is a fictive example of how the `deleteMany` might be implemented, just to show how it's done.
```JavaScript
const deleteMany = collection => findQuery => options =>
  S.chain
    (result => result ? Future.resolve (result): Future.reject ({ code: 400, message: 'Some error message' }))
    (someFunctionThatReturnsAFuture (collection) (findQuery) (options))
```
- `Future.resolve` returns a `Future void result`
- `Future.reject` returns a `Future error void`
- `S.chain` does the same as `S.map` exept that it can merge two Futures. So since the first argument to `S.chain` returns a `Future`, we need to use chain instead of map. This is a functional concept that applies to `Monads` that I won't go into here.

The concept in the example above shows how easy it is to make custom errors, even if the `someFunctionThatReturnsAFuture` didn't fail. If it DID fail, we could either do nothing, which would result in a 500 to the client, or we could have manipulated that error to be something else.

## Authentication
This server uses jwt as authentication method. 


### To log in:
Send a post request to `/login` with a body like this: 
```
{ "username": "myUserName", "password": "myPassword" }
```
This will return a jwt token that last for an hour. You should store this token in Local Storage for later use.


### To call the API with jwt token
You need to set Authorization header in your request like this:
`Authorization: Bearer <jwt token>`


## MongoDb
This server uses MongoDb as it's database. All queries to the database is done with Futures instead of promises or callbacks.

### List of functions:
```
find :: Object -> Object -> String -> Object -> Future (Object | Error) Object

findOne :: Object -> Object -> String -> Object -> Future (Object | Error) Object

findOneAndUpdate :: Object -> Object -> String -> Object -> Object -> Future (Object | Error) Object

insertOne :: Object -> Object -> String -> object -> Future (Object | Error) Object

findOneAndDelete :: Object -> Object -> String -> Object -> Future (Object | Error) Object

updateMany :: Object -> Object -> Object -> Future (Object | Error) (StrMap Int)

insertMany :: Object -> Object -> String -> Array Object -> Future (Object | Error) (StrMap Int)

deleteMany :: Object -> Object -> String -> Object -> Future (Object | error) (StrMap Int)
```

## .env
The project makes use of .env files to store your secrets. At a mimimum now to get this project up and running, you need a .env file at the root of your project that looks like this.
```
MONGODB_URL=mongodb://localhost:27017
ENV=dev
PORT=3000
API_SECRET=somesecret
```
