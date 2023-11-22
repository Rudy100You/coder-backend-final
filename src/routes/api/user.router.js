import ResetKeyService from "../../services/resetKey.service.js";
import ResetKeyRepository from "../../dao/repository/resetKey.repository.js";
import UserService from "../../services/user.service.js";
import UserRepository from "../../dao/repository/user.repository.js";
import { Router } from "express";
import UserController from "../../controllers/user.controller.js";
import uploader, { handledUploadFields } from "../../utils/middlewares/multer.uploader.js";
import { MailService } from "../../services/mail.service.js";
import { currentUserIsAdmin } from "../../utils/middlewares/session.validations.js";

const usersRouter = Router();

const userController = new UserController( new UserService(new UserRepository()), new ResetKeyService(new ResetKeyRepository()), new MailService());

usersRouter.get("/", userController.retrieveUsers);

usersRouter.patch("/premium/:uid", currentUserIsAdmin, userController.toggleUserPremiumRole);

usersRouter.post("/:uid/documents",uploader.fields(handledUploadFields), userController.uploadDocuments);

usersRouter.post("/reset-password", userController.resetPassword);

usersRouter.post("/reset-password/send-email", userController.sendResetEmail);

usersRouter.delete("/purgeInactive", userController.purgeInactiveUsers);

usersRouter.delete("/:uid", currentUserIsAdmin, userController.deleteUser);
export default usersRouter;
