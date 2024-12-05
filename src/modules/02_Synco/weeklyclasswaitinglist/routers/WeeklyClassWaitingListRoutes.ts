import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions,
         getUrlParam} from "@modules/index";
import { WeeklyClassWaitingList } from "@index/entity/WeeklyClassWaitingList";
import WeeklyClassWaitingListDTO from "@modules/02_Synco/weeklyclasswaitinglist/dtos/WeeklyClassWaitingListDTO";
import { ILike, In, LessThan, MoreThan } from "typeorm";

class WeeklyClassWaitingListRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(WeeklyClassWaitingList), "/weeklyClassesWaitingLists");
        this.filters.relations = [
            "weekly_class",
            "subscription_plan_price",
            "waiting_list_status",
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
                                    .setAdapter(new WeeklyClassWaitingListDTO(req))
                                    .setMethod("getWeeklyClassWaitingListById")
                                    .isValidateRole("WEEKLY_CLASS_WAITING_LIST")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            this.getAllFilters(req);
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassWaitingListDTO(req))
                                    .setMethod("getWeeklyClassWaitingLists")
                                    .isValidateRole("WEEKLY_CLASS_WAITING_LIST")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.weekly_class_id,
                req.body.waiting_list_status_code,
                req.body.student_id,
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassWaitingListDTO(req))
                                    .setMethod("insertWeeklyClassWaitingList")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("WEEKLY_CLASS_WAITING_LIST")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassWaitingListDTO(req))
                                    .setMethod("updateWeeklyClassWaitingList")
                                    .isValidateRole("WEEKLY_CLASS_WAITING_LIST")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassWaitingListDTO(req))
                                    .setMethod("deleteWeeklyClassWaitingList")
                                    .isValidateRole("WEEKLY_CLASS_WAITING_LIST")
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
        const waiting_list_status_code: string | null = getUrlParam("waiting_list_status_code", req) || null;
        const venue_id: string | null = getUrlParam("venue_id", req) || null;
        const student_id: string | null = getUrlParam("student_id", req) || null;
        const venue: string | null = getUrlParam("venue", req) || null;
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

        if(waiting_list_status_code != null){
            const waitingListStatusArray = waiting_list_status_code!!.split(",")
                                  .map(field => field.trim())
                                  .filter(field => field); 

            if (waitingListStatusArray.length > 0) {
                this.filters.where = { 
                    ...this.filters.where, 
                    waiting_list_status_code: In(waitingListStatusArray), 
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
                weekly_class_id: {
                    venue_id: {
                        name: ILike(`%${venue}%`)
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

export default WeeklyClassWaitingListRoutes;
