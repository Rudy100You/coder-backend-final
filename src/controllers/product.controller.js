import CustomError from "../utils/errors/CustomError.js";
import ErrorTypes from "../utils/errors/ErrorTypes.js";
import { equalsIgnoreCase } from "../utils/utils.js";

export default class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

  getAllProducts = async (req, res, next) => {
    try {
      let responseBodyMapping;
      let { limit, page, query, sort } = req.query;

      if (!limit || parseInt(limit) === 0) limit = 10;
      const pagRes = await this.productService
        .getAllProductsPaginated(limit, page, query, sort)
  
          responseBodyMapping = pagRes;
          if (
            page &&
            (responseBodyMapping.totalPages < parseInt(page) ||
              parseInt(page) < 1 ||
              isNaN(page))
          ) {
            CustomError.throwNewError({name:ErrorTypes.INLINE_CUSTOM_ERROR, message:"Requested products page doesn't exist", status: 404});
          }

          const linkURL =
            req.protocol + "://" + req.get("host") + req.baseUrl + "?page=";
          responseBodyMapping.prevLink = null;
          responseBodyMapping.nextLink = null;

          if (responseBodyMapping.prevPage)
            responseBodyMapping.prevLink =
              linkURL + responseBodyMapping.prevPage;
          if (responseBodyMapping.nextPage)
            responseBodyMapping.nextLink =
              linkURL + responseBodyMapping.nextPage;

          res.json({ status: "success", ...responseBodyMapping });
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
      const newProduct = req.body;
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
        await this.productService.delete(productID);
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
