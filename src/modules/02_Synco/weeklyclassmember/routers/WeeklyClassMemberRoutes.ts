import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions,
         getUrlParam} from "@modules/index";
import { WeeklyClassMember } from "@index/entity/WeeklyClassMember";
import WeeklyClassMemberDTO from "@modules/02_Synco/weeklyclassmember/dtos/WeeklyClassMemberDTO";
import { ILike, In, LessThan, MoreThan } from "typeorm";
import WeeklyClassMemberController from "../controllers/WeeklyClassMemberController";

class WeeklyClassMemberRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new WeeklyClassMemberController(), "/weeklyClassesMembers");
        this.filters.relations = [
                                    "weekly_class",
                                    "subscription_plan_price",
                                    "member_status",
                                    "student",
                                    "agent",
                                    "booked_by",
                                    "franchise",
                                    "student.family"];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassMemberDTO(req))
                                    .setMethod("getWeeklyClassMemberById")
                                    .isValidateRole("WEEKLY_CLASS_MEMBER")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
            
            this.getAllFilters(req);
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassMemberDTO(req))
                                    .setMethod("getWeeklyClassMembers")
                                    .isValidateRole("WEEKLY_CLASS_MEMBER")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });

        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.weekly_class_id,
                req.body.subscription_plan_price_id,
                req.body.member_status_code,
                req.body.student_id,
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassMemberDTO(req))
                                    .setMethod("insertWeeklyClassMember")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("WEEKLY_CLASS_MEMBER")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassMemberDTO(req))
                                    .setMethod("updateWeeklyClassMember")
                                    .isValidateRole("WEEKLY_CLASS_MEMBER")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassMemberDTO(req))
                                    .setMethod("deleteWeeklyClassMember")
                                    .isValidateRole("WEEKLY_CLASS_MEMBER")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });

        this.router.put(`${this.getRouterName()}/changeStatus`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassMemberDTO(req))
                                    .setMethod("changeStatusWeeklyClassMember")
                                    .isValidateRole("WEEKLY_CLASS_MEMBER")
                                    .isRequireIdFromQueryParams(false)
                                    .build();
        
            (this.getController() as WeeklyClassMemberController).changeStatus(requestHandler);
        });




        /* ****************************
                    REPORTING
        *******************************/
        this.router.get(`${this.getRouterName()}/reporting`, 
                        async (req: Request, res: Response) => {
            
            this.getAllFilters(req);
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassMemberDTO(req))
                                    .setMethod("getWeeklyClassMembers")
                                    .isValidateRole("WEEKLY_CLASS_MEMBER")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            (this.getController() as WeeklyClassMemberController)
                            .generateWeeklyReport(requestHandler);
        });
    }

    private getAllFilters(req: Request){
        this.filters.where = { };

        const start_date: string | null = getUrlParam("start_date", req) || null;
        const end_date: string | null = getUrlParam("end_date", req) || null;

        //this can join by comma
        const venue_id: string | null = getUrlParam("venue_id", req) || null;
        const venue: string | null = getUrlParam("venue", req) || null;
        const member_status_code: string | null = getUrlParam("member_status_code", req) || null;
        const student_id: string | null = getUrlParam("student_id", req) || null;
        const student: string | null = getUrlParam("student", req) || null;

        if (start_date != null) {
            this.filters.where = { 
                ...this.filters.where, 
                start_date: MoreThan(start_date) 
            };
        }

        if (end_date != null) {
            this.filters.where = { 
                ...this.filters.where, 
                end_date: LessThan(end_date) 
            };
        }

        if(member_status_code != null){
            const memberStatusArray = member_status_code!!.split(",")
                                  .map(field => field.trim())
                                  .filter(field => field); 

            if (memberStatusArray.length > 0) {
                this.filters.where = { 
                    ...this.filters.where, 
                    member_status_code: In(memberStatusArray), 
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
                    weekly_class_id: {
                        venue_id: In(venueIdsArray), 
                    }
                };
            }
        }

        if (venue != null) {
            this.filters.where = { 
                ...this.filters.where, 
                venue_id: { 
                    name: ILike(`%${venue}%`)
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
                    student_id: {
                        id: In(studentIdsArray), 
                    }
                };
            }
        }

        if (student != null) {
            this.filters.where = { 
                ...this.filters.where, 
                student_id: { 
                    name: ILike(`%${student}%`)
                }
            };
        }
    }
}

export default WeeklyClassMemberRoutes;
