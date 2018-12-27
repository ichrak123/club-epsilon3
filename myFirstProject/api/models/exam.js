const mongoose =require("mongoose");
const Schema=mongoose.Schema;

const examSchema=new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    title:{type:String, required:false},
    description:{type:String, required:false},
    class:{type:String, required:false},
    myImage:{type:String, required:true},
    corrige:{type:String, required:false},
    year:{type:Number, required:false},
    institue:{type:String,required:false},
    section:{type:String, required:false},
    type:{type:String, required:false}

})

const  Exam=mongoose.model('exams',examSchema);

module.exports=Exam;