const mongoose =require("mongoose");
const Schema=mongoose.Schema;

const contactSchema=new Schema({
    _id:mongoose.Schema.Types.ObjectId,
    nom:{type:String},
    email:{type:String},
    message:{type:String},
    telephone:{type:String}
});


const Contact=mongoose.model("contacts",contactSchema);

module.exports=Contact;