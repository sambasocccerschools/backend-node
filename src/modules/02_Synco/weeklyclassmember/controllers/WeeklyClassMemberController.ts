import { WeeklyClassMember } from "@index/entity/WeeklyClassMember";
import { ConstHTTPRequest, ConstMessagesJson, ConstStatusJson } from "@TenshiJS/consts/Const";
import GenericController from "@TenshiJS/generics/Controller/GenericController";
import RequestHandler from "@TenshiJS/generics/RequestHandler/RequestHandler";
import HttpAction from "@TenshiJS/helpers/HttpAction";
import JWTObject from "@TenshiJS/objects/JWTObject";
import WeeklyClassMemberDTO from "../dtos/WeeklyClassMemberDTO";
import GenericRepository from '../../../../../tenshi/generics/Repository/GenericRepository';

import { FindManyOptions } from 'tenshi/generics/index';
import { ageOfRecord, getCreatedDate } from "@index/utils/DateUtils";
import { Guardian } from "@index/entity/Guardian";
import { Student } from "@index/entity/Student";
import { Family } from "@index/entity/Family";
import { EmergencyContact } from "@index/entity/EmergencyContact";
import { DBPersistanceFactory } from "@TenshiJS/persistance/DBPersistanceFactory";
import { config } from "@index/index";
import { executeDatabaseQuery } from "@TenshiJS/persistance/DataBaseHelper/ExecuteQuery";
import { isValidDate } from "@TenshiJS/utils/formatDateUtils";

export default  class WeeklyClassMemberController extends GenericController{

    constructor() {
        super(WeeklyClassMember);
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

                const weeklyClassesMemberBody =(reqHandler.getAdapter() as WeeklyClassMemberDTO).weeklyClassesMemberChangeStatusPostBody();
                for (const id of weeklyClassesMemberBody.weekly_classes_member_id) {
                    const body = {
                        "member_status": weeklyClassesMemberBody.member_status_code,
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

    async getMemberReport(reqHandler: RequestHandler): Promise<any> {
        return this.getService().getAllService(reqHandler, async (jwtData : JWTObject, httpExec: HttpAction, page: number, size: number) => {

            // Get the filters from the query parameters
            let start_date : string | null = null;
            if(reqHandler.getRequest().query['start_date'] != undefined){
                start_date = reqHandler.getRequest().query['start_date'] as string;
            }

            let end_date : string | null = null;
            if(reqHandler.getRequest().query['end_date'] != undefined){
                end_date = reqHandler.getRequest().query['end_date'] as string;
            }

            let venue_filter : string | null = null;
            if(reqHandler.getRequest().query['venue_filter'] != undefined){
                venue_filter = reqHandler.getRequest().query['venue_filter'] as string;
            }

            let class_filter : string | null = null;
            if(reqHandler.getRequest().query['class_filter'] != undefined){
                class_filter = reqHandler.getRequest().query['class_filter'] as string;
            }


            try {
                // Execute the action to get all logs with the specified filters
                const entities = 
                await this.executeMemberReport(start_date, end_date, 
                                               venue_filter, class_filter);

                // Filter out the OkPacket from the entities
                const data = entities.filter((item: any) => !('affectedRows' in item));

                // Return the success response
                return httpExec.successAction(data, ConstHTTPRequest.GET_ALL_SUCCESS);
            } catch(error : any) {
                // Return the database error response
                return await httpExec.databaseError(error, jwtData.id.toString(), 
                reqHandler.getMethod(), this.getControllerName());
            }
        });
     }



    async executeMemberReport(
        start_date : string | null,
        end_date: string | null, 
        venue_filter : string | null,
        class_filter: string | null): Promise<any>{
    
            if (!isValidDate(start_date) || !isValidDate(end_date)) {
                throw new Error("Invalid date format. Expected YYYY-MM-DD.");
            }
            
            const dbAdapter = DBPersistanceFactory.createDBAdapterPersistance(config.DB.TYPE);
            return await executeDatabaseQuery(dbAdapter, async (conn) => {
                const result = await dbAdapter.executeQuery(conn,
                    "CALL get_members_report(?, ?, ?, ?)",
                    [start_date, end_date, venue_filter, class_filter] 
                );
                return result;
            });
    }
}