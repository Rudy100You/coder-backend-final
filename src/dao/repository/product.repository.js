import { productSchema } from "../models/schema/products.schema.js";
import { CommonMDBRepository } from "./commonMDB.repository.js";

export default class ProductRepository extends CommonMDBRepository {
  constructor() {
    super("products", productSchema);
  }

  async getAllPaginated(limit = 10, page =1, query, sort) {
    sort =  ['asc','desc'].includes(sort)? {price: sort} :null;
    const customLabels = { docs: "payload" }
    const result = await super.getAllPaginated(limit, page, query, sort, customLabels);

    delete result.totalDocs;
    delete result.pagingCounter;

    return result;
  }
}
