import mongoose from "mongoose";
import { purgeNullValuesFromObject } from "../../utils/utils.js";
export class CommonMDBRepository {
  constructor(collectionName, docSchema) {
    this.baseModel = mongoose.model(collectionName, docSchema);
  }

  async getAllPaginated(limit = 10, page = 1, query = {}, sort = null, customLabels = {}
) {
    query = purgeNullValuesFromObject(query)
    return await this.baseModel.paginate(query, {
      limit,
      page,
      sort,
      customLabels,
      lean:true
    });
  }

  async getAll() {
    const allDocs = await this.baseModel.find({});
    return allDocs;
  }

  async getOne(id) {
    const oneDoc = await this.baseModel.findById(id);
    return oneDoc;
  }

  async existsByCriteria(criteria) {
    const foundProduct = await this.baseModel.exists(criteria);
    return foundProduct;
  }

  async findByCriteria(criteria, options) {
    const foundProduct = await this.baseModel.find(criteria, options);
    return foundProduct;
  }

  async create(doc) {
    const newDoc = await this.baseModel.create(doc);
    return newDoc;
  }

  async update(id, doc) {
    await this.baseModel.findByIdAndUpdate(id, doc);
    const docUpdated = await this.baseModel.findById(id);
    return docUpdated;
  }

  async delete(id) {
    const deletedDoc = await this.baseModel.findByIdAndDelete(id);
    return deletedDoc;
  }

  async getOneByCriteria(criteria) {
    const found = await this.baseModel.findOne(criteria,null,{lean:true});
    return found;
  }

  async upsertField(id, fieldname, field){
    let fieldSet = {}
    fieldSet[fieldname] = field;
    await this.baseModel.findByIdAndUpdate(id, {$set:{...fieldSet}})
  }

  async deleteByCriteria(criteria) {
    const deletedRes = await this.baseModel.deleteMany(criteria);
    return deletedRes;
  }
}
