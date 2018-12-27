const mongoose =require("mongoose");
const Schema=mongoose.Schema;

const videoSchema=new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    chapterTitle:{type:String},
    videoTitle:{type:String},
    videoDescription:{type:String},
    videoContent:{type:String}
});


const Video=mongoose.model("videos",videoSchema);

module.exports=Video;