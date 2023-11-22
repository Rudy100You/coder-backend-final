import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const documentSchema = mongoose.Schema({
  name:{
    type:String,
    trim:true
  },
  reference:{
    type :String,
    trim: true,
    lowercase: true,
    match:/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
    }
})

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm,
    },
    birthday: {
      type: Date,
    },
    password: {
      type: String,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    role: {
      type: String,
      default: "BASIC",
    },
    documents:{
      type: [documentSchema]
    },
    last_connection:{
      type:Date
    }
  },
  { versionKey: false, strict: 'throw'}
);

userSchema.plugin(mongoosePaginate)

export { userSchema };
