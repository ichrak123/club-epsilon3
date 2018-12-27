const mongoose =require("mongoose");
const Schema=mongoose.Schema;

const instructorSchema=new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    firstName:{
        type:String,
        require:[true]
    },
    LastName:{
        type:String,
        require:[true]
    },
    email:{
        type:String,
        require:[true]
    },
    password:{
        type:String,
        require:[true]
    },
    specialty:String

})

const  Instructor=mongoose.model('instructors',instructorSchema);

module.exports=Instructor;