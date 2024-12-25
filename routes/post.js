var router = require('express').Router();

const dotenv = require('dotenv').config();

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


router.get("/list", (req, res)=>{
    mydb
    .collection('post')
    .find()
    .toArray()
    .then((result)=>{
        console.log(result);
        res.render('list.ejs', {data:result});
    });
});



router.post('/delete', function(req, res){    
    console.log(req.body);
    req.body._id = new ObjId(req.body._id);
    mydb.collection('post').deleteOne(req.body)  
    .then(result =>{
        console.log('삭제완료');
        res.status(200).send();
    })
    .catch(err=>{
        console.log(err);
        res.status(500).send();
    });    
});

router.get('/content/:id', function(req, res){
    console.log(req.params.id);
    // ObjectId가 유효한지 확인
    // if (!ObjId.isValid(req.params.id)) {
    //     return res.status(400).send('유효하지 않은 ID입니다.');
    // }
    
    req.params.id = new ObjId(req.params.id); 
    mydb
        .collection("post")
        .findOne({_id : req.params.id})
        .then((result)=>{
            //console.log(result);
            if (result) {
                //console.log(result);
                res.render('content.ejs', { data: result });
            } else {
                res.status(404).send('게시글을 찾을 수 없습니다.');
            }
        }) .catch((err) => {
            console.error('Error fetching data:', err);
            res.status(500).send('서버 오류');
        });
});

router.get('/edit/:id',function(req, res){
    console.log (req.params.id );
    req.params.id = new ObjId(req.params.id);
    mydb.collection('post')
    .findOne({_id : req.params.id})
    .then((result)=>{

        res.render("edit.ejs", {data:result});        
    });

});

// app.post("/edit", function(req, res){
//     console.log(req.body);
//     req.body.id = new ObjId(req.body.id);
//     console.log(req.body.id);
//     mydb.collection("post")
//         .updateOne(
//             { _id: new ObjId(req.body.id)},
//             { 
//                 $set: {
//                     title: req.body.title, 
//                     content: req.body.content, 
//                     date: new Date(req.body.someDate)  // 날짜를 Date 객체로 변환
//                 }
//             }
//         )
//     .then((result) => {
//         console.log("수정완료");
//         res.redirect('/list');
//     })        
//     .catch((err)=>{
//         console.log(err);
//     });
// });


router.post("/edit", function(req, res) {
    // 로그로 넘어오는 데이터를 확인
    console.log(req.body);

    // req.body.id를 ObjectId로 변환
    req.body.id = new ObjId(req.body.id);
    
    console.log("Converted ObjectId:", req.body.id);

    mydb.collection("post")
        .updateOne({_id: req.body.id},  // _id를 ObjectId로 변환한 값 사용
            {$set: {
                title: req.body.title, 
                content: req.body.content, 
                date: req.body.someDate  // 날짜를 Date 객체로 변환
            }})
        .then((result) => {
            console.log("수정완료", result);  // 수정된 결과 로그
            if (result.modifiedCount === 0) {
                console.log("수정된 문서가 없습니다.");
            }
            res.redirect('/list');
        })
        .catch((err) => {
            console.log("에러 발생:", err);
            res.status(500).send("서버 오류가 발생했습니다.");
        });
});



module.exports = router;