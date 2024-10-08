const mongoose = require("mongoose");
const { Schema } = require("mongoose");


const commentSchema = new Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true,
        },
        blog:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Blog",
            required: true,
        },
        comments:[{
            type:String,
        }]
        
    },{
      timestamps:true
    })



const commentModel = mongoose.model("Comment", commentSchema);
module.exports.commentModel = commentModel;