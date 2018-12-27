const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");

const Student=require('../models/student');


router.post('/signup', (req,res,next)=>{
    Student.find({email:req.body.email})
    .exec()
    .then(student=>{
        if(student.length>=1){
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
                    const student= new Student({
                        _id:new mongoose.Types.ObjectId(),
                        firstName:req.body.firstName,
                        lastName:req.body.lastName,
                        nickName:req.body.nickName,
                        class:req.body.class,
                        email:req.body.email,
                        etablishement:req.body.etablishement,
                        speciality:req.body.speciality,
                        password:hash
                    });
                    student
                    .save()
                    .then(result=>{
                        console.log(result)
                        res.status(200).json({
                            message: "add student succed"
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
    Student.find({email:req.body.email})
    .exec()
    .then(student=>{
        if(student.length<1){
            return res.status(401).json({
                message:"Auth failed!"
            });
        }
        bcrypt.compare(req.body.password, student[0].password, (err,result)=>{
            if(err){
                return res.status(401).json({
                    message:"Auth failed!"
                });
            }
            if(result){
                const token=jwt.sign({
                    email:student[0].email,
                    studentId:student[0]._id
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



router.delete('/:studentID', (req,res,next)=>{
    const id=req.params.studentID
    Student.remove({_id:id})
        .exec()
        .then(result=>{
            console.log(result)
            res.status(200).json({
                message:"student deleted"
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