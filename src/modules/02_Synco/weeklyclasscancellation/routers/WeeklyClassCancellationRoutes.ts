import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericRoutes,
         FindManyOptions,
         getUrlParam,
         JWTObject} from "@modules/index";
import WeeklyClassCancellationDTO from "@modules/02_Synco/weeklyclasscancellation/dtos/WeeklyClassCancellationDTO";
import WeeklyClassCancellationController from "../controllers/WeeklyClassCancellationController";
import { ILike, In, MoreThan } from "typeorm";

class WeeklyClassCancellationRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};

    constructor() {
        super(new WeeklyClassCancellationController(), "/weeklyClassesCancellations");
        this.filters.relations = [
            "weekly_class_member",
            "weekly_class_member.weekly_class",
            "weekly_class_member.weekly_class.venue",
            "weekly_class_member.student",
            "member_cancel_type",
            "membership_cancel_reason",
            "member_cancel_status",
            "agent",
            "cancelled_by",
            "franchise"
        ];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassCancellationDTO(req))
                                    .setMethod("getWeeklyClassCancellationById")
                                    .isValidateRole("WEEKLY_CLASS_CANCELLATION")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
            this.getAllFilters(req);

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassCancellationDTO(req))
                                    .setMethod("getWeeklyClassCancellations")
                                    .isValidateRole("WEEKLY_CLASS_CANCELLATION")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.weekly_class_member,
                req.body.member_cancel_type,
                req.body.membership_cancel_reason,
                req.body.member_cancel_status,
                req.body.termination_date
            ];

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassCancellationDTO(req))
                                    .setMethod("insertWeeklyClassCancellation")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("WEEKLY_CLASS_CANCELLATION")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassCancellationDTO(req))
                                    .setMethod("updateWeeklyClassCancellation")
                                    .isValidateRole("WEEKLY_CLASS_CANCELLATION")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassCancellationDTO(req))
                                    .setMethod("deleteWeeklyClassCancellation")
                                    .isValidateRole("WEEKLY_CLASS_CANCELLATION")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });

        this.router.put(`${this.getRouterName()}/assignAgent`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                        new RequestHandlerBuilder(res, req)
                        .setAdapter(new WeeklyClassCancellationDTO(req))
                        .setMethod("assignAgentWeeklyClassCancellation")
                        .isValidateRole("WEEKLY_CLASS_CANCELLATION")
                        .isRequireIdFromQueryParams(false)
                        .build();
            
            (this.getController() as WeeklyClassCancellationController).assignAgent(requestHandler);
        });

     
        this.router.put(`${this.getRouterName()}/changeStatus`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                        new RequestHandlerBuilder(res, req)
                        .setAdapter(new WeeklyClassCancellationDTO(req))
                        .setMethod("changeStatusWeeklyClassCancellation")
                        .isValidateRole("WEEKLY_CLASS_CANCELLATION")
                        .isRequireIdFromQueryParams(false)
                        .build();
            
            (this.getController() as WeeklyClassCancellationController).changeStatus(requestHandler);
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

        const member_cancel_type_code: string | null = getUrlParam("member_cancel_type_code", req) || null;
        const member_cancel_status_code: string | null = getUrlParam("member_cancel_status_code", req) || null;

        if (start_date != null) {
            this.filters.where = { 
                ...this.filters.where, 
                    termination_date: MoreThan(start_date) 
            };
        }

        if (end_date != null) {
            this.filters.where = { 
                ...this.filters.where, 
                    termination_date: MoreThan(end_date) 
            };
        }

        if(member_cancel_type_code != null){
            const memberCancelTypeArray = member_cancel_type_code!!.split(",")
                                    .map(field => field.trim())
                                    .filter(field => field); 

            if (memberCancelTypeArray.length > 0) {
                this.filters.where = { 
                    ...this.filters.where, 
                    member_cancel_type: {
                        code: In(memberCancelTypeArray), 
                    }
                };
            }
        }

        if(member_cancel_status_code != null){
            const memberCancelStatusArray = member_cancel_status_code!!.split(",")
                                    .map(field => field.trim())
                                    .filter(field => field); 

            if (memberCancelStatusArray.length > 0) {
                this.filters.where = { 
                    ...this.filters.where, 
                    member_cancel_status: {
                        code: In(memberCancelStatusArray), 
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
                        weekly_class_member:{
                            weekly_class: { 
                                venue: In(venueIdsArray), 
                            }
                        }
                    };
                }
            }
    
            if (venue != null) {
                this.filters.where = { 
                    ...this.filters.where, 
                    weekly_class_member:{
                        weekly_class: { 
                            venue:{
                                name:ILike(`%${venue}%`)
                            } 
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
                        weekly_class_member:{
                            student: {
                                id: In(studentIdsArray), 
                            }
                        }
                    };
                }
            }
    
            if (student != null) {
                this.filters.where = { 
                    ...this.filters.where,
                    weekly_class_member:{
                        student: [
                            { first_name: ILike(`%${student}%`) }, 
                            { last_name: ILike(`%${student}%`) },  
                        ],
                    }
                };
            }
    }
}

export default WeeklyClassCancellationRoutes;
