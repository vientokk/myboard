var router = require('express').Router();
const dotenv = require('dotenv').config();
const mongoclient = require('mongodb').MongoClient;
const ObjId  = require('mongodb').ObjectId;
const path = require('path');
const url = process.env.DB_URL;
let mydb;

mongoclient
    .connect(url)
    .then((client) =>{
    mydb = client.db('myboard');
    })
    .catch((err)=>{
        console.log(err);
    });



router.get("/enter", function(req, res){
    //res.sendFile(__dirname+"/enter.html");
    res.render('enter.ejs');
});

router.post("/save", function(req, res){
    //console.log(req.body);
    //console.log("저장완료");

    //mysql 저장
    // let sql = "Insert into post(title, content, created) Values(?, ? , Now()) ";
    // let params = [req.body.title, req.body.content];
    // conn.query(sql, params, function(err, result){
    //     if(err) throw err;
    //     console.log("데이 추가 성공");
    // });
    // res.send('데이터 추가 성공');


    //mongodb 저장
    mydb.collection('post').insertOne(
        {title: req.body.title, content: req.body.content, date: req.body.someDate, path:imagepath}
    ).then(result=>{
        console.log(result);
        console.log('데이터 추가 성공');        
    }).catch(err => {
        console.error('데이터 추가 실패', err);
        res.status(500).send('데이터 추가 실패');
    });
    res.redirect('/list');   
});

/* 
const upload = multer({ storage: storage });
const path = require('path');
let imagepath = '';
router.post('/photo', upload.single('picture'), function(req, res){
    console.log(req.file.path);
    //imagepath = '/'+req.file.path;
    // DB에 저장할 경로에서 '/public'을 제외하고 상대 경로만 저장
    imagepath = '/image/' + path.basename(req.file.path);  // 'filename.jpg' 형태로 저장
});

 */

let multer = require('multer');

let storage = multer.diskStorage({
  destination : function(req, file, done){
    done(null, './public/image')
  },
  filename : function(req, file, done){
    done(null, file.originalname)
  }
})

let upload = multer({storage : storage});

router.get('/upload', function(req, res){
  res.render('upload.ejs');
})

let imagepath = '';
router.post('/photo', upload.single('picture'), function(req, res){
 console.log(req.file.path);
 //imagepath = '/'+req.file.path;
 imagepath = '/image/' + path.basename(req.file.path);  // 'filename.jpg' 형태로 저장
})

module.exports = router;