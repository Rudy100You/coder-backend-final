import { Router } from "express";
import cartsRouter from "./api/carts.router.js";
import sessionsRouter from "./api/sessions.router.js";
import productsRouter from "./api/products.router.js";
import { generateProduct } from "../utils/mock.generators.js";
import { logger } from "../utils/middlewares/logger.handler.js";
import usersRouter from "./api/user.router.js";

const apiRouter = Router()

apiRouter.use("/sessions",sessionsRouter)

apiRouter.use("/carts",cartsRouter)

apiRouter.use("/products", productsRouter)

apiRouter.use("/users", usersRouter)

apiRouter.get("/mockingproducts", (req,res)=>{
    let {q} = req.query
    if(isNaN(q))
        q = undefined
    const products =  (arr = [])=>{
        for(let i =0; i < (q ?? 100); i++)
            arr.push(generateProduct())
        return arr
    }

    res.status(200).send({products: products()})

})

apiRouter.get("/loggerTest",(req,res)=>{
    logger.debug("This is a DEBUG message")
    logger.info("This is an INFO message")
    logger.warning("This is a WARN message")
    logger.error("This is an ERROR message")
    logger.fatal("This is a FATAL message")
    res.status(200).send({status: "success", message: "Log successful. Please check console and/or file logs"})
})

export default apiRouter