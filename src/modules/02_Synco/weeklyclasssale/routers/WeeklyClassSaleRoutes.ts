import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericRoutes,
         FindManyOptions,
         getUrlParam,
         JWTObject} from "@modules/index";
import WeeklyClassSaleDTO from "@modules/02_Synco/weeklyclasssale/dtos/WeeklyClassSaleDTO";
import { ILike, In, LessThan, MoreThan } from "typeorm";
import WeeklyClassSaleController from "../controllers/WeeklyClassSaleController";

class WeeklyClassSaleRoutes extends GenericRoutes {
    
    private buildBaseFilters(): FindManyOptions {
        return {
            relations: [ "weekly_class_member",
                        "weekly_class",
                        "subscription_plan_price",
                        "sale_status",
                        "student",
                        "agent",
                        "booked_by",
                        "franchise"],
            where: {} 
        };
    }
    constructor() {
        super(new WeeklyClassSaleController(), "/weeklyClassesSales");
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const filters = this.buildBaseFilters();
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassSaleDTO(req))
                                    .setMethod("getWeeklyClassSaleById")
                                    .isValidateRole("WEEKLY_CLASS_SALE")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassSaleDTO(req))
                                    .setMethod("getWeeklyClassSales")
                                    .isValidateRole("WEEKLY_CLASS_SALE")
                                    .isLogicalDelete()
                                    .setFilters(this.getAllFilters(req))
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.weekly_class_member_id,
                req.body.weekly_class_id,
                req.body.subscription_plan_price_id,
                req.body.sale_status_code,
                req.body.student
            ];

            const jwtData : JWTObject = res.locals.jwtData;
           /* if(req.body.booked_by == null){
                req.body.booked_by = jwtData.id;
            }*/

            if(req.body.agent == null){
                req.body.agent = jwtData.id;
            }

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassSaleDTO(req))
                                    .setMethod("insertWeeklyClassSale")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("WEEKLY_CLASS_SALE")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassSaleDTO(req))
                                    .setMethod("updateWeeklyClassSale")
                                    .isValidateRole("WEEKLY_CLASS_SALE")
                                    .build();
        
            this.getController().update(requestHandler);
        });

        this.router.put(`${this.getRouterName()}/changeStatus`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassSaleDTO(req))
                                    .setMethod("changeStatusWeeklyClassSale")
                                    .isValidateRole("WEEKLY_CLASS_SALE")
                                    .isRequireIdFromQueryParams(false)
                                    .build();
        
            (this.getController() as WeeklyClassSaleController).changeStatus(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassSaleDTO(req))
                                    .setMethod("deleteWeeklyClassSale")
                                    .isValidateRole("WEEKLY_CLASS_SALE")
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
        const sale_status_code: string | null = getUrlParam("sale_status_code", req) || null;
        const venue_id: string | null = getUrlParam("venue_id", req) || null;
        const venue: string | null = getUrlParam("venue", req) || null;
        const student_id: string | null = getUrlParam("student_id", req) || null;
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

        if(sale_status_code != null){
            const saleStatusArray = sale_status_code!!.split(",")
                                  .map(field => field.trim())
                                  .filter(field => field); 

            if (saleStatusArray.length > 0) {
                filters.where = { 
                    ...filters.where, 
                    sale_status: In(saleStatusArray), 
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
                    { first_name: ILike(`%${student}%`) }, 
                    { last_name: ILike(`%${student}%`) },  
                ],
            };
        }

        return filters;
    }
}

export default WeeklyClassSaleRoutes;
