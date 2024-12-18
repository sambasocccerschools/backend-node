import { ConstHTTPRequest, ConstMessagesJson, ConstStatusJson } from "@TenshiJS/consts/Const";
import GenericController from "@TenshiJS/generics/Controller/GenericController";
import RequestHandler from "@TenshiJS/generics/RequestHandler/RequestHandler";
import HttpAction from "@TenshiJS/helpers/HttpAction";
import JWTObject from "@TenshiJS/objects/JWTObject";
import GenericRepository from '../../../../../tenshi/generics/Repository/GenericRepository';

import { FindManyOptions } from 'tenshi/generics/index';
import { ageOfRecord, getCreatedDate } from "@index/utils/DateUtils";
import { Guardian } from "@index/entity/Guardian";
import { Student } from "@index/entity/Student";
import { Family } from "@index/entity/Family";
import { EmergencyContact } from "@index/entity/EmergencyContact";
import { WeeklyClassLead } from "@index/entity/WeeklyClassLead";
import WeeklyClassLeadDTO from "../dtos/WeeklyClassLeadDTO";

export default  class WeeklyClassLeadController extends GenericController{

    constructor() {
        super(WeeklyClassLead);
    }

    async insertDynamic(reqHandler: RequestHandler): Promise<any> {

        return this.getService().insertService(reqHandler, async (jwtData, httpExec) => {

            let body = reqHandler.getAdapter().entityFromPostBody();
          
            try{
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

                body.guardian = guardianInsert;

                // Insert the entity into the database
                const createdEntity = await this.getRepository().add(body);
                
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

                const weeklyClassesLeadBody =(reqHandler.getAdapter() as WeeklyClassLeadDTO).weeklyClassesLeadsChangeStatusPostBody();
                for (const id of weeklyClassesLeadBody.weekly_classes_lead_id) {
                    const body = {
                        "lead_status": weeklyClassesLeadBody.lead_status_code,
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

                const weeklyClassesLeadBody =(reqHandler.getAdapter() as WeeklyClassLeadDTO).weeklyClassesLeadsAssignAgentPostBody();
                for (const id of weeklyClassesLeadBody.weekly_classes_lead_id) {
                    const body = {
                        "agent": weeklyClassesLeadBody.agent_id,
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
                    const studentRepository = await new GenericRepository(Student);

                    for (const entity of entities) {

                        if(entity.guardian.id != null ||
                            entity.guardian.id != undefined
                        ){
                            const kidRange = await this.getKidRange(entity.guardian.id,
                                             guardianRepository, studentRepository);
                            
                            entity.kid_range = kidRange;
                        }else{
                            entity.kid_range = null;
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

    async getKidRange(guardianId: number, 
        guardianRepository: GenericRepository,
        studentRepository: GenericRepository): Promise<string | null> {

        const guardian = await guardianRepository.findByOptions(true, false,
            {
                where: { id: guardianId },
                relations: ["family"],
            }
        );
    
        if (!guardian?.family) {
            return null; 
        }
    
        const students = await studentRepository.findByOptions(true, true,
            {
            where: { family: { id: guardian.family.id } },
        });
    
        if (students.length === 0) {
            return null; 
        } 

        const ages = students.map((student: { age: any; }) => student.age);
        const minAge = Math.min(...ages);
        const maxAge = Math.max(...ages);
    
        return `${minAge} to ${maxAge}`;
    }
}
    
    

