import { Feedback } from "@index/entity/Feedback";
import { UnitDynamicCentral } from "@index/entity/UnitDynamicCentral";
import { ConstHTTPRequest } from "@TenshiJS/consts/Const";
import { FindManyOptions, RequestHandler } from "@TenshiJS/generics";
import GenericController from "@TenshiJS/generics/Controller/GenericController";
import GenericRepository from "@TenshiJS/generics/Repository/GenericRepository";
import FeedbackDTO from "../dtos/FeedbackDTO";
import { getUrlParam } from "@TenshiJS/utils/generalUtils";

export default  class FeedbackController extends GenericController{

    constructor() {
        super(Feedback);
    }

    async assignAgent(reqHandler: RequestHandler) : Promise<any> {
        return this.getService().updateService(reqHandler, async (jwtData, httpExec) => {
          
            try {

                let isSuccess = true;
                let errorMessage:any = "";

                const feedbackBody =(reqHandler.getAdapter() as FeedbackDTO).feedbackAssignAgentPostBody();
                for (const id of feedbackBody.feedbacks_id) {
                    const body = {
                        "agent": feedbackBody.agent_id,
                    };
                
                    try {
                        await this.getRepository().update(id!!, body, reqHandler.getLogicalDelete());
                    } catch (error: any) {
                        isSuccess = false;
                        errorMessage += error.message;
                    }
                }

                if (isSuccess) {
                    return httpExec.successAction(
                        reqHandler.getAdapter().entitiesToResponse(null),
                        ConstHTTPRequest.UPDATE_ENTRIES_SUCCESS
                    );
                } else {
                    return await httpExec.databaseError(
                        errorMessage,
                        jwtData!.id.toString(),
                        reqHandler.getMethod(),
                        this.getControllerName()
                    );
                }

            } catch (error : any) {
                // Return a database error response
                return await httpExec.databaseError(error, jwtData!.id.toString(),
                reqHandler.getMethod(), this.getControllerName());
            }
        });
    }


    async changeStatus(reqHandler: RequestHandler) : Promise<any> {
       return this.getService().updateService(reqHandler, async (jwtData, httpExec) => {
                 
            try {

                let isSuccess = true;
                let errorMessage:any = "";

                const feedbackBody =(reqHandler.getAdapter() as FeedbackDTO).feedbackChangeStatusPostBody();
                for (const id of feedbackBody.feedbacks_id) {
                    const body = {
                        "feedback_status": feedbackBody.feedback_status_code,
                    };
                
                    try {
                        await this.getRepository().update(id!!, body, reqHandler.getLogicalDelete());
                    } catch (error: any) {
                        isSuccess = false;
                        errorMessage += error.message;
                    }
                }

                if (isSuccess) {
                    return httpExec.successAction(
                        reqHandler.getAdapter().entitiesToResponse(null),
                        ConstHTTPRequest.UPDATE_ENTRIES_SUCCESS
                    );
                } else {
                    return await httpExec.databaseError(
                        errorMessage,
                        jwtData!.id.toString(),
                        reqHandler.getMethod(),
                        this.getControllerName()
                    );
                }

            } catch (error : any) {
                // Return a database error response
                return await httpExec.databaseError(error, jwtData!.id.toString(),
                reqHandler.getMethod(), this.getControllerName());
            }
        });
    }
    
}