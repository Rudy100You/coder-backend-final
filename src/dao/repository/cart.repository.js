import { cartsSchema } from "../models/schema/carts.schema.js";
import { CommonMDBRepository } from "./commonMDB.repository.js";

export default class CartRepository extends CommonMDBRepository {
  constructor() {
    super("carts", cartsSchema);
  }

  async getOne(id) {
    const cart = await this.baseModel
      .findOne({ _id: id },null,{lean:true}).select("-expiresAt")
    return cart;
  }
  async getOnePopulated(id) {
    const cart = await this.baseModel
      .findOne({ _id: id },null,{lean:true}).select("-expiresAt")
      .populate("products.product");
    return cart;
  }

  async insertCartProducts(cid, pid) {
    const productExistsInCart = await this.baseModel.findOne({
      _id: cid,
      "products.product": pid,
    });

    if (productExistsInCart) {
      await this.baseModel.findOneAndUpdate(
        {
          _id: cid,
          "products.product": pid,
        },
        { $inc: { "products.$.quantity": 1 } },
        { new: true }
      );
    } else {
      await this.baseModel.findOneAndUpdate(
        { _id: cid },
        { $push: { products: { product: pid } } },
        { new: true }
      );
    }
  }

  async removeFromCart(cid,pid){
    await this.baseModel.findOneAndUpdate(
      { _id: cid },
      { $pull: { products: { product: pid } } },
      { new: true }
    )
  }

  async addQuantityToProduct(cid,pid, quantity){
    await this.baseModel.findOneAndUpdate(
      {
        _id: cid,
        "products.product": pid,
      },
      { $inc: { "products.$.quantity": quantity } }
    )
  }

  async deleteAllProductsFromCart(cid){
    await this.baseModel.findOneAndUpdate(
      {
        _id: cid,
      },
      { $set: { products: [] } }
    )
  }
}
