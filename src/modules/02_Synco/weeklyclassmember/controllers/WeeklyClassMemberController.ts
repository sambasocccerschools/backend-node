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
import { AccountInformationComment } from "@index/entity/AccountInformationComment";

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
             
                //Insert New Family
                let family = new Family();
                family.franchise = body.franchise;
                family = await familyRepository.add(family);

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


    private formatPercentage(value: number): string {
        return `${(value * 100).toFixed(2)}%`;
    }


    async generateWeeklyReport(reqHandler: RequestHandler): Promise<any> {

        return this.getService().getAllService(reqHandler, 
            async (jwtData : JWTObject, httpExec: HttpAction, page: number, size: number) => {
    
            try {
            
                const reportTimeframe = 7;
                const now = new Date();
                const timeThreshold = new Date(now.getTime() - reportTimeframe * 24 * 60 * 60 * 1000);
        
                const allMembers =  await this.getRepository().findAll(
                                    reqHandler.getLogicalDelete(), 
                                    reqHandler.getFilters(),
                                    1, 10000
                                    );
        
                if (allMembers == null || !allMembers.length) {
                    return httpExec.dynamicError(
                        ConstStatusJson.NOT_FOUND,
                        ConstMessagesJson.DONT_EXISTS
                    );
                }
               
                const totalMembers = allMembers.length;
                const previousMembers = allMembers.filter(
                    (member) => new Date(member.created_date).getTime() < timeThreshold.getTime()
                );
                const totalPreviousMembers = previousMembers.length;
        
                const totalMemberIncrease = totalPreviousMembers
                    ? ((totalMembers - totalPreviousMembers) / totalPreviousMembers) * 100
                    : 100;
        
                const activeMembers = allMembers.filter((member) => {
                    return (
                        !['PAY_PENDING_MS', 'FROZEN_MS', 'CANCELLED_MS'].includes(member.member_status_code.code) 
                    );
                });
        
                const totalActiveMembers = activeMembers.length;
                const totalRevenue = activeMembers.reduce((transactionSum: number, member) => {
                    return (
                        transactionSum +
                        (member.payment?.paymentTransactions.reduce(
                            (txnSum: number, txn: { price: number }) => txnSum + txn.price, 0
                        ) || 0)
                    );
                }, 0);
        
                const monthlyRevenue = totalRevenue / 12;
                const averageMonthlyFee = totalActiveMembers
                    ? monthlyRevenue / totalActiveMembers
                    : 0;
        
             
                const previousActiveMembers = activeMembers.filter(
                    (member) => new Date(member.created_at).getTime() < timeThreshold.getTime()
                );
                const totalPreviousActiveMembers = previousActiveMembers.length;
        
                let revenueIncrease = 100;
                let avgMonthlyRevenueIncrease = 100;
        
                if (totalPreviousActiveMembers > 0) {
                    const previousRevenue = previousActiveMembers.reduce((transactionSum: number, member) => {
                        return (
                            transactionSum +
                            (member.payment?.paymentTransactions.reduce(
                                (txnSum: number, txn: { price: number }) => txnSum + txn.price, 0
                            ) || 0)
                        );
                    }, 0);
        
                    const previousMonthlyRevenue = previousRevenue / 12;
                    const previousAverageFee = previousMonthlyRevenue / totalPreviousActiveMembers;
        
                    if (previousRevenue > 0) {
                        revenueIncrease =
                            ((totalRevenue - previousRevenue) / previousRevenue) * 100;
                    }
        
                    if (previousAverageFee > 0) {
                        avgMonthlyRevenueIncrease =
                            ((averageMonthlyFee - previousAverageFee) / previousAverageFee) * 100;
                    }
                }
        
           
                const payload = {
                    total_students: {
                        amount: totalMembers,
                        percentage: this.formatPercentage(totalMemberIncrease),
                    },
                    monthly_revenue: {
                        amount: totalRevenue.toFixed(2),
                        percentage: this.formatPercentage(revenueIncrease),
                    },
                    average_monthly_fee: {
                        amount: averageMonthlyFee.toFixed(2),
                        percentage: this.formatPercentage(avgMonthlyRevenueIncrease),
                    },
                };
        
                return httpExec.successAction(payload, ConstHTTPRequest.GET_ALL_SUCCESS);
            } catch (error: any) {
                return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
            }
    
        });
    }
    

   
}
    
    

