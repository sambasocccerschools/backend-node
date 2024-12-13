import { HttpAction, Validations } from "@index/index";
import { GenericController, RequestHandler, JWTObject, getUrlParam, GenericRepository, FindManyOptions } from "@modules/index";
import { User, UserRepository } from '@index/modules/01_General/email/index';
import { getEmailTemplate } from "@TenshiJS/utils/htmlTemplateUtils";
import {  ConstHTTPRequest, ConstStatusJson,  ConstMessagesJson, ConstFunctions } from "@TenshiJS/consts/Const";
import EmailService from "@TenshiJS/services/EmailServices/EmailService";
import { ConstTemplate } from "@index/consts/Const";
import { WeeklyClassMember } from "@index/entity/WeeklyClassMember";
import { In } from "typeorm";
import { WeeklyClassSale } from "@index/entity/WeeklyClassSale";
import { Guardian } from "@index/entity/Guardian";
import { WeeklyClassLead } from "@index/entity/WeeklyClassLead";

export default  class EmailController extends GenericController{

    constructor() {
        super(User, new UserRepository);
    }

    /**
     * Sends an email to a user based on the provided email address.
     * 
     * @param {RequestHandler} reqHandler - The request handler object.
     * @returns {Promise<any>} A promise that resolves with the result of the email sending operation.
     */
    async sendMailController(reqHandler: RequestHandler) : Promise<any> {

        return this.getService().insertService(reqHandler, async (jwtData, httpExec) => {
       
            // Get the email structure from the request body
            const emailStructure  = {
                email: reqHandler.getRequest().body.email,
                subject: reqHandler.getRequest().body.subject,
                body: reqHandler.getRequest().body.body_message
            }

            try {
                // Get the user based on the email address
                const user = await (this.getRepository() as UserRepository).getUserByEmailParam(emailStructure.email);

                if (user != undefined && user != null) {
                    // Prepare the email variables
                    const variables = {
                        userName: user.first_name + " " + user.last_name,
                        emailSubject: emailStructure.subject,
                        emailContent: emailStructure.body
                    };

                    // Generate the HTML body of the email using the email template
                    const htmlBody = await getEmailTemplate(ConstTemplate.GENERIC_TEMPLATE_EMAIL, user.language, variables);

                    // Send the email to the user
                    const emailService = EmailService.getInstance();
                    await emailService.sendEmail({
                        toMail: user.email,
                        subject: emailStructure.subject,
                        message: htmlBody,
                        attachments: [] 
                    });

                    // Return success response
                    return httpExec.successAction(null, ConstHTTPRequest.SEND_MAIL_SUCCESS);
                } else {
                    // Return error response if the user does not exist
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.EMAIL_NOT_EXISTS_ERROR);
                }
            } catch (error : any) {
                // Return general error response if any exception occurs
                return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
            }
        } );
    }


    /**
     * Sends an email to users based on specified filters.
     * 
     * @param {RequestHandler} reqHandler - The request handler object.
     * @return {Promise<any>} - A promise that resolves to the response object.
     */
    async sendMailByFilters(reqHandler: RequestHandler): Promise<any> {
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
            const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;

            // Validate role
            if(await this.validateRole(reqHandler,  jwtData.role, ConstFunctions.CREATE, httpExec) !== true){ 
                return; 
            }
         
            // Prepare email structure
            const emailStructure  = {
                subject: reqHandler.getRequest().body.subject,
                body: reqHandler.getRequest().body.body_message
            }

            try{
                // Get users based on filters
                const users : User[] | null = await (this.getRepository() as UserRepository).findAll(reqHandler.getLogicalDelete(),  reqHandler.getFilters()!);

                if(users != undefined && users != null){
                    // Iterate over each user and send email
                    users.forEach(async (user) => {
                        const variables = {
                            userName: user.first_name + " " + user.last_name,
                            emailSubject: emailStructure.subject,
                            emailContent: emailStructure.body
                        };
                        const htmlBody = await getEmailTemplate(ConstTemplate.GENERIC_TEMPLATE_EMAIL, user.language, variables);
                        const emailService = EmailService.getInstance();
                        await emailService.sendEmail({
                            toMail: user.email,
                            subject: emailStructure.subject,
                            message: htmlBody,
                            attachments: [] 
                        });
    
                    });

                }else{
                    // Return error response if no users found
                    return await httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.THERE_ARE_NOT_INFO);
                }

                // Return success response
                return httpExec.successAction(null, ConstHTTPRequest.SEND_MAIL_SUCCESS);

            }catch(error : any){
                // Return general error response if any exception occurs
                return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
            }
        }catch(error : any){
            // Return general error response if any exception occurs
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
        }
    }








     /**
     *              WEEKLY MEMBERS
     */
     async sendMailByWeeklyMembers(reqHandler: RequestHandler): Promise<any> {
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
            const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;

            // Validate role
            if(await this.validateRole(reqHandler,  jwtData.role, ConstFunctions.CREATE, httpExec) !== true){ 
                return; 
            }

             // Get the filter parameters from the URL
             const weekly_members_ids: string | null = 
                                            getUrlParam("weekly_members_ids", 
                                            reqHandler.getRequest()) || null;

             if (!weekly_members_ids) {
                 return httpExec.paramsError();
             }
         
             // list ids
             const ids = (weekly_members_ids as string).split(',').map(id => id.trim());
             const validIds = ids.map(id => Number(id));

            // Prepare email structure
            const emailStructure  = {
                subject: reqHandler.getRequest().body.subject,
                body: reqHandler.getRequest().body.body_message
            }

            const options: FindManyOptions = {};
            if (validIds.length > 0) {
                options.where = { 
                    ...options.where, 
                    id: In(validIds) 
                };
            }

            options.relations = ["student","student.family"];
            const weeklyClassMemberRepository : GenericRepository = 
                                                await new GenericRepository(WeeklyClassMember);
            const members = await weeklyClassMemberRepository
                            .findAll(reqHandler.getLogicalDelete(), options);

            try{
                members?.forEach(async (member) =>{

                    if(member.student != null){
                        if(member.student.family != null){
                            const guardianRepository = await new GenericRepository(Guardian);
                            const guardians = await guardianRepository.findByOptions(true,true, {
                                where:{
                                    family:{
                                        id: member.student.family.id
                                    }
                                }
                            });

                            guardians?.forEach(async (guardian: Guardian) =>{
                                if(guardian != undefined && guardian != null){
                                    // Iterate over each user and send email
                                        const variables = {
                                            userName: guardian.first_name + " " + guardian.last_name,
                                            emailSubject: emailStructure.subject,
                                            emailContent: emailStructure.body
                                        };
        
                                        try{
                                            if(guardian.email != null){
                                                const htmlBody = await getEmailTemplate(ConstTemplate.GENERIC_TEMPLATE_EMAIL, "en", variables);
                                                const emailService = EmailService.getInstance();
                                                await emailService.sendEmail({
                                                    toMail: guardian.email,
                                                    subject: emailStructure.subject,
                                                    message: htmlBody,
                                                    attachments: [] 
                                                });
                                            }
                                        }catch(error : any){}
                                }else{
                                    // Return error response if no users found
                                    return await httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.THERE_ARE_NOT_INFO);
                                }
                            });
                        }
                    }
                    
                });

                // Return success response
                return httpExec.successAction(null, ConstHTTPRequest.SEND_MAIL_SUCCESS);

            }catch(error : any){
                // Return general error response if any exception occurs
                return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
            }
        }catch(error : any){
            // Return general error response if any exception occurs
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
        }
    }









    /**
     *              WEEKLY SALES
     */
     async sendMailByWeeklySales(reqHandler: RequestHandler): Promise<any> {
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
            const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;

            // Validate role
            if(await this.validateRole(reqHandler,  jwtData.role, ConstFunctions.CREATE, httpExec) !== true){ 
                return; 
            }

             // Get the filter parameters from the URL
             const weekly_classes_sale_ids: string | null = 
                                            getUrlParam("weekly_classes_sale_id", 
                                            reqHandler.getRequest()) || null;

             if (!weekly_classes_sale_ids) {
                 return httpExec.paramsError();
             }
         
             // list ids
             const ids = (weekly_classes_sale_ids as string).split(',').map(id => id.trim());
             const validIds = ids.map(id => Number(id));

            // Prepare email structure
            const emailStructure  = {
                subject: reqHandler.getRequest().body.subject,
                body: reqHandler.getRequest().body.body_message
            }

            const options: FindManyOptions = {};
            if (validIds.length > 0) {
                options.where = { 
                    ...options.where, 
                    id: In(validIds) 
                };
            }

            options.relations = ["student","student.family"];
            const weeklyClassSaleRepository : GenericRepository = 
                                                await new GenericRepository(WeeklyClassSale);
            const sales = await weeklyClassSaleRepository
                            .findAll(reqHandler.getLogicalDelete(), options);
            try{

                sales?.forEach(async (sale) =>{

                    if(sale.student != null){
                        if(sale.student.family != null){
                            const guardianRepository = await new GenericRepository(Guardian);
                            const guardians = await guardianRepository.findByOptions(true,true, {
                                where:{
                                    family:{
                                        id: sale.student.family.id
                                    }
                                }
                            });

                            guardians?.forEach(async (guardian: Guardian) =>{
                                if(guardian != undefined && guardian != null){
                                    // Iterate over each user and send email
                                        const variables = {
                                            userName: guardian.first_name + " " + guardian.last_name,
                                            emailSubject: emailStructure.subject,
                                            emailContent: emailStructure.body
                                        };
        
                                        try{
                                            if(guardian.email != null){
                                                const htmlBody = await getEmailTemplate(ConstTemplate.GENERIC_TEMPLATE_EMAIL, "en", variables);
                                                const emailService = EmailService.getInstance();
                                                await emailService.sendEmail({
                                                    toMail: guardian.email,
                                                    subject: emailStructure.subject,
                                                    message: htmlBody,
                                                    attachments: [] 
                                                });
                                            }
                                        }catch(error : any){}
                                }else{
                                    // Return error response if no users found
                                    return await httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.THERE_ARE_NOT_INFO);
                                }
                            });
                        }
                    }
                    
                });

                // Return success response
                return httpExec.successAction(null, ConstHTTPRequest.SEND_MAIL_SUCCESS);

            }catch(error : any){
                // Return general error response if any exception occurs
                return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
            }
        }catch(error : any){
            // Return general error response if any exception occurs
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
        }
    }




    /**
     *              WEEKLY Leads
     */
    async sendMailByWeeklyLeads(reqHandler: RequestHandler): Promise<any> {
        const httpExec : HttpAction = reqHandler.getResponse().locals.httpExec;

        try{
            const jwtData : JWTObject = reqHandler.getResponse().locals.jwtData;

            // Validate role
            if(await this.validateRole(reqHandler,  jwtData.role, ConstFunctions.CREATE, httpExec) !== true){ 
                return; 
            }

             // Get the filter parameters from the URL
             const weekly_classes_lead_ids: string | null = 
                                            getUrlParam("weekly_classes_lead_id", 
                                            reqHandler.getRequest()) || null;

             if (!weekly_classes_lead_ids) {
                 return httpExec.paramsError();
             }
         
             // list ids
             const ids = (weekly_classes_lead_ids as string).split(',').map(id => id.trim());
             const validIds = ids.map(id => Number(id));

            // Prepare email structure
            const emailStructure  = {
                subject: reqHandler.getRequest().body.subject,
                body: reqHandler.getRequest().body.body_message
            }

            const options: FindManyOptions = {};
            if (validIds.length > 0) {
                options.where = { 
                    ...options.where, 
                    id: In(validIds) 
                };
            }

            options.relations = ["guardian"];
            const weeklyClassLeadRepository : GenericRepository = 
                                                await new GenericRepository(WeeklyClassLead);
            const leads = await weeklyClassLeadRepository
                            .findAll(reqHandler.getLogicalDelete(), options);
            try{
                leads?.forEach(async (lead) =>{
                    if(lead.guardian != null){
                        const guardian = lead.guardian;
                        const variables = {
                            userName: guardian.first_name + " " + guardian.last_name,
                            emailSubject: emailStructure.subject,
                            emailContent: emailStructure.body
                        };

                        try{
                            const htmlBody = await getEmailTemplate(ConstTemplate.GENERIC_TEMPLATE_EMAIL, "en", variables);
                            const emailService = EmailService.getInstance();
                            await emailService.sendEmail({
                                toMail: guardian.email,
                                subject: emailStructure.subject,
                                message: htmlBody,
                                attachments: [] 
                            });
                        }catch(error : any){}
                    }
                });

                // Return success response
                return httpExec.successAction(null, ConstHTTPRequest.SEND_MAIL_SUCCESS);

            }catch(error : any){
                // Return general error response if any exception occurs
                return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
            }
        }catch(error : any){
            // Return general error response if any exception occurs
            return await httpExec.generalError(error, reqHandler.getMethod(), this.getControllerName());
        }
    }
}

