import { Router } from "express";
import passport from "passport";
import {
  isAPIrequest,
  validateActiveSession,
} from "../../utils/middlewares/session.validations.js";
import { logger } from "../../utils/middlewares/logger.handler.js";
import UserService from "../../services/user.service.js";
import UserRepository from "../../dao/repository/user.repository.js";
import CustomError from "../../utils/errors/CustomError.js";
import ErrorTypes from "../../utils/errors/ErrorTypes.js";

const sessionsRouter = Router();
const userService = new UserService(new UserRepository());

sessionsRouter.post('/register', (req, res, next) => {
  passport.authenticate('register', (err) => {
    try{
      if (err){
        CustomError.throwNewError({
          name: ErrorTypes.INLINE_CUSTOM_ERROR,
          cause: "error trying to register user",
          message: "error trying to register user"
        })
      }
      return res
        .status(201)
        .send({ status: "success", message: "User registered successfully" });
    }catch{
      next()
    }
  
  })(req, res, next);
});

sessionsRouter.post(
  "/login",
  (req, res, next) => {
    logger.debug("login endpoint reached");
    next();
  },
  passport.authenticate("login", { failureRedirect: "/error" }),
  async (req, res, next) => {
    try {
      return res
        .status(200)
        .send({ status: "success", message: "Logged in successfully" });
    } catch (err) {
      next();
    }
  }
);

sessionsRouter.get(
  "/github",
  passport.authenticate("github"),
  async (req, res) => {
    return res.status(200);
  }
);

sessionsRouter.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    successRedirect: "/profile",
  }),
  async (req, res) => {
    return res.status(200);
  }
);

sessionsRouter.use(validateActiveSession);
sessionsRouter.get("/logout", async (req, res, next) => {
  try{
  await userService.setLastConnected(req.user);
  req.session.destroy((err) => {
    if (err) {
      //logger.error("Error destroying session:", err);
      return res.redirect(500, "/error");
    }
    if (isAPIrequest(req)) {
      return res
        .status(200)
        .send({ status: "success", message: "Session destroyed sucessfully" });
    }
    res.redirect("/login");
  });
}catch(err){
next(err)}
});

sessionsRouter.get("/current", (req, res) => {
  return res.send(req.user);
});

export default sessionsRouter;
