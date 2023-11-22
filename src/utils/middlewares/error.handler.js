import ErrorTypes from "../errors/ErrorTypes.js";
import { logger } from "./logger.handler.js";



const findLowestMDBError = (error)=>{
    if(error.errors > 0)
        return findLowestMDBError(error.errors[0])
    else{
        return error;
    }
}

// eslint-disable-next-line no-unused-vars
export const errorHandler = (error,req,res, next)=>{
    if (error){
    logger.debug(error.message)
    logger.error(error.cause);

    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).send({ status: "error", message: "Request is malformed. Please Check Syntax." });
    }

    if(error.status === 403)
    return res.status(403).send({ status: "error", message: "You are not allowed to make this request. Check if You are logged in" });

    if(Object.values(ErrorTypes.MDB_ERROR).includes(error.name))
    {
        error = findLowestMDBError(error)

        switch(error.name)
        {
            case ErrorTypes.MDB_ERROR.MDB_DOC_NOT_FOUND_ERROR:
                return res.status(404).send({status:"error", message: `${(error.notFoundEntity ?? "Document")} could not be found`})
            case ErrorTypes.MDB_ERROR.MDB_CAST_ERROR:
                return res.status(422).send({status:"error", message:`Field [${error.path}] must be of ${error.kind } " type"`});
            case ErrorTypes.MDB_ERROR.MDB_VALIDATION_ERROR:
                return res.status(422).send({status:"error", message:`Field [${error.path}] is required`});
            default:
                return res.status(500).send({status:"error", message:"Unhandled MDB Error"});
        }
    }
    else{
        switch(error.name){
            case ErrorTypes.ENTITY_ALREADY_EXISTS_ERROR:
                return res.status(400).send({status:"error", message: `${error.entityType}${  error.entityID? " with id [" + error.entityID +"] " : " "}"already exists`})
            case ErrorTypes.ENTITY_DOES_NOT_EXIST_ERROR:
                return res.status(404).send({status:"error", message: `${error.entityType}${  error.entityID? " with id [" + error.entityID +"] " : " "}"does not exist`})
            case ErrorTypes.USER_NOT_ALLOWED_ERROR:
                return res.status(403).send({status:"error", message: `Current user is not allowed to make this request`})
            case ErrorTypes.INLINE_CUSTOM_ERROR:
                return res.status(error.status).send({status:"error", message: error.message})
           default:
                return res.status(500).send({status:"error", message: "Unhandled Error"})
        }
    }
}
else
{
    logger.debug("Endpoint resolved without issues")
}
}