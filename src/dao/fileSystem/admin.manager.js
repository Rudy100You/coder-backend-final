import { logger } from "../../utils/middlewares/logger.handler.js";
import {__src_dirname, pathJoin} from "../../utils/utils.js";
import fs from "fs"

class AdminManager {
    constructor (){
        
        this.path = pathJoin(__src_dirname,"data","admins.json")
            if (!fs.existsSync(this.path)) 
            throw "Error: File not Found";
        logger.debug(`Sucessfully initialized AdminManager with file [${this.path}]`)
    }
    async findAdminByEmailAndPassword(email,password){
            const adminUsers = await this.parseDataFromFile()
            const adminUser = adminUsers.admins.find((user)=> user.email.toLowerCase() === email.toLowerCase() && user.password === password )
            return adminUser
        }

    async findAdminByEmail(email){
        const adminUsers = await this.parseDataFromFile()
        const adminUser = adminUsers.admins.find((user)=> user.email === email)
        return adminUser
    }

    async parseDataFromFile() {
    return JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
    }
} 

export default new AdminManager()