import { ConstHTTPRequest } from "@TenshiJS/consts/Const";
import GenericController from "@TenshiJS/generics/Controller/GenericController";
import RequestHandler from "@TenshiJS/generics/RequestHandler/RequestHandler";
import { WeeklyClassSale } from "@index/entity/WeeklyClassSale";
import WeeklyClassSaleDTO from "../dtos/WeeklyClassSaleDTO";

export default class WeeklyClassSaleController extends GenericController{

    constructor() {
        super(WeeklyClassSale);
    }

    async changeStatus(reqHandler: RequestHandler) : Promise<any> {
        return this.getService().updateService(reqHandler, async (jwtData, httpExec) => {
          
            try {

                let isSuccess = true;
                let errorMessage:any = "";

                const weeklyClassesSaleBody =(reqHandler.getAdapter() as WeeklyClassSaleDTO).weeklyClassesSaleChangeStatusPostBody();
                for (const id of weeklyClassesSaleBody.weekly_classes_sale_id) {
                    const body = {
                        "sale_status": weeklyClassesSaleBody.sale_status_code,
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
    
    

