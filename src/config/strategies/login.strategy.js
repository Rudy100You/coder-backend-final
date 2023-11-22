import { Strategy } from "passport-local";
import { isValidPassword } from "../../utils/utils.js";
import adminManager from "../../dao/fileSystem/admin.manager.js";
import UserService from "../../services/user.service.js";
import { logger } from "../../utils/middlewares/logger.handler.js";
import UserRepository from "../../dao/repository/user.repository.js";

const userService = new UserService(new UserRepository())

export default () => new Strategy(
    {
      passReqToCallback: true,

      usernameField: "email",
    },

    //TODO: fix known vulnerabilities on ADMIN
    async (req, email, password, done) => {

      try {
        const { email, password } = req.body;

        let user = await adminManager.findAdminByEmailAndPassword(
          email,
          password
        );
        if (!user) {
          user = await userService.findUserByCriteria({email});
          if (!user) {
            logger.warn("User not exists");

            return done(null, false);
          }
          if (!isValidPassword(user, password)) 
            return done(null, false);
          await userService.setLastConnected(user);
        }
        logger.debug(`User logged in successfully ${JSON.stringify(user)}`)
        return done(null, userService.removeSensitiveUserData(user));
      } catch (error) {
        return done(null, false);
      }
    }
  )