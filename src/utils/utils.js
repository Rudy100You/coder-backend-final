import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);


// eslint-disable-next-line no-unused-vars
const getTimestampForLogFile =()=> {
  const now = new Date();
  
  const year = now.getFullYear().toString().padStart(4, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const milliseconds = now.getMilliseconds().toString().padStart(4, '0');

  return `${year}${month}${day}_${hours}${minutes}${seconds}${milliseconds}`;
}

//since utils is now in a new folder, is needed to access one dir level up
export const __root_dirname = dirname(dirname(dirname(__filename)));
export const __src_dirname = dirname(dirname(__filename));
export const pathJoin = join;

export const commonErrorMessages = Object.freeze({
  INTERNAL_ERROR_STATUS: 500,
});

export const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => user.password?
  bcrypt.compareSync(password, user.password): false;

export const equalsIgnoreCase =(str1, str2) => String(str1).toLowerCase() === String(str2).toLowerCase()

export const resolveLogFileOutput = ()=>{ 
  const outputFileName = "errors.log"//`ecommerce_backend_${getTimestampForLogFile()}.log`
  const logDIR = process.env.LOG_PATH
  if(logDIR)
   return pathJoin(logDIR, outputFileName)
  return pathJoin(__src_dirname, "logs", outputFileName)
}

export const convertPublicLocalFileToURL = (path)=>{
  let newPath = path;
  newPath = path.replaceAll("\\", "/");
  const publicWordIndex = newPath.indexOf("public");
  newPath = newPath.substring(publicWordIndex, path.length)
  newPath = `${process.env.APP_URL||`http://localhost:${process.env.PORT||4000}`}/${newPath}`
  return newPath;
}
export const validateEmailFormat= (email)=> new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email)

export const purgeNullValuesFromObject = (a)=>{
for (const key in a) {
  if (a[key] === null || a[key] === undefined) {
    delete a[key];
  }
}
return a
}