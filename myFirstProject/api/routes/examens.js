const express=require('express');
const router=express.Router();
const mongoose=require('mongoose')
const multer=require('multer');
const checkAuth=require('../middleware/check-auth');

const storage=multer.diskStorage({
    destination: function(req, file, cb){
     cb(null,'./uploads/');
    },

    filename: function(req, file, cb){
      cb(null, file.originalname);
    }
});

const filterFiles=(req,res,cb)=>{
    if (file.mimetype === 'application/pdf'){
        cb(null,true);
    }
    else{
        (null,false);
    } 

}

const upload=multer({
    storage:storage, 
    limits:{
    fileSize:1024*1024*15
    },
    filterFile:filterFiles
});

const Exam=require('../models/exam');

router.get('/',(req,res,next)=>{
    Exam.find()
    .exec()
    .select()
    .then(docs=>{
        const response={
            count:docs.length,
            examens:docs.map(doc=>{
                return{
                    title:doc.title,
                    description:doc.description,
                    class:doc.class,
                    ennonce:doc.enonce,
                    corrige:doc.corrige,
                    class:doc.class,
                    institue:doc.institue,
                    section:doc.section,
                    _id:doc._id,
                    request:{
                        type:GET,
                        url:'http://localhost:8080/examens'+doc._id
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

router.get('/:examenID',(req,res,next)=>{
  const id=req.params.examenID
  Exam.findById(id)
    .exec()
    .then(doc=>{
       console.log("from database",doc);
       if(doc){
        res.status(200).json({
            examen:doc,
            request:{
                type:GET,
                url:'http://localhost:8080/examens'+doc._id
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

router.post('/', upload.single('myImage'),(req,res,next)=>{
    console.log(req.file)
    const examen=new Exam({
        _id:new mongoose.Types.ObjectId(),
        title:req.body.title,
        description:req.body.description,
        class:req.body.class,
        enonce:req.file.path,
       // corrige:req.file.path,
        section:req.body.section
    });
    
    examen
    .save()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message:"created exam successfully",
            createdExamen:{
                    title:result.title,
                    description:result.description,
                    class:result.class,
                    section:result.section,
                    corrige:result.corrige,
                    enonce:result.enonce,
                    _id:result._id,
                    request:{
                        type:GET,
                        url:'http://localhost:8080/examens'+result._id
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

 router.patch("/examenID",(req,res,next)=>{
    const id=req.params.examenID;
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value
    }
    Exam.update({_id:id},{$set:updateOps}).exec()
    .then(result=>{
        res.status(200).json({
            message:"examen updated ",
            request:{
                type:GET,
                url:'http://localhost:8080/examens'+result._id,
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

router.delete('/:examenID',(req,res,next)=>{
    const id=req.params.examenID;
    Exam.remove({_id:id})
       .exec()
       .then(result=>{
           res.status(200).json({
            message:"examen deleted",
            request:{
                type:post,
                url:"http://localhost:8080/examens",
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