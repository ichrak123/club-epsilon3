const mongoose =require("mongoose");
const bcrypt = require('bcrypt');
const Schema=mongoose.Schema;

const studentSchema=new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    firstName: {type:String, required:true},
    lastName: {type:String, required:true},
    nickName: {type:String},
    class: {type:String,required:true},
    institue: {type:String},
    email: {type:String, required:true, unique:true, match:/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/ },
    password: {type:String,required:true},
    section:{type:String,required:true}

});

const  Student=mongoose.model('students',studentSchema);

module.exports=Student;