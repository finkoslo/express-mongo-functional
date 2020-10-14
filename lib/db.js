const { MongoClient, ObjectId } = require ('mongodb');
const Future = require ('fluture');
const S = require ('../lib/sanctuary');
const $ = require ('sanctuary-def');

let db = null;

MongoClient.connect (
  process.env.MONGODB_URL,  
  { useNewUrlParser: true, useUnifiedTopology: true, }, 
  (err, _dbi) => {
    if (err) {
      console.log(err);
    }
    db = _dbi.db('test-db')
  }
 );

// find :: String -> Object -> Object -> Future Error (Array Object)
const find = collection => query => options =>
  Future.node (callback => db.collection(collection).find(query, options).toArray(callback));

// findOne :: String -> Object -> Object -> Future (Int | Error) Object
const findOne = collection => query => options =>
  S.chain (result => result ? Future.resolve (result): Future.reject (404))
        (Future.node (callback => 
           db.collection (collection)
            .findOne (query, Object.assign({ promoteBuffers: true }, options), callback)));

// findOneAndUpdate :: String -> Object -> Object -> Object -> Future (Int | Error) Object
const findOneAndUpdate = collection => findQuery => setQuery => options =>
  S.chain (result => result.lastErrorObject.updatedExisting 
                      ? Future.resolve (result.value) 
                      : Future.reject (404))
          (Future.node (callback => 
            db.collection(collection)
              .findOneAndUpdate (findQuery, setQuery, options, callback)))

// insertOne :: String -> object -> Object -> Future (Int | Error) Object
const insertOne = collection => query => options =>
  S.chain
    (result => 
      S.maybe (Future.reject (400)) 
              (Future.resolve)
              (S.ifElse (S.is ($.Array ($.Object))) (S.head) (_ => S.Nothing) (result.ops)))
    (Future.node (callback => db.collection (collection).insertOne (query, options, callback)));

// findOneAndDelete :: String -> Object -> Object -> Future (Int | Error) Object
const findOneAndDelete = collection => query => options =>
  S.chain
    (result => result.value ? Future.resolve (result.value): Future.reject (404))
    (Future.node (callback => db.collection (collection).findOneAndDelete (query, options, callback)));

// updateMany = String -> Object -> Object -> Object -> Future (Int | Error) (StrMap Int)
const updateMany = collection => findQuery => updateQuery => options =>
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

// insertMany :: String -> Array Object -> Object -> Future (Int | Error) (StrMap Int)
const insertMany = collection => setQuery => options =>
  S.chain
    (result => 
      S.ifElse
        (S.is ($.Object))
        (r => Future.resolve({ insertedItems: r.n }))
        (_ => Future.reject (500))
        (result.result))
    (Future.node (callback => 
      db.collection(collection).insertMany(setQuery, options, callback)));

// deleteMany :: String -> Object -> Object -> Future (Int | error) (StrMap Int)
const deleteMany = collection => findQuery => options =>
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

