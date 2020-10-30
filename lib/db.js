const { ObjectId } = require ('mongodb');
const Future = require ('fluture');
const S = require ('../lib/sanctuary');
const $ = require ('sanctuary-def');


// find :: Object -> String -> Object -> Future Error (Array Object)
const find = db => options => collection => query =>
  Future.node (callback => db.collection(collection).find(query, options).toArray(callback));

// findOne :: Object -> String -> Object -> Future (Int | Error) Object
const findOne = db => options => collection => query => 
  S.chain (result => result ? Future.resolve (result): Future.reject (404))
          (Future.node (callback => 
            db.collection (collection)
             .findOne (query, Object.assign({ promoteBuffers: true }, options), callback)));

// findOneAndUpdate :: Object -> String -> Object -> Object -> Future (Int | Error) Object
const findOneAndUpdate = db => options => collection => findQuery => setQuery => 
  S.chain (result => result.lastErrorObject.updatedExisting 
                      ? Future.resolve (result.value) 
                      : Future.reject (404))
          (Future.node (callback => 
            db.collection(collection)
              .findOneAndUpdate (findQuery, setQuery, options, callback)))

// insertOne :: Object -> String -> object -> Future (Int | Error) Object
const insertOne = db => options => collection => query => 
  S.chain
    (result => 
      S.maybe (Future.reject (400)) 
              (Future.resolve)
              (S.ifElse (S.is ($.Array ($.Object))) (S.head) (_ => S.Nothing) (result.ops)))
    (Future.node (callback => db.collection (collection).insertOne (query, options, callback)));

// findOneAndDelete :: Object -> String -> Object -> Future (Int | Error) Object
const findOneAndDelete = db => options => collection => query => 
  S.chain
    (result => result.value ? Future.resolve (result.value): Future.reject (404))
    (Future.node (callback => db.collection (collection).findOneAndDelete (query, options, callback)));

// updateMany :: Object -> Object -> Future (Int | Error) (StrMap Int)
const updateMany = db => options => collection => findQuery => updateQuery => 
  S.chain
    (result => 
      S.ifElse
        (S.is ($.Object))
        (r => Future.resolve({ foundItems: r.n, modifiedItems: r.nModified}))
        (_ => Future.reject (500))
        (result.result))
    (Future.node (callback => 
      db.collection (collection)
        .updateMany (findQuery, updateQuery, options, callback)));

// insertMany :: Object -> String -> Array Object -> Future (Int | Error) (StrMap Int)
const insertMany = db => options => collection => setQuery => 
  S.chain
    (result => 
      S.ifElse
        (S.is ($.Object))
        (r => Future.resolve({ insertedItems: r.n }))
        (_ => Future.reject (500))
        (result.result))
    (Future.node (callback => 
      db.collection(collection).insertMany(setQuery, options, callback)));

// deleteMany :: Object -> String -> Object -> Future (Int | error) (StrMap Int)
const deleteMany = db => options => collection => findQuery => 
  S.chain
    (result => 
      S.ifElse
        (S.is ($.Object))
        (r => Future.resolve({ deletedItems: r.n }))
        (_ => Future.reject (500))
        (result.result))
    (Future.node (callback => 
      db.collection(collection).deleteMany(findQuery, options, callback)));


module.exports = {
  ObjectId,
  find,
  findOne,
  findOneAndUpdate,
  insertOne,
  findOneAndDelete,
  updateMany,
  insertMany,
  deleteMany 
};

