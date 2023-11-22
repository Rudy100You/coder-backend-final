import CustomError from "../utils/errors/CustomError.js";
import ErrorTypes from "../utils/errors/ErrorTypes.js";
import { equalsIgnoreCase } from "../utils/utils.js";

const {GOOGLE_MAIL_SENDER} = process.env;

export default class ProductController {
  constructor(productService, mailService) {
    this.productService = productService;
    this.mailService = mailService
  }

  getAllProducts = async (req, res, next) => {
    try {
      let { limit, page, query, sort } = req.query;
      if(!query.category)
        query = null
      const pagRes = await this.productService
        .getAllProductsPaginated(limit, page, query, sort)
        if(!pagRes)
          CustomError.throwNewError({name:ErrorTypes.INLINE_CUSTOM_ERROR, message:"Requested products page doesn't exist", status: 404});
        
          res.json({ status: "success", ...pagRes });
        }
     catch (error) {
      next(error);
    }
  };
  getProduct = (req, res, next) => {
    let productID = req.params.pid;
    this.productService
      .findproductById(productID)
      .then((product) => {
        res.json(product);
      })
      .catch((err) => {
        err.notFoundEntity = "Product";
        next(err);
      });
  };
  createProduct = async (req, res, next) => {
    try {
      const newProduct = {...req.body, owner: req.user.email};
      const productFound = await this.productService.existsByCriteria({
        code: newProduct.code,
      });
      if (productFound) {
        CustomError.throwNewError({
          name: ErrorTypes.ENTITY_ALREADY_EXISTS_ERROR,
          cause: "Provided product already exists",
          message: `Product with code ${newProduct.code}  already exists`,
          customParameters: { entity: "Product", entityID: newProduct.code },
        });
      } else {
        await this.productService.createProduct(newProduct);
        res
          .status(201)
          .json({ status: "success", payload: "Product created successfully" });
      }
    } catch (error) {
      next(error);
    }
  };

  updateProductData = async (req, res, next) => {
    const productID = req.params.pid;
    const modProduct = req.body;

    try {
      if (await this.#validateProdManipulationByUser(req.user, productID)) {
        await this.productService.updateProduct(productID, modProduct);
        return res
          .status(200)
          .json({ status: "success", payload: "Product updated successfully" });
      } else {
        CustomError.throwNewError({
          name: ErrorTypes.USER_NOT_ALLOWED_ERROR,
          cause: "Can not modify product that current user does not own",
          message: `Can not modify product that current user does not own`,
        });
      }
    } catch (err) {
      err.notFoundEntity = "Product";
      next(err);
    }
  };

  deleteProduct = async (req, res, next) => {
    const productID = req.params.pid;
    try {
      if (await this.#validateProdManipulationByUser(req.user, productID)) {
        const productToBeDeleted = await this.productService.findproductById(productID);
        await this.productService.delete(productID);
        this.mailService.getTransport().sendMail({
          from: `RS CODER <${GOOGLE_MAIL_SENDER}>`,
          to: productToBeDeleted.owner,
          subject: `Your product has been deleted`,
          html: `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <titleYour product has been deleted</title>
            <!-- Include Bootstrap CSS from a CDN -->
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.5.0/dist/css/bootstrap.min.css" rel="stylesheet">
          </head>
          <body>
            <div class="container">
              <div class="row">
                <div class="col">
                  <h1>Your product has been deleted</h1>
                  <img src="https://tenor.com/bdQpf.gif" alt="to-dump" height = "300"></img>
                  <p>Hello,</p>
                  <p>Your product <br>${productToBeDeleted.title}</br> was deleted by an admin</p>
                  <p>If you think this was an error, please send your queries to <a href="mailto:${GOOGLE_MAIL_SENDER}">us</a></p>
                  <br>
                  <p>Regards,</p>
                  <br>
                  <p>RS CODER Team</p>
                </div>
              </div>
            </div>
          </body>
          </html>
          `,
        });

        res
          .status(200)
          .json({ status: "success", payload: "Product deleted successfully" });
      } else {
        CustomError.throwNewError({
          name: ErrorTypes.USER_NOT_ALLOWED_ERROR,
          cause: "Can not modify product that current user does not own",
          message: `Can not modify product that current user does not own`,
        });
      }
    } catch (err) {
      err.notFoundEntity = "Product";
      next(err);
    }
  };

  async #validateProdManipulationByUser(user, productID) {
    return (
      equalsIgnoreCase(user.role, "ADMIN") ||
      (equalsIgnoreCase(user.role, "PREMIUM") &&
        (await this.productService.findproductById(productID)).owner ===
          user.email)
    );
  }
}
