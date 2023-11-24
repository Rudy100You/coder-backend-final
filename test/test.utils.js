import { faker } from "@faker-js/faker";
import {
  RAILWAY_PUBLIC_DOMAIN,
  APP_URL,
  DATABASE_NAME,
  MDB_HOST,
  MDB_PASS,
  MDB_USER,
  PORT,
} from "../src/config/dotenv.config.js";
import CartRepository from "../src/dao/repository/cart.repository.js";
import ProductRepository from "../src/dao/repository/product.repository.js";
import UserRepository from "../src/dao/repository/user.repository.js";
import CartService from "../src/services/cart.service.js";
import ProductService from "../src/services/product.service.js";
import UserService from "../src/services/user.service.js";
import { generateProduct } from "../src/utils/mock.generators.js";

export const MONGO_URL = `mongodb+srv://${MDB_USER}:${MDB_PASS}@${MDB_HOST}/${DATABASE_NAME}?retryWrites=true&w=majority`;

const productRepository = new ProductRepository();
const userService = new UserService(new UserRepository());
const cartService = new CartService(productRepository, new CartRepository());
const productService = new ProductService(productRepository);
const HTTPS_RAILWAY_PUBLIC_DOMAIN = RAILWAY_PUBLIC_DOMAIN? `https://${RAILWAY_PUBLIC_DOMAIN}`: null;

export const getTestURLForRequester = () => {
  const testUrl = HTTPS_RAILWAY_PUBLIC_DOMAIN || APP_URL
    ? `${HTTPS_RAILWAY_PUBLIC_DOMAIN || APP_URL}:8080`
    : `http://localhost:${PORT || 4000}`;
  console.log(`Using test url: ${testUrl}`);
  return testUrl;
};
export const getNonPremiumMockUserCookiesForTest = async (requester) => {
  const mockUserReg = {
    firstName: "Guillermo",
    lastName: "Hernandez",
    birthday: "2000-07-05",
    email: "ghez@gmail.com",
    password: "nordelgang",
  };
  const mockUserLogin = {
    email: "ghez@gmail.com",
    password: "nordelgang",
  };
  try {
    await requester.get("/api/sessions/logout");
    await requester.post("/api/sessions/register").send(mockUserReg);
  } catch (e) {
    console.error(e.message);
  }
  const loginRes = await requester
    .post("/api/sessions/login")
    .send(mockUserLogin);
  return loginRes.headers["set-cookie"][0];
};
export const getPremiumMockUserCookiesForTest = async (requester) => {
  const mockUserReg = {
    firstName: "Guillermo",
    lastName: "Hernandez",
    birthday: "2000-07-05",
    email: "ghez2@gmail.com",
    password: "gnagledroN",
  };
  const mockUserLogin = {
    email: "ghez2@gmail.com",
    password: "gnagledroN",
  };
  try {
    await requester.get("/api/sessions/logout");
    await requester.post("/api/sessions/register").send(mockUserReg);

    const user = await userService.findUserByCriteria({
      email: "ghez2@gmail.com",
    });
    await userService.updateUserRole(user._id, "PREMIUM");
  } catch (e) {
    console.error(e.message);
  }
  const loginRes = await requester
    .post("/api/sessions/login")
    .send(mockUserLogin);

  return loginRes.headers["set-cookie"][0];
};

export const getCartForTest = async () => {
  return (
    await cartService.createCart({
      products: [{ product: faker.database.mongodbObjectId() }],
    })
  )._doc;
};

export const getProductForTest = async () => {
  const res = await productService.createProduct(generateProduct());
  return res._doc;
};

export const getLastConnection = async (email)=>{
  const {last_connection} = await userService.findUserByCriteria({email})
  return last_connection;
}