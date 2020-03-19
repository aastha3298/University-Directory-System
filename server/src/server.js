const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const url = "mongodb+srv://test:5G4sHXySUiCzluJh@cluster0-azu9n.mongodb.net/test?retryWrites=true&w=majority";
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const University = require('./university');
const universityDB = "mydb";
const universityCollection = "university";

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function getUniversityQuery(universityData) {
  let universityQuery = {};
  let atleastOneAttribute = false;
  if (universityData.Name != null) {
    universityQuery.Name = universityData.Name;
    atleastOneAttribute = true;
  }
  if (universityData.Address != null) {
    universityQuery.Address = universityData.Address;
    atleastOneAttribute = true;
  }
  if (universityData.PhoneNumber != null) {
    universityQuery.PhoneNumber = universityData.PhoneNumber;
    atleastOneAttribute = true;
  }
  if (!atleastOneAttribute) {
    universityQuery = null;
  }
  return universityQuery;
}

const deleteUniversityHandler = function(request, response) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db(universityDB);
    let myquery = getUniversityQuery(request.body);
    if (!myquery) { response.send("Invalid query!"); return; }
    console.log(myquery);
    dbo.collection(universityCollection).deleteOne(myquery, function(err, obj) {
      if (err) throw err;
      db.close();
      let result = {"success":true, "message": ""};
      if (obj.deletedCount == 0) {
          result.success = false;
          result.message = "Couldn't find the requested university!";
      }
      response.send(JSON.stringify(result));
    });
  });
}

const saveUniversityHandler = function(request, res) {
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      let dbo = db.db(universityDB);
      let universityDetails = request.body;
      let universityKey = {};
      universityKey.Name = universityDetails.Name;
      let universityUpdateDetails = {};
      universityUpdateDetails["$set"] = universityDetails;
      dbo.collection(universityCollection).updateOne(universityKey, universityUpdateDetails, {upsert:true}, function(err, dbres) {
        if (err) throw err;
        res.send("1 document inserted");
        db.close();
      });
    });
}

const getUniversityHandler = function (request, res) {
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      let dbo = db.db(universityDB);
      let universityName = request.body.Name;
      let query = {};
      query.Name = universityName;
      dbo.collection(universityCollection).findOne(query, function(err, dbResult) {
        if (err) throw err;
        db.close();
        res.send(dbResult);
      });
    });
};

const getAllUniversities = function(request, res) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db(universityDB);
    dbo.collection(universityCollection).find({}).toArray(function(err, result) {
      if (err) throw err;
      res.send(JSON.stringify(result));
      db.close();
    });
  });
}

const testHandler = function(req, res) {
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var myobj = { name: "Company Inc", address: "Highway 37" };
      dbo.collection("customers").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    });
  res.send('Hello World!');
}

app.post('/deleteUniversity', deleteUniversityHandler);

app.post('/saveUniversity', saveUniversityHandler);

app.post('/getUniversity', getUniversityHandler);

app.get('/getAllUniversities', getAllUniversities);

app.get('/test', testHandler);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));