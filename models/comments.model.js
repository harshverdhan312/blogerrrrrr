const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = require("mongoose");


const commentSchema = new Schema(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true,
        },
        author:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true,
        },
        blog:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Blog",
            required: true,
        },
        comment:[{
            type:String,
        }]
        
    },{
      timestamps:true
    })



const commentModel = mongoose.model("Comment", commentSchema);
exports.commentModel = commentModel;