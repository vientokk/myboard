const dotenv = require('dotenv').config();

const mongoclient = require('mongodb').MongoClient;
const ObjId  = require('mongodb').ObjectId;

const url = process.env.DB_URL;
let mydb;
mongoclient.connect(url)
.then(client =>{
    mydb = client.db('myboard');
    // mydb.collection('post').find().toArray().then(result =>{
    //     console.log(result);
    // });
    app.listen(process.env.PORT, ()=>{
        console.log("포트 8080으로 서버 대기중");
    });
});  

const mysql = require('mysql2');

// MySQL 데이터베이스 연결 설정
const conn = mysql.createConnection({
  host: 'localhost',        // MySQL 호스트 (DBVeer과 동일한 값)
  user: 'localmaster',             // MySQL 사용자 이름
  password: 'qwer1234',// 비밀번호
  database: 'myboard',      // 데이터베이스 이름
  port: 3306                // MySQL 포트 (DBVeer에서 설정된 포트와 동일한지 확인)
});

conn.connect();

// conn.query("Select * From post ", function(err, rows, fields){
//     if(err) throw err;
//     console.log(rows);
// });

const express = require('express');
const sha = require('sha256');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser('rkskek123!'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

let session = require('express-session');
app.use(session({
    secret : 'rkskek123!',
    resave:false,
    saveUninitialized:true,
}));


//정적 파일 라이브러리 추가
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/', require('./routes/post.js'));
app.use('/', require('./routes/add.js'));
app.use('/', require('./routes/auth.js'));

// app.listen(8080, ()=>{
//     console.log('서버시작')
// });

app.get('/', (req, res)=>{
    res.render('index.ejs',{user:null}); 
});

app.get('/book', (req, res)=>{
    res.send('도서목록 페이지');
});

/**
app.get("/list",(req, res)=>{
    //mysql
    // conn.query("Select * From post ", function(err, rows, fields){
    //     if(err) throw err;
    //     console.log(rows);
    // });

    //mongodb
    mydb.collection('post').find().toArray().then(result =>{
        //console.log(result);        
        res.render('list.ejs', {data : result});
    });

    //res.sendFile(__dirname + '/list.html');
    //res.render('list.ejs');
});
*/



app.get('/session',function(req,res){
    if(isNaN(req.session.milk)){
        req.session.milk=0;
    }
    req.session.milk = req.session.milk + 1000;
    res.send("session : " + req.session.milk + "원");
});

app.get('/search', (req, res)=>{    
    console.log(req.query.value);
    mydb
    .collection('post')
    .find({title:req.query.value}).toArray()
    .then((result)=>{
        console.log(result);
        res.render("sresult.ejs", {data:result});
    })
});
 