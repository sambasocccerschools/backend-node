import { ConstHTTPRequest, ConstMessagesJson, ConstStatusJson } from "@TenshiJS/consts/Const";
import GenericController from "@TenshiJS/generics/Controller/GenericController";
import RequestHandler from "@TenshiJS/generics/RequestHandler/RequestHandler";
import HttpAction from "@TenshiJS/helpers/HttpAction";
import JWTObject from "@TenshiJS/objects/JWTObject";
import WeeklyClassWaitingListDTO from "../dtos/WeeklyClassWaitingListDTO";
import GenericRepository from '../../../../../tenshi/generics/Repository/GenericRepository';

import { FindManyOptions } from 'tenshi/generics/index';
import { ageOfRecord, getCreatedDate } from "@index/utils/DateUtils";
import { Guardian } from "@index/entity/Guardian";
import { Student } from "@index/entity/Student";
import { Family } from "@index/entity/Family";
import { EmergencyContact } from "@index/entity/EmergencyContact";
import { WeeklyClassWaitingList } from "@index/entity/WeeklyClassWaitingList";

export default  class WeeklyClassWaitingListController extends GenericController{

    constructor() {
        super(WeeklyClassWaitingList);
    }


    async insertDynamic(reqHandler: RequestHandler): Promise<any> {

        return this.getService().insertService(reqHandler, async (jwtData, httpExec) => {

            let body = reqHandler.getAdapter().entityFromPostBody();
          
            try{
                const studentRepository = await new GenericRepository(Student);
                const familyRepository = await new GenericRepository(Family);
                const guardianRepository = await new GenericRepository(Guardian);
                const emergencyContactRepository = await new GenericRepository(EmergencyContact);
             
                 //Insert Family
                 let family : Family | null = null;

                 if(body.family == null){ 
                     family = new Family();
                     family.franchise = body.franchise;
                     family = await familyRepository.add(family);
                 }else{
                     family = await familyRepository.findByOptions(true, false,  
                         {
                             where: { 
                                 id: body.family , 
                                 is_deleted: false
                             }
                         });
                 }
 
                 body.family = family?.id;
                 body.agent = jwtData!.id;

                let isSuccess = true;
                let errorMessage:any = "";
                const newStudents: Array<Student> = [];

                if (Array.isArray(body.students) && body.students.length > 0) {
                    for (const student of body.students) {
                        student.franchise = body.franchise;
                        student.family = family;
    
                        try {
                            newStudents.push(await studentRepository.add(student));
                        } catch (error: any) {
                            isSuccess = false;
                            errorMessage += error.message;
                        } 
                    }
                }


                if (Array.isArray(body.guardians) && body.guardians.length > 0) {
                    for (const guardian of body.guardians) {
                        guardian.franchise = body.franchise;
                        guardian.family = family;
    
                        try {
                            await guardianRepository.add(guardian);
                        } catch (error: any) {
                            isSuccess = false;
                            errorMessage += error.message;
                        } 
                    }
                }

                if (Array.isArray(body.emergency_contacts) && body.emergency_contacts.length > 0) {
                    for (const emergencyContact of body.emergency_contacts) {
                        emergencyContact.franchise = body.franchise;
                        emergencyContact.family = family;
    
                        try {
                            await emergencyContactRepository.add(emergencyContact);
                        } catch (error: any) {
                            isSuccess = false;
                            errorMessage += error.message;
                        } 
                    }
                }

          
                let createdEntity = null;
                for (const student of newStudents) {
                    body.student = student.id;

                    // Insert the entity into the database
                    createdEntity = await this.getRepository().add(body);
                }

                const codeResponse : string = 
                reqHandler.getCodeMessageResponse() != null ? 
                reqHandler.getCodeMessageResponse() as string :
                ConstHTTPRequest.INSERT_SUCCESS;

                if (isSuccess) {
                   // Return the success response
                    return httpExec.successAction(
                        reqHandler.getAdapter().entityToResponse(createdEntity), 
                        codeResponse);
                } else {
                    return await httpExec.databaseError(
                        errorMessage,
                        jwtData!.id.toString(),
                        reqHandler.getMethod(),
                        this.getControllerName()
                    );
                }
               
            }catch(error : any){
                // Return the database error response
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

                const weeklyClassesWaitingListBody =(reqHandler.getAdapter() as WeeklyClassWaitingListDTO).weeklyClassesWaitingListChangeStatusPostBody();
                for (const id of weeklyClassesWaitingListBody.weekly_classes_waiting_list_id) {
                    const body = {
                        "waiting_list_status": weeklyClassesWaitingListBody.waiting_list_status_code,
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



    async assignAgent(reqHandler: RequestHandler) : Promise<any> {
        return this.getService().updateService(reqHandler, async (jwtData, httpExec) => {
          
            try {

                let isSuccess = true;
                let errorMessage:any = "";

                const weeklyClassesWaitingListBody =(reqHandler.getAdapter() as WeeklyClassWaitingListDTO).weeklyClassesWaitingListAssignAgentPostBody();
                for (const id of weeklyClassesWaitingListBody.weekly_classes_waiting_list_id) {
                    const body = {
                        "agent": weeklyClassesWaitingListBody.agent_id,
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


    async getAll(reqHandler: RequestHandler): Promise<any> {

        return this.getService().getAllService(reqHandler, async (jwtData : JWTObject, httpExec: HttpAction, page: number, size: number) => {
            try {
               
                // Execute the get all action in the database
                const entities = await this.getRepository()
                                .findAll(reqHandler.getLogicalDelete(), 
                                reqHandler.getFilters(), page, size);

                if(entities != null && entities != undefined){
                    const codeResponse : string = 
                        reqHandler.getCodeMessageResponse() != null ? 
                        reqHandler.getCodeMessageResponse() as string :
                        ConstHTTPRequest.GET_ALL_SUCCESS;

                    const guardianRepository = await new GenericRepository(Guardian);

                    for (const entity of entities) {

                        if(entity.student.family != null && entity.student.family != undefined){
                            const findManyOptions: FindManyOptions = {
                                where: {
                                    family: Number(entity.student.family.id),
                                },
                                order: {
                                    id: 'ASC', 
                                },
                                take: 1, 
                            };
                            const guardian = await guardianRepository.findAll(reqHandler.getLogicalDelete(), findManyOptions);
                            if (guardian && guardian.length > 0) {
                                entity.life_cycle_membership = ageOfRecord(getCreatedDate(guardian[0]));
                            } else {
                                entity.life_cycle_membership = null; 
                            }
                        }
                    }

                    // Return the success response
                    return httpExec.successAction(
                        reqHandler.getAdapter().entitiesToResponse(entities), 
                        codeResponse);

                }else{
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS);
                }

            } catch (error: any) {
                // Return the database error response
                return await httpExec.databaseError(error, jwtData.id.toString(),
                    reqHandler.getMethod(), this.getControllerName());
            }
        });
    }
}
    
    

