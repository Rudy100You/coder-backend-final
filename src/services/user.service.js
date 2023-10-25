import { requiredFileFieldsForUserUpdate } from "../utils/middlewares/multer.uploader.js";
import { hashPassword, isValidPassword } from "../utils/utils.js";

export default class UserService {
  constructor(userRepository)
  {
    this.userRepository = userRepository
  }
  findUserById = async (id) => 
  await this.userRepository.getOne(id);
  findUserByCriteria = async (criteria) =>
  await this.userRepository.getOneByCriteria(criteria);
  createUser = async (user) => 
  await this.userRepository.create(user);
  updateUserPassword = async(userID, password)=>{
    await this.userRepository.update(userID, {password: hashPassword(password)})
  }
  updateUserRole = async(userID, role)=>{
    await this.userRepository.update(userID, {role})
  }
  validateRepeatedPassword = async(userID, password)=>{
    return !isValidPassword(await this.findUserById(userID),password)
  }
  removeSensitiveUserData= (user)=>{
    if(user){
      delete user.password
    }
    return user
  }
  addDocument = async(id, name, reference)=>{
    const {documents} = await this.userRepository.getOne(id);
    documents.push({name, reference})
    await this.userRepository.update(id, {documents})
  }

  userAlreadyHasDocument = async(id, name, reference)=>{
    const {documents} = await this.userRepository.getOne(id);
    return documents.some(doc => doc.name == name && doc.reference == reference)
  }

  userIsEligibleForUpgrade = async(id)=>{
    const {documents} = await this.userRepository.getOne(id);
    return requiredFileFieldsForUserUpdate.every(upgradeFileField => documents.map(doc => doc.name).includes(upgradeFileField))
  }

  setLastConnected = async (email)=>{
    let {_id} = await this.findUserByCriteria({email})
    await this.userRepository.upsertField(_id,"last_connection", new Date())
  }
}