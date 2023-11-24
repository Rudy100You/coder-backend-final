import mongoose from "mongoose";

const cartProductSchema = mongoose.Schema({
  product:{
    type: mongoose.Types.ObjectId,
    ref:"products",
    required:true
  },
  quantity: {
    type: Number,
    default: 1,
  },
}, { _id: false});

export const cartsSchema = mongoose.Schema(
  {
    products: {
      type: [cartProductSchema],
      required: true
    },
    expiresAt: {
      type: Date,
      expires: 3600, // The TTL index will handle document expiration
      default: Date.now, // Set the default expiration date
    },
  },
  { versionKey: false}
);