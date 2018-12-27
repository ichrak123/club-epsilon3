const express=require('express');
const router=express.Router();
const mongoose=require('mongoose')
const multer=require('multer');

const storage=multer.diskStorage({
    destination: function(req, file, cb){
     cb(null,'./uploads/videos/');
    },

    filename: function(req, file, cb){
      cb(null, file.originalname);
    }
});

const filterFiles=(req,res,cb)=>{
    if (file.mimetype === 'video/mp4'){
        cb(null,true);
    }
    else{
        (null,false);
    } 

}

const upload=multer({
    storage:storage, 
    limits:{
    fileSize:1024*1024*30
    },
    filterFiles:filterFiles
});

const Video=require('../models/video');

router.get('/',(req,res,next)=>{
    Video.find()
    .exec()
    .select()
    .then(docs=>{
        const response={
            count:docs.length,
            videos:docs.map(doc=>{
                return{
                    chapterTitle:doc.chapterTitle,
                    videoTitle:doc.videoTitle,
                    videoDescription:doc.videoDescription,
                    videoContent:doc.videoContent,
                    _id:doc._id,
                    request:{
                        type:GET,
                        url:'http://localhost:8080/videos'+doc._id
                    }
                }
            })
        }
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
});

router.get('/:videoID',(req,res,next)=>{
  const id=req.params.videoID
  Video.findById(id)
    .exec()
    .then(doc=>{
       console.log("from database",doc);
       if(doc){
        res.status(200).json({
            video:doc,
            request:{
                type:GET,
                url:'http://localhost:8080/videos'+doc._id
            }
        })

       }
       else{
           res.status(404).json({message:"no valid entry provided id"})
       }
    })
    .catch(err=>{
       console.log(err)
       res.status(500).json({error:err})
   })
});

router.post('/',upload.single('videoContent'),(req,res,next)=>{
    console.log(req.file)
    const video=new Video({
        _id:new mongoose.Types.ObjectId(),
        chapterTitle:req.body.chapterTitle,
        videoTitle:req.body.videoTitle,
        chapterDescription:req.body.chapterDescription,
        videoContent:req.file.path,
    });
    
    video
    .save()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message:"created video successfully",
            createdVideo:{
                    chapterTitle:result.chapterTitle,
                    videoTitle:result.videoTitle,
                    videoDescription:result.videoDescription,
                    videoContent:result.videoContent,
                    _id:result._id,
                    request:{
                        type:GET,
                        url:'http://localhost:8080/videos'+result._id
                    }
            }
        });
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
 });

 router.patch("/videoID",(req,res,next)=>{
    const id=req.params.videoID;
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value
    }
    Exam.update({_id:id},{$set:updateOps}).exec()
    .then(result=>{
        res.status(200).json({
            message:"video updated ",
            request:{
                type:GET,
                url:'http://localhost:8080/videos'+result._id,
                body:{}
            }
        })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
            error:err
        })
    })
    })
});

router.delete('/:videoID',(req,res,next)=>{
    const id=req.params.videoID;
    Video.remove({_id:id})
       .exec()
       .then(result=>{
           res.status(200).json({
            message:"video deleted",
            request:{
                type:post,
                url:"http://localhost:8080/videos",
                body:{}
            }
           })
       })
       .catch(err=>{
           console.log(err)
           res.status(500).json({
               error:err
           })
       })
});


module.exports=router