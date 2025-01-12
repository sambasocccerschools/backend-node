import { ConstHTTPRequest } from "@TenshiJS/consts/Const";
import GenericController from "@TenshiJS/generics/Controller/GenericController";
import RequestHandler from "@TenshiJS/generics/RequestHandler/RequestHandler";

import { WeeklyClassCancellation } from "@index/entity/WeeklyClassCancellation";
import WeeklyClassCancellationDTO from "../dtos/WeeklyClassCancellationDTO";
import { getUrlParam } from "@TenshiJS/utils/generalUtils";
import { UnitDynamicCentral } from "@index/entity/UnitDynamicCentral";
import GenericRepository from "@TenshiJS/generics/Repository/GenericRepository";
import { WeeklyClassMember } from "@index/entity/WeeklyClassMember";
import { FindManyOptions } from "typeorm";

export default class WeeklyClassCancellationController extends GenericController{

    constructor() {
        super(WeeklyClassCancellation);
    }

    async assignAgent(reqHandler: RequestHandler) : Promise<any> {
        return this.getService().updateService(reqHandler, async (jwtData, httpExec) => {
          
            try {

                let isSuccess = true;
                let errorMessage:any = "";

                const weeklyClassesCancellationBody =(reqHandler.getAdapter() as WeeklyClassCancellationDTO).weeklyClassesCancellationAssignAgentPostBody();
                for (const id of weeklyClassesCancellationBody.weekly_classes_cancellation_id) {
                    const body = {
                        "agent": weeklyClassesCancellationBody.agent_id,
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
        return this.getService().updateService(reqHandler, async (jwtData, httpExec, id) => {
          
            const udcRepository = await new GenericRepository(UnitDynamicCentral);
            const weeklyClassMemberRepository = await new GenericRepository(WeeklyClassMember);

            try {

                  let isSuccess = true;
                  let errorMessage:any = "";

                    const filters: FindManyOptions = {};
                    filters.relations = [
                        "weekly_class_member",
                        "member_cancel_type",
                        "membership_cancel_reason",
                        "member_cancel_status"
                    ];

                  //Get the param and weekly class cancel by id
                  const status: string | null = getUrlParam("status", reqHandler.getRequest()) || null;
                  let weeklyClassCancellation : WeeklyClassCancellation = await this.getRepository().findById(id!!, reqHandler.getLogicalDelete(), filters);
                  
                  //if the member cancel status is different to request to cancell
                  if(weeklyClassCancellation.member_cancel_status.slug != 'request-to-cancel'){
                        return httpExec.dynamicError("FORBIDDEN", 'This request has already been processed. Approval or rejection is not allowed again.');
                  }

                  if(status == "" || status == null){
                        return httpExec.paramsError();
                  }

                  let memberCancelStatusCode = "";
                  let memberStatusCode = "";

                  //if the param status is approve
                  if(status == "approve"){
                        memberCancelStatusCode = "CANCELLED_MCS";
                        memberStatusCode = "CANCELLED_MS";
                  }else if(status == "reject"){
                        memberCancelStatusCode = "CANCELLATION_REJECTED_MCS";
                        memberStatusCode = "ACTIVE_MS";
                  }

                  try{
                        //Update weekly class Cancel with member cancel status
                        const udcCancelStatus : UnitDynamicCentral = await udcRepository.findByCode(memberCancelStatusCode, true);
                        weeklyClassCancellation.member_cancel_status = udcCancelStatus;
                        await this.getRepository().update(id!!, weeklyClassCancellation, true);
                  }catch(error : any) {
                    isSuccess=false;
                    errorMessage += error.message;
                  }
                  
                  try{
                    //get the weekly class member id
                    const weeklyClassMemberId = weeklyClassCancellation.weekly_class_member.id;
                   
                    //get the new member status
                    const udcMemberStatus : UnitDynamicCentral = await udcRepository.findByCode(memberStatusCode, true);
                    //update weekly class member
                    let weeklyClassmember : WeeklyClassMember = await weeklyClassMemberRepository.findById(weeklyClassMemberId, true);
                    weeklyClassmember.member_status = udcMemberStatus;
                    await weeklyClassMemberRepository.update(weeklyClassMemberId, weeklyClassmember, true);
                  }catch(error : any) {
                    isSuccess=false;
                    errorMessage += error.message;
                  }
                  
                if (isSuccess) {
                    return httpExec.successAction(
                        reqHandler.getAdapter().entitiesToResponse(null),
                        ConstHTTPRequest.UPDATE_SUCCESS
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