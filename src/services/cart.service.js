import CartDTO from "../dto/cart.dto.js";
import ProductDTO from "../dto/product.dto.js";
import ticketService from "./ticket.service.js";

export default class CartService {
  constructor(productService, cartRepository){
    this.productService = productService;
    this.cartRepository = cartRepository
  }
  findcartById = async (id) => 
    await this.cartRepository.getOne(id);
  findCartPopulatedById = async (id) => 
    await this.cartRepository.getOnePopulated(id);
  findcartByCriteria = async (criteria) =>
    await this.cartRepository.getOneByCriteria(criteria);
  createCart = async (cart) => 
    await this.cartRepository.create(cart);
  addQuantityToProduct = async (cid, pid, quantity) =>
    await this.cartRepository.addQuantityToProduct(cid, pid, quantity)
  insertCartProducts = async (cid,pid)=>{
    if(this.productService.findproductById(pid))
      return await this.cartRepository.insertCartProducts(cid,pid)
    throw new Error("Product does not exist")
  }
  removeFromCart = async (cid,pid)=>
    await this.cartRepository.removeFromCart(cid, pid)
  updateCart = async (cid,cart)=>
    await this.cartRepository.update(cid,cart)
  deleteAllProductsFromCart = async(cid)=> 
    await this.cartRepository.deleteAllProductsFromCart(cid)

  finalizePurchase = async(cid, purchaser)=>{
    let cart = new CartDTO(this.findcartById(cid))
    let totalAmount = 0;
    let productsWithoutStock = [];

    cart.products.forEach(async (item, idx, pArray) =>{ 
      const product = new ProductDTO(await this.productService.findproductById(item.product))
      if(item.quantity > product.stock)
        productsWithoutStock = [...productsWithoutStock, pArray.splice(idx,1)[0].product]
      else{
        product.stock =- item.quantity
        await this.productService.updateProduct(product._id, product)
        totalAmount += (product.price * item.quantity)
      }
    })
    if(productsWithoutStock.length > 0)
      return productsWithoutStock
    else{
      await ticketService.createTicket(totalAmount, purchaser)
      await this.cartRepository.delete(cid)
    }
  }
}