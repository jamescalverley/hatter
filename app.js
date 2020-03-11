require('dotenv').config(); // --> process.env

const express = require('express');
const bodyParser = require('body-parser')

const orm = require('./orm');
const bcrypt = require ('bcrypt');
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.use(express.static('public'));



PORT  = 3000;


app.post('/api/addHatt',async ( req,res)=>{
    // console.log(req.body);
    const result = await orm.addHatt(req.body);
    // res.json.end(JSON.stringify({response:"added"}))
    res.json({response:"OK",id:result.insertId});
    // res.end(JSON.stringify({response:"OK",id:result.insertId}));
})

app.delete('/api/deleteHatt',async ( req, res )=>{
    // console.log(req.body);
    const result = await orm.deleteHatt(req.body);
    // res.json.end(JSON.stringify({response:"deleted"}))
    res.json({response:"OK"});
    // res.end(JSON.stringify({response:"OK"}))
})

const saltRounds = 10;

app.post('/api/addUser', async ( req,res )=>{
    //console.log('api addUser called...');
    //console.log(req.body);
    //const result = await orm.addUser(req.body);
    // console.log('result from addUser:',result);
    //res.json({response:"OK",id:result.insertId});
    // res.end(JSON.stringify({response:"OK",id:result.insertId}));
    const result = await bcrypt.hash(req.body.password, saltRounds, function(err,hash){
        orm.addUser({name:req.body.name,
            email:req.body.email,
            password:hash
        }).then (function(data){
            console.log(hash);
            if (data){
                res.json({response:"OK",id:data.insertId});
            }
        })
    })
    
});

app.post('/api/auth', async( req, res ) => {
    console.log(req.body);
    const user = await orm.authUser(req.body);
    //console.log(user[0].id);
    
    
    if (user[0]) {
        bcrypt.compare(req.body.password, user[0].password, function(err, result) {
            if (result == true) {
                const userInfo = {
                    id: user[0].id,
                    name: user[0].name,
                    email: user[0].email,
                    password: user[0].password,
                    location: user[0].location,
                    picture_path: user[0].picture_path
                };
                res.json({response:"OK", user: userInfo});
            } else {
                res.json({response: "Incorrect password. Try again?"});
            }
        })
    } else {
        res.json({response: "Email not found. Try again?"});
    }
    
});


app.delete('/api/deleteUser',async ( req,res )=>{
    // console.log('api deleteUser called...');
    // console.log(req.body);
    const result = await orm.deleteUser(req.body);
    res.json({response:"OK"});
    // res.end(JSON.stringify({response:"OK"}));
});

app.post('/api/addComment', async ( req, res)=>{
    // console.log('api addComment called...');
    // console.log(req.body);
    const result = await orm.addComment(req.body);
    // console.log('result from add comment',result);
    res.json({response:"OK",id:result.insertId});
    // res.end(JSON.stringify({response:"OK",id:result.insertId}));
})

app.delete('/api/deleteComment', async ( req, res )=>{
    // console.log(`api deleteComment called...`);
    // console.log(req.body);
    const result = await orm.deleteComment(req.body);
    res.json({response:"OK"});
    // res.end(JSON.stringify({response:"OK"}));
})

app.get('/api/getUserHatts', async ( req, res)=>{
    // console.log(`api getUserHatts called ...`);
    // console.log(req.body);
    const result = await orm.getUserHatts(req.body);
    res.json(result);
})


// connection.query('select * from hatts',function(error,results,fields){
//     console.log(results);
// })

app.listen(PORT,()=>{
    console.log(`listening on ${PORT} ...`);
})