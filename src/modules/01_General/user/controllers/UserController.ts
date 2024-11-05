import { GenericController, RequestHandler} from "@modules/index";

import { UserRepository, hashPassword, User} from "@index/modules/01_General/user";
        
import { ConstGeneral, ConstHTTPRequest, ConstRoles } from "@TenshiJS/consts/Const";
const jwt = require('jsonwebtoken');

export default class UserController extends GenericController{
    
    constructor() {
        super(User, new UserRepository);
    }
   
    async update(reqHandler: RequestHandler) : Promise<any>{

        return this.getService().updateService(reqHandler, async (jwtData, httpExec, id) => {

            let validateId: number | string | null = null;
            if(jwtData.role == ConstRoles.SUPER_ADMIN){
                try {
                    // Initialize the ID variable to null
                    // Check if the ID is present in the query string
                    if (reqHandler.getRequest().query[ConstGeneral.ID] != undefined) {
                        // Try to parse the ID from the query string as a number
                        validateId = parseInt(reqHandler.getRequest().query[ConstGeneral.ID] as string, 10);
                    }
                } catch (error: any) {} 
            }else{
                validateId = jwtData.id;
            }

            // Validate the id
            if(validateId === null){ return httpExec.paramsError(); }

             //Get data From Body
             const userBody = reqHandler.getAdapter().entityFromPutBody();
             try{
                 if(userBody.password != undefined && userBody.password != null){
                     //Password encryption
                     userBody.password = await hashPassword(userBody.password);
                 }
                 
                 //Execute Action DB
                 const user = await this.getRepository().update(validateId, userBody, reqHandler.getLogicalDelete());
                 return httpExec.successAction(reqHandler.getAdapter().entityToResponse(user), ConstHTTPRequest.UPDATE_SUCCESS);
             
             }catch(error : any){
                 return await httpExec.databaseError(error, jwtData.id.toString(), 
                 reqHandler.getMethod(), this.getControllerName());
             }
        });
    }


    async insert(reqHandler: RequestHandler) : Promise<any>{

        return this.getService().insertService(reqHandler, async (jwtData, httpExec) => {
            //Get data From Body
            const userBody = reqHandler.getAdapter().entityFromPostBody();
                
            try{
                //Password encryption
                userBody.password = await hashPassword(userBody.password);
                //Execute Action DB
                const user = await this.getRepository().add(userBody);
                return httpExec.successAction(reqHandler.getAdapter().entityToResponse(user), ConstHTTPRequest.INSERT_SUCESS);
            
            }catch(error : any){
                return await httpExec.databaseError(error, jwtData!.id.toString(), 
                reqHandler.getMethod(), this.getControllerName());
            }
        });   
    }
}