const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const app = express();

//Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

//MongoDB connection
mongoose.connect('mongodb://localhost:27017/rk', 
    {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true},
    ).then(()=>{
        console.log('DB Connected');
    });

//mongodb Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastName: {
        type: String,
        maxlength: 16,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    }
},{ timestamps: true });

const User = new mongoose.model("User", userSchema);

//post and get methods

app.get('/robokalam',(req,res)=>{
    res.render('index');
})

app.post('/robokalam',(req,res)=>{
    const user = new User(req.body);
   user.save((err,user)=>{
       if(err){
           return res.status(400).json({ error : err});
       } else {
           res.status(200).json({
               name: user.name,
               email: user.email,
               id: user._id
           });
       }
   })
})
    
//Listening server
const port = process.env.PORT || 8000;
app.listen(port,()=>{
    console.log(`Server listening on http://localhost:${port}`);
});