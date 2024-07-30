const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = require("mongoose");


const userSchema = new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      
    })