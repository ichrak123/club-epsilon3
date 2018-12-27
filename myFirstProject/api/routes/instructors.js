const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken")

const Instructor=require('../models/instructor');


router.post('/signup', (req,res,next)=>{
    Instructor.find({email:req.body.email})
    .exec()
    .then(instructor=>{
        if(instructor.length>=1){
            res.status(409).json({
                message:"Mail exists"
            })
        }else{
            bcrypt.hash(req.body.password, 10,(err,hash)=>{
                if(err){
                    return res.status(500).json({
                       error:err
                    });
                }else{
                    const instructor= new Instructor({
                        _id:new mongoose.Types.ObjectId(),
                        firstName:req.body.firstName,
                        lastName:req.body.lastName,
                        email:req.body.email,
                        speciality:req.body.speciality,
                        password:hash
                    });
                    instructor
                    .save()
                    .then(result=>{
                        console.log(result)
                        res.status(200).json({
                            message: "add instructor succed"
                        });
                    })
                    .catch(err=>{
                        console.log(err)
                        res.status(500).json({
                            error:err
                        });
                    })
                }
            });

        }
    })
});



router.post('/login', (req,res,next)=>{
    Instructor.find({email:req.body.email})
    .exec()
    .then(instructor=>{
        if(instructor.length<1){
            return res.status(401).json({
                message:"Auth failed!"
            });
        }
        bcrypt.compare(req.body.password, instructor[0].password, (err,result)=>{
            if(err){
                return res.status(401).json({
                    message:"Auth failed!"
                });
            }
            if(result){
                const token=jwt.sign({
                    email:instructor[0].email,
                    instructorId:instructor[0]._id
                },
                process.env.JWT_KEY,
                {
                    expiresIn:"1h"
                })
                return res.status(200).json({
                    message:"Auth successful",
                    token:token
                });
            }

        });
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json({
        error:err
    });
});

});



router.delete('/:instructorID', (req,res,next)=>{
    const id=req.params.instructorID
    Instructor.remove({_id:id})
        .exec()
        .then(result=>{
            console.log(result)
            res.status(200).json({
                message:"instructor deleted"
            });
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({
            error:err
        });
    });
})




module.exports=router;