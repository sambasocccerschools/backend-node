import { ConstHTTPRequest, ConstMessagesJson, ConstStatusJson} from "@TenshiJS/consts/Const";
import GenericController from "@TenshiJS/generics/Controller/GenericController";
import RequestHandler from "@TenshiJS/generics/RequestHandler/RequestHandler";
import GenericRepository from '../../../../../tenshi/generics/Repository/GenericRepository';

import { Guardian } from "@index/entity/Guardian";
import { Family } from "@index/entity/Family";
import { EmergencyContact } from "@index/entity/EmergencyContact";
import { WeeklyClassFreeTrial } from "@index/entity/WeeklyClassFreeTrial";
import WeeklyClassFreeTrialDTO from "../dtos/WeeklyClassFreeTrialDTO";
import { Student } from "@index/entity/Student";
import JWTObject from "@TenshiJS/objects/JWTObject";
import HttpAction from "@TenshiJS/helpers/HttpAction";
import { FindManyOptions } from "typeorm";

export default class WeeklyClassFreeTrialController extends GenericController{

    constructor() {
        super(WeeklyClassFreeTrial);
    }

    async insertDynamic(reqHandler: RequestHandler): Promise<any> {

        return this.getService().insertService(reqHandler, async (jwtData, httpExec) => {

            let body = reqHandler.getAdapter().entityFromPostBody();
          
            try{
                const studentRepository = await new GenericRepository(Student);
                const familyRepository = await new GenericRepository(Family);
                const guardianRepository = await new GenericRepository(Guardian);
                const emergencyContactRepository = await new GenericRepository(EmergencyContact);
             
                //Insert New Family
                let family = new Family();
                family.franchise = body.franchise;
                family = await familyRepository.add(family);

                let isSuccess = true;
                let errorMessage:any = "";
                let guardianInsert = null;
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
                            guardianInsert = await guardianRepository.add(guardian);
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

                // Insert the entity into the database
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

                const weeklyClassesFreeTrialBody =(reqHandler.getAdapter() as WeeklyClassFreeTrialDTO).weeklyClassesFreeTrialChangeStatusPostBody();
                for (const id of weeklyClassesFreeTrialBody.weekly_classes_free_trial_id) {
                    const body = {
                        "free_trial_status": weeklyClassesFreeTrialBody.free_trial_status_code,
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

                const weeklyClassesFreeTrialBody =(reqHandler.getAdapter() as WeeklyClassFreeTrialDTO).weeklyClassesFreeTrialAssignAgentPostBody();
                for (const id of weeklyClassesFreeTrialBody.weekly_classes_free_trial_id) {
                    const body = {
                        "agent": weeklyClassesFreeTrialBody.agent_id,
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
                const entities = await this.getRepository().findAll(reqHandler.getLogicalDelete(), reqHandler.getFilters(), page, size);

                const guardianRepository = await new GenericRepository(Guardian);

                if(entities != null && entities != undefined){

                    for (const freeTrial of entities) {
                        if(freeTrial.student != null){
                            const findManyOptions: FindManyOptions = {
                                where: {
                                    family: {
                                        id: freeTrial.student.family.id,
                                    }
                                },
                            };

                            const guardian = await guardianRepository.findByOptions(true, false, findManyOptions);
                            freeTrial.guardian = guardian;
                        }else{
                            freeTrial.guardian = null;
                        }
                    }
                     
                    // Return the success response
                    return httpExec.successAction(
                        reqHandler.getAdapter().entitiesToResponse(entities), 
                        ConstHTTPRequest.GET_ALL_SUCCESS);

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
    
    

