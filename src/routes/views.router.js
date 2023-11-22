import { Router } from "express";
import {
  currentUserCanHaveCarts,
  currentUserIsAdmin,
  validateActiveSession,
} from "../utils/middlewares/session.validations.js";
import ProductRepository from "../dao/repository/product.repository.js";
import ProductService from "../services/product.service.js";
import CartService from "../services/cart.service.js";
import CartRepository from "../dao/repository/cart.repository.js";
import UserService from "../services/user.service.js";
import UserRepository from "../dao/repository/user.repository.js";

const viewsRouter = Router();
const productService = new ProductService(new ProductRepository());
const cartService =new CartService(productService, new CartRepository());

const viewContext = (req, data)=>{
  return {user:req.user, data}
}

const userService = new UserService(new UserRepository());

viewsRouter.use(validateActiveSession);

viewsRouter.get("/products", (req, res) => {
  res.redirect("/products/1");
});

viewsRouter.get("/products/:pgid?", async (req, res) => {
  const { pgid } = req.params || 1;
  let { category, sort } = req.query;
  let data;
  try {
    data = await productService.getAllProductsPaginated(
      10,
      pgid,
      {category},
      sort,
      req.originalUrl
    );
    if (isNaN(pgid) || pgid > data.totalPages)
      data = { invalidPageError: true };
    res.render("products", viewContext(req,data));
  } catch (err) {
    console.error(err);
  }
});

viewsRouter.get("/product/:pid", async (req, res) => {
  const { pid } = req.params;
  let products;
  try {
    products = await productService.findproductById(pid);
  } catch (err) {
    console.error(err);
  }
  res.render("product", viewContext(req,products));
});

viewsRouter.get("/carts/:cid", currentUserCanHaveCarts, async (req, res) => {
  const { cid } = req.params;
  let cart;
  try {
    cart = await cartService.findcartById(cid);
  } catch (err) {
    console.error(err);
  }
  res.render("cart", viewContext(req,cart));
});

viewsRouter.get("/profile",  (req, res) => {
  res.render("profile", viewContext(req));
});

viewsRouter.get("/admin", currentUserIsAdmin, async (req, res) => {
  const allUsersPaginated =  await userService.getAllUsers();
  return res.render("admin", viewContext(req,allUsersPaginated));
});
export default viewsRouter;
