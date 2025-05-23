import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericRoutes,
         FindManyOptions,
         getUrlParam} from "@modules/index";
import WeeklyClassLeadDTO from "@modules/02_Synco/weeklyclasslead/dtos/WeeklyClassLeadDTO";
import { ILike, In, MoreThan } from "typeorm";
import WeeklyClassLeadController from "../controllers/WeeklyClassLeadController";

class WeeklyClassLeadRoutes extends GenericRoutes {
    
    private buildBaseFilters(): FindManyOptions {
        return {
            relations: ["lead_status",
                        "weekly_class",
                        "guardian",
                        "agent",
                        "booked_by",
                        "franchise"],
            where: {} 
        };
    }
    constructor() {
        super(new WeeklyClassLeadController(), "/weeklyClassesLeads");
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const filters = this.buildBaseFilters();
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassLeadDTO(req))
                                    .setMethod("getWeeklyClassLeadById")
                                    .isValidateRole("WEEKLY_CLASS_LEAD")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassLeadDTO(req))
                                    .setMethod("getWeeklyClassLeads")
                                    .isValidateRole("WEEKLY_CLASS_LEAD")
                                    .isLogicalDelete()
                                    .setFilters(this.getAllFilters(req))
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.weekly_class_id,
                req.body.lead_status_code,
                req.body.guardian_id
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassLeadDTO(req))
                                    .setMethod("insertWeeklyClassLead")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("WEEKLY_CLASS_LEAD")
                                    .build();
        
            this.getController().insert(requestHandler);
        });

        this.router.post(`${this.getRouterName()}/add_front`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.weekly_class_id,
                req.body.lead_status_code,
                req.body.guardians,
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassLeadDTO(req))
                                    .setMethod("add_frontWeeklyClassLead")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("WEEKLY_CLASS_LEAD")
                                    
                                    .build();
        
            (this.getController() as WeeklyClassLeadController).insertDynamic(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassLeadDTO(req))
                                    .setMethod("updateWeeklyClassLead")
                                    .isValidateRole("WEEKLY_CLASS_LEAD")
                                    .build();
        
            this.getController().update(requestHandler);
        });

        this.router.put(`${this.getRouterName()}/assignAgent`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassLeadDTO(req))
                                    .setMethod("assignAgentWeeklyClassLead")
                                    .isValidateRole("WEEKLY_CLASS_LEAD")
                                    .isRequireIdFromQueryParams(false)
                                    .build();
            
            (this.getController() as WeeklyClassLeadController).assignAgent(requestHandler);
        });

        this.router.put(`${this.getRouterName()}/changeStatus`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassLeadDTO(req))
                                    .setMethod("changeStatusWeeklyClassLead")
                                    .isValidateRole("WEEKLY_CLASS_LEAD")
                                    .isRequireIdFromQueryParams(false)
                                    .build();
        
            (this.getController() as WeeklyClassLeadController).changeStatus(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassLeadDTO(req))
                                    .setMethod("deleteWeeklyClassLead")
                                    .isValidateRole("WEEKLY_CLASS_LEAD")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }


    private getAllFilters(req: Request){
        const filters = this.buildBaseFilters();

        const start_date: string | null = getUrlParam("start_date", req) || null;
        const end_date: string | null = getUrlParam("end_date", req) || null;

        //this can join by comma
        const venue_id: string | null = getUrlParam("venue_id", req) || null;
        const venue: string | null = getUrlParam("venue", req) || null;
        const student_id: string | null = getUrlParam("student_id", req) || null;
        const student: string | null = getUrlParam("student", req) || null;

        const referral_source_code: string | null = getUrlParam("referral_source_code", req) || null;
        const lead_status_code: string | null = getUrlParam("lead_status_code", req) || null;

        if (start_date != null) {
            filters.where = { 
                ...filters.where, 
                weekly_class: {
                    start_date: MoreThan(start_date) 
                }
            };
        }

        if (end_date != null) {
            filters.where = { 
                ...filters.where, 
                weekly_class: {
                    end_date: MoreThan(end_date) 
                } 
            };
        }

        if(referral_source_code != null){
            const referralSourceArray = referral_source_code!!.split(",")
                                  .map(field => field.trim())
                                  .filter(field => field); 

            if (referralSourceArray.length > 0) {
                filters.where = { 
                    ...filters.where, 
                    guardian: {
                        referral_source: In(referralSourceArray), 
                    }
                };
            }
        }

        if(lead_status_code != null){
            const leadStatusArray = lead_status_code!!.split(",")
                                  .map(field => field.trim())
                                  .filter(field => field); 

            if (leadStatusArray.length > 0) {
                filters.where = { 
                    ...filters.where, 
                    lead_status: In(leadStatusArray), 
                };
            }
        }

        if(venue_id != null){
            const venueIdsArray = venue_id!!.split(",")
                                  .map(field => field.trim())
                                  .filter(field => field); 

            if (venueIdsArray.length > 0) {
                filters.where = { 
                    ...filters.where, 
                    weekly_class: {
                        venue: In(venueIdsArray), 
                    }
                };
            }
        }

        if (venue != null) {
            filters.where = { 
                ...filters.where, 
                weekly_class: { 
                    venue:{
                        name:ILike(`%${venue}%`)
                    } 
                }
            };
        }

        /*if(student_id != null){
            const studentIdsArray = student_id!!.split(",")
                                  .map(field => field.trim())
                                  .filter(field => field); 

            if (studentIdsArray.length > 0) {
                filters.where = { 
                    ...filters.where, 
                    student: {
                        id: In(studentIdsArray), 
                    }
                };
            }
        }

        if (student != null) {
            filters.where = { 
                ...filters.where, 
                student: { 
                    name: ILike(`%${student}%`)
                }
            };
        }*/

            return filters;
    }
}

export default WeeklyClassLeadRoutes;
