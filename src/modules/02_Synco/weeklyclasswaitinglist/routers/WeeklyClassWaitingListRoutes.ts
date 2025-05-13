import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericRoutes,
         FindManyOptions,
         getUrlParam} from "@modules/index";
import WeeklyClassWaitingListDTO from "@modules/02_Synco/weeklyclasswaitinglist/dtos/WeeklyClassWaitingListDTO";
import { ILike, In, LessThan, MoreThan } from "typeorm";
import WeeklyClassWaitingListController from "../controllers/WeeklyClassWaitingListController";

class WeeklyClassWaitingListRoutes extends GenericRoutes {
    
    private buildBaseFilters(): FindManyOptions {
        return {
            relations: [ "weekly_class",
                        "subscription_plan_price",
                        "waiting_list_status",
                        "student",
                        "agent",
                        "booked_by",
                        "franchise",
                        "student.family"],
            where: {} 
        };
    }
    constructor() {
        super(new WeeklyClassWaitingListController(), "/weeklyClassesWaitingLists");
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const filters = this.buildBaseFilters();
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassWaitingListDTO(req))
                                    .setMethod("getWeeklyClassWaitingListById")
                                    .isValidateRole("WEEKLY_CLASS_WAITING_LIST")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassWaitingListDTO(req))
                                    .setMethod("getWeeklyClassWaitingLists")
                                    .isValidateRole("WEEKLY_CLASS_WAITING_LIST")
                                    .isLogicalDelete()
                                    .setFilters(this.getAllFilters(req))
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

        this.router.post(`${this.getRouterName()}/add_front`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.weekly_class_id,
                req.body.waiting_list_status_code,
                req.body.students,
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassWaitingListDTO(req))
                                    .setMethod("add_frontWeeklyClassWaitingList")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("WEEKLY_CLASS_WAITING_LIST")
                                    .build();

            (this.getController() as WeeklyClassWaitingListController).insertDynamic(requestHandler);
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

        this.router.put(`${this.getRouterName()}/assignAgent`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassWaitingListDTO(req))
                                    .setMethod("assignAgentWeeklyClassWaitingList")
                                    .isValidateRole("WEEKLY_CLASS_WAITING_LIST")
                                    .isRequireIdFromQueryParams(false)
                                    .build();
            
            (this.getController() as WeeklyClassWaitingListController).assignAgent(requestHandler);
        });

        this.router.put(`${this.getRouterName()}/changeStatus`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassWaitingListDTO(req))
                                    .setMethod("changeStatusWeeklyClassWaitingList")
                                    .isValidateRole("WEEKLY_CLASS_WAITING_LIST")
                                    .isRequireIdFromQueryParams(false)
                                    .build();
        
            (this.getController() as WeeklyClassWaitingListController).changeStatus(requestHandler);
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
        const filters = this.buildBaseFilters();

        const start_date: string | null = getUrlParam("start_date", req) || null;
        const end_date: string | null = getUrlParam("end_date", req) || null;

        //this can join by comma
        const waiting_list_status_code: string | null = getUrlParam("waiting_list_status_code", req) || null;
        const venue_id: string | null = getUrlParam("venue_id", req) || null;
        const student_id: string | null = getUrlParam("student_id", req) || null;
        const venue: string | null = getUrlParam("venue", req) || null;
        const student: string | null = getUrlParam("student", req) || null;

        if (start_date != null) {
            filters.where = { 
                ...filters.where, 
                start_date: MoreThan(start_date) 
            };
        }

        if (end_date != null) {
            filters.where = { 
                ...filters.where, 
                end_date: LessThan(end_date) 
            };
        }

        if(waiting_list_status_code != null){
            const waitingListStatusArray = waiting_list_status_code!!.split(",")
                                  .map(field => field.trim())
                                  .filter(field => field); 

            if (waitingListStatusArray.length > 0) {
                filters.where = { 
                    ...filters.where, 
                    waiting_list_status: In(waitingListStatusArray), 
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
                    venue: {
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
                student: [
                    { first_name: ILike(`%${student}%`) }, // Busca coincidencias en first_name
                    { last_name: ILike(`%${student}%`) },  // Busca coincidencias en last_name
                ],
            };
        }

        return filters;
    }
}

export default WeeklyClassWaitingListRoutes;
