const express=require('express');
const router=express.Router();
const mongoose=require('mongoose')
const multer=require('multer');



const Contact=require('../models/contact');

router.get('/',(req,res,next)=>{
    Contact.find()
    .exec()
    .select()
    .then(docs=>{
        const response={
            count:docs.length,
            contacts:docs.map(doc=>{
                return{
                    nom:doc.nom,
                    message:doc.message,
                    telephone:doc.telephone,
                    email:doc.email,
                    _id:doc._id,
                    request:{
                        type:GET,
                        url:'http://localhost:8080/contacts'+doc._id
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


router.post('/',(req,res,next)=>{
    
    const contact=new Contact({
        _id:new mongoose.Types.ObjectId(),
        nom:req.body.nom,
        message:req.body.message,
        email:req.body.email,
        telephone:req.body.telephone,
    });
    
    contact
    .save()
    .then(result=>{
        console.log(result);
        res.status(200).json({
            message:"created contact successfully",
            createdVideo:{
                    nom:result.nom,
                    email:result.email,
                    telephone:result.telephone,
                    message:result.message,
                    _id:result._id,
                    request:{
                        type:GET,
                        url:'http://localhost:8080/contacts'+result._id
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

 router.delete('/contactID',(req,res,next)=>{
    const id=req.params.contactID;
    Contact.remove({_id:id})
       .exec()
       .then(result=>{
           res.status(200).json({
            message:"contact deleted",
            request:{
                type:post,
                url:"http://localhost:8080/contacts",
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