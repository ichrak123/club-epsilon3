const mongoose =require("mongoose");
const Schema=mongoose.Schema;



const chapterSchema=new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    matiere:{type:String},
    title:{ type:String, required:true},
    class:{type:String},
    description:{type:String, required:false},
    videos:[{type:mongoose.Schema.Types.ObjectId, ref: 'Video' ,required:true}]
});

const Chapter=mongoose.model('chapters',chapterSchema);

module.exports=Chapter;