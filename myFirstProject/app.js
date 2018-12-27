const express=require('express');
const morgan=require("morgan");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const cors=require("cors");
const app=express();


const examRoutes=require('./api/routes/examens');
const videoRoutes=require('./api/routes/videos');
const chapterRoutes=require('./api/routes/chapters');
const instructorRoutes=require('./api/routes/instructors');
const studentRoutes=require('./api/routes/students');
const contactRoutes=require('./api/routes/contacts');



mongoose.connect('mongodb://localhost:27017/epsilons1', { useNewUrlParser: true });
mongoose.Promise=global.Promise;
mongoose.set('useCreateIndex', true);

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended:true}));
app.use('/uploads',express.static('uploads'))
app.use(bodyParser.json());
app.use(cors())

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers",
    "Origin, X-requested-With, Content-Type, Accept, Authorization");
    if(req.method==='OPTIONS'){
        res.header("Access-Control-Allow-Methods", PUT, GET, PATCH,POST,DELETE);
        res.status(200).json({});
    }
next()
})

app.use('/examens', examRoutes);
app.use('/videos', videoRoutes);
app.use('/chapters', chapterRoutes);
app.use('/instructors', instructorRoutes);
app.use('/students', studentRoutes);
app.use('/contacts', contactRoutes);



app.use((req,res,next)=>{
    const error=new Error('NOT FOUND');
    error.status=401;
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message:error.message
        }
    });
});

module.exports=app;
