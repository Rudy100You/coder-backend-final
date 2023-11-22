export default class ProductService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  findproductById = async (id) => await this.productRepository.getOne(id);
  findproductByCriteria = async (criteria) =>
    await this.productRepository.getOneByCriteria(criteria);
  existsByCriteria = async (criteria) =>
    await this.productRepository.existsByCriteria(criteria);
  createProduct = async (product) =>
    await this.productRepository.create(product);
  getAllProductsPaginated = async (
    limit,
    page,
    query,
    sort,
    currentURLForLinks
  ) => 
  {
    if (limit) limit = parseInt(limit);
    if (page) page = parseInt(page);
    if (limit <= 0) limit = 10;
    const pagRes = await this.productRepository.getAllPaginated(
      limit,
      page,
      query,
      sort
    );
    
    
    if (
      page &&
      (pagRes.totalPages < parseInt(page) || parseInt(page) < 1 || isNaN(page))
    ) {
      return null;
    }
    if (currentURLForLinks) {
      pagRes.prevLink = null;
      pagRes.nextLink = null;

      if (pagRes.prevPage)
        pagRes.prevLink = currentURLForLinks + pagRes.prevPage;
      if (pagRes.nextPage)
        pagRes.nextLink = currentURLForLinks + pagRes.nextPage;
    }
    return pagRes;
  };
  updateProduct = async (productID, product) =>
    await this.productRepository.update(productID, product);
  deleteProduct = async (productID) =>
    await this.productRepository.delete(productID);
}
