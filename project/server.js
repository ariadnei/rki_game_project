const express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");

// создаем объект приложения
const app = express();
var jsonParser = bodyParser.json();

app.use(express.static(__dirname + "/public"));

app.post("/test", jsonParser, function(request, response){
  console.log(request.body);

  var sqlite3 = require('sqlite3').verbose();

  //open the db
  let db = new sqlite3.Database('./test1.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });

  console.log("Level "+ request.body.level)
  let sql = "SELECT * from Questions WHERE id_level=" + request.body.level + " AND id_category=" + request.body.category
  let string = '';

  db.all(sql, [], (err, rows) => {
     if (err) {
       throw err;
     }

     a = JSON.stringify(rows)

    response.send(a);
    //response.send(string);
   });
  //
  // // close the database connection
   db.close();

    //response.send("<h1>Главная страница</h1>");
});

app.post("/push", jsonParser,  function(request, response){
  console.log(request.body.id_answer);
  console.log(request.body.var_question);
  var sqlite3 = require('sqlite3').verbose();

  //open the db
  let db = new sqlite3.Database('./test1.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });

  let sql = "SELECT * from Questions WHERE id_question = " + request.body.id_answer;
  console.log(sql);
  let string = '';

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    //a = JSON.stringify(rows)
    console.log(rows);
    var data = {}
    console.log(rows[0].right_answer);
    console.log(request.body.var_question);
    if (rows[0].right_answer === request.body.var_question){
      data = {point:1}

    } else {
      data = {point: 0}
    }
    console.log(data);
    response.send(data);

    //response.send(string);
  });

  // close the database connection
  db.close();

    //response.send("<h1>Главная страница</h1>");
});

app.post("/get_cat", jsonParser, function(request, response){
  //console.log(request.body);
  var sqlite3 = require('sqlite3').verbose();
  //open the db
  let db = new sqlite3.Database('./test1.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  });


  let sql = "SELECT * from Level WHERE id_level=" + request.body.id_lev
  let string = '';

  db.all(sql, [], (err, rows) => {
     if (err) {
       throw err;
     }
     a = JSON.stringify(rows)
    response.send(a);
   });
   db.close();
});

app.get("/api/users", function(req, res){

    var content = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(content);
    res.send(users);
});

app.listen(3000, "127.0.0.1", function(){
  console.log("Сервер слушает на порту 3000");
});
