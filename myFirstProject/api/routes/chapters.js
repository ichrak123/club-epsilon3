const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const checkAuth=require('../middleware/check-auth');

const Chapter=require('../models/chapter');

router.get('/',(req,res,next)=>{
    Chapter.find()
    .exec()
    .select()
    .then(docs=>{
        const response={
            count:docs.length,
            chapters:docs.map(doc=>{
                return{
                    title:doc.title,
                    description:doc.description,
                    class:doc.class,
                    matiere:doc.matiere,
                    videos:doc.videos,
                    _id:doc._id,
                    request:{
                        type:GET,
                        url:'http://localhost:8080/chapters'+doc._id
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

router.get('/:chapterID',(req,res,next)=>{
  const id=req.params.chapterID
  Chapter.findById(id)
    .exec()
    .select()
    .then(doc=>{
         console.log("from database",doc);
         if(doc){
          res.status(200).json({
            chapter:doc,
            request:{
                type:GET,
                url:'http://localhost:8080/chapters'+doc._id
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

router.post('/',(req,res,next)=>{

    const chapter= new Chapter({
        _id:new mongoose.Types.ObjectId,
        title:req.body.title,
        description:req.body.description,
        class:req.body.class,
        matiere:req.body.matiere,
        videos:req.body.videoId
    });
    
    chapter
    .save()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message:"created chapter successfully",
            createdChapter:{
                title:result.title,
                description:result.description,
                class:result.class,
                matiere:result.matiere,
                videos:result.videos,
                    _id:result._id,
                    request:{
                        type:GET,
                        url:'http://localhost:8080/chapters'+result._id
                    }
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

router.patch("/chapterID",(req,res,next)=>{
    const id=req.params.chapterID;
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value
    }
    Chapter.update({_id:id},{$set:updateOps}).exec()
    .then(result=>{
        res.status(200).json({
            message:"updated chapter",
            request:{
                type:GET,
                url:'http://localhost:8080/chapters'+result._id
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

router.delete('/:chapterID',(req,res,next)=>{ 
  const id=req.params.chapterID;
  Chapter.remove({_id:id})
    .exec()
    .then(result=>{
        console.log(result)
        res.status(200).json({
            message:"chapter deleted",
            request:{
                type:post,
                url:"http://localhost:8080/chapters",
                body:{}
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


module.exports=router