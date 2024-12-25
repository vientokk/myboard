
var router = require('express').Router();

const dotenv = require('dotenv').config();


const sha = require('sha256');

const mongoclient = require('mongodb').MongoClient;
const ObjId  = require('mongodb').ObjectId;

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




router.get('/login',function(req, res){

    console.log(req.session);
    if(req.session.user){
        console.log('세션 유지');
        //res.send('로그인 되었습니다.');
        res.render('index.ejs',{user:req.session.user});
    }else{
        res.render('login.ejs');
    }
});

router.post('/login',(req,res)=>{
    console.log(req.body.userid);
    console.log(req.body.userpw);

    mydb
    .collection('account')
    .findOne({userid:req.body.userid})
    .then((result)=>{
        if (!result) {
            // 결과가 없으면 로그인 실패 처리
            return res.send('아이디, 비밀번호 확인');
        }
        if(result.userpw == sha(req.body.userpw)){
            req.session.user = req.body;
            console.log('새로운 로그인');
            //return res.send('로그인 되었습니다');
            res.render('index.ejs',{user:req.session.user});
        }else{
            //return res.send('아이디, 비밀번호 확인');
            res.render('login.ejs');
        }})
    .catch((err) => {
        // 오류가 발생한 경우 처리
        console.error(err);
        res.status(500).send('서버 오류');
    }); 
});

router.get('/logout',(req, res)=>{
    console.log("로그아웃");
    req.session.destroy();
    //res.redirect('/');
    res.render('index.ejs',{user:null});
});

router.get('/signup',(req,res)=>{
    res.render('signup.ejs');
});

router.post('/signup',(req,res)=>{
    console.log(req.body.userid);
    console.log(req.body.userpw);
    console.log(req.body.usergroup);
    console.log(req.body.useremail);

    mydb
    .collection('account')
    .insertOne({
        userid:req.body.userid,
        userpw: sha(req.body.userpw),
        usergroup:req.body.usergroup,
        useremail:req.body.useremail,
    })
    .then((result)=>{
        console.log("회원가입 성공");
    });
    res.redirect('/');
});



router.get('/cookie',function(req, res){
    let milk = parseInt(req.signedCookies.milk) + 1000;
    if(isNaN(milk)){
        milk=0;
    }
    res.cookie('milk', milk,{signed:true,maxAge:2000});
    res.send('product : ' + milk + "원");
});




module.exports = router;