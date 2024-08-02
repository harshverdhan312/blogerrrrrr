const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = require("mongoose");


const blogsSchema = new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
      },
      coverImage:{
        type:String,
        required: true,
      },
      mainbody: {
        type:String,
        required: true,
      },
      genre:{
        type:String,
        required : true,
      },
      wordslenght:{
        type:String,
        possibleValues: ["less than 100 words ", "more than 100 words"],
        required:true
      },
      forkids:{
        type:Boolean,
        required: true
      },
      likesCount:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Like",
        required:true,
      },
      comments:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Comment",
      }
      
    },{
      timestamps:true
    })



const blogModel = mongoose.model("Blog", blogsSchema);
exports.blogModel = blogModel;