import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericRoutes,
         FindManyOptions,
         getUrlParam} from "@modules/index";
import WeeklyClassFreeTrialDTO from "@modules/02_Synco/weeklyclassfreetrial/dtos/WeeklyClassFreeTrialDTO";
import WeeklyClassFreeTrialController from "../controllers/WeeklyClassFreeTrialController";
import { ILike, In, MoreThan } from "typeorm";

class WeeklyClassFreeTrialRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new WeeklyClassFreeTrialController(), "/weeklyClassesFreeTrials");
        this.filters.relations = [
            "weekly_class",
            "free_trial_status",
            "student",
            "agent",
            "booked_by",
            "franchise"
        ];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassFreeTrialDTO(req))
                                    .setMethod("getWeeklyClassFreeTrialById")
                                    .isValidateRole("WEEKLY_CLASS_FREE_TRIAL")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
            this.getAllFilters(req);

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassFreeTrialDTO(req))
                                    .setMethod("getWeeklyClassFreeTrials")
                                    .isValidateRole("WEEKLY_CLASS_FREE_TRIAL")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.weekly_class_id,
                req.body.free_trial_status_code,
                req.body.student_id
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassFreeTrialDTO(req))
                                    .setMethod("insertWeeklyClassFreeTrial")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("WEEKLY_CLASS_FREE_TRIAL")
                                    .build();
        
            this.getController().insert(requestHandler);
        });


        this.router.post(`${this.getRouterName()}/add_front`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.weekly_class_id,
                req.body.free_trial_status_code,
                req.body.students
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassFreeTrialDTO(req))
                                    .setMethod("add_frontWeeklyClassFreeTrial")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("WEEKLY_CLASS_LEAD")
                                    .build();
        
            (this.getController() as WeeklyClassFreeTrialController).insertDynamic(requestHandler);
        });

        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassFreeTrialDTO(req))
                                    .setMethod("updateWeeklyClassFreeTrial")
                                    .isValidateRole("WEEKLY_CLASS_FREE_TRIAL")
                                    .build();
        
            this.getController().update(requestHandler);
        });

        this.router.put(`${this.getRouterName()}/assignAgent`, async (req: Request, res: Response) => {
                const requestHandler: RequestHandler = 
                            new RequestHandlerBuilder(res, req)
                            .setAdapter(new WeeklyClassFreeTrialDTO(req))
                            .setMethod("assignAgentWeeklyClassFreeTrial")
                            .isValidateRole("WEEKLY_CLASS_FREE_TRIAL")
                            .isRequireIdFromQueryParams(false)
                            .build();
                
                (this.getController() as WeeklyClassFreeTrialController).assignAgent(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/changeStatus`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                            new RequestHandlerBuilder(res, req)
                            .setAdapter(new WeeklyClassFreeTrialDTO(req))
                            .setMethod("changeStatusWeeklyClassFreeTrial")
                            .isValidateRole("WEEKLY_CLASS_FREE_TRIAL")
                            .isRequireIdFromQueryParams(false)
                            .build();
        
            (this.getController() as WeeklyClassFreeTrialController).changeStatus(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassFreeTrialDTO(req))
                                    .setMethod("deleteWeeklyClassFreeTrial")
                                    .isValidateRole("WEEKLY_CLASS_FREE_TRIAL")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }


       private getAllFilters(req: Request){
            this.filters.where = { };
    
            const start_date: string | null = getUrlParam("start_date", req) || null;
            const end_date: string | null = getUrlParam("end_date", req) || null;
    
            //this can join by comma
            const venue_id: string | null = getUrlParam("venue_id", req) || null;
            const venue: string | null = getUrlParam("venue", req) || null;
            const student_id: string | null = getUrlParam("student_id", req) || null;
            const student: string | null = getUrlParam("student", req) || null;
    
            const free_trial_status_code: string | null = getUrlParam("free_trial_status_code", req) || null;
    
            if (start_date != null) {
                this.filters.where = { 
                    ...this.filters.where, 
                    //weekly_class: {
                        trial_date: MoreThan(start_date) 
                    //}
                };
            }
    
            if (end_date != null) {
                this.filters.where = { 
                    ...this.filters.where, 
                    //weekly_class: {
                        trial_date: MoreThan(end_date) 
                    //} 
                };
            }
    
            if(free_trial_status_code != null){
                const freeTrialArray = free_trial_status_code!!.split(",")
                                      .map(field => field.trim())
                                      .filter(field => field); 
    
                if (freeTrialArray.length > 0) {
                    this.filters.where = { 
                        ...this.filters.where, 
                        free_trial_status: {
                            code: In(freeTrialArray), 
                        }
                    };
                }
            }
    
            if(venue_id != null){
                const venueIdsArray = venue_id!!.split(",")
                                      .map(field => field.trim())
                                      .filter(field => field); 
    
                if (venueIdsArray.length > 0) {
                    this.filters.where = { 
                        ...this.filters.where, 
                        weekly_class: {
                            venue: In(venueIdsArray), 
                        }
                    };
                }
            }
    
            if (venue != null) {
                this.filters.where = { 
                    ...this.filters.where, 
                    weekly_class: { 
                        venue:{
                            name:ILike(`%${venue}%`)
                        } 
                    }
                };
            }
    
            if(student_id != null){
                const studentIdsArray = student_id!!.split(",")
                                      .map(field => field.trim())
                                      .filter(field => field); 
    
                if (studentIdsArray.length > 0) {
                    this.filters.where = { 
                        ...this.filters.where, 
                        student: {
                            id: In(studentIdsArray), 
                        }
                    };
                }
            }
    
            if (student != null) {
                this.filters.where = { 
                    ...this.filters.where,
                    student: [
                        { first_name: ILike(`%${student}%`) }, 
                        { last_name: ILike(`%${student}%`) },  
                    ],
                };
            }
        }
}

export default WeeklyClassFreeTrialRoutes;
