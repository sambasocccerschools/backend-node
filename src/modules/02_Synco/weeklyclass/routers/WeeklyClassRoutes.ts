import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions,
         getUrlParam} from "@modules/index";
import { WeeklyClass } from "@index/entity/WeeklyClass";
import WeeklyClassDTO from "@modules/02_Synco/weeklyclass/dtos/WeeklyClassDTO";
import { ILike, In } from "typeorm";

class WeeklyClassRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(WeeklyClass), "/weeklyClasses");
        this.filters.relations = ["venue","autumn_term","spring_term","summer_term","franchise"];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassDTO(req))
                                    .setMethod("getWeeklyClassById")
                                    .isValidateRole("WEEKLY_CLASS")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
            this.filters.where = { };
            
            const venue: string | null = getUrlParam("venue", req) || null;
            const postcode: string | null = getUrlParam("postcode", req) || null;

            //this can join by comma
            const venue_id: string | null = getUrlParam("venue_id", req) || null;
            const days: string | null = getUrlParam("days", req) || null;
            const class_name: string | null = getUrlParam("class_name", req) || null;

            if(postcode != null){
                this.filters.where = { 
                    ...this.filters.where, 
                    franchise: {
                        postal_code: postcode, 
                    }
                };
            }

            if(venue_id != null){
                const venueIdsArray = venue_id!!.split(",")
                                      .map(field => field.trim())
                                      .filter(field => field); 

                if (venueIdsArray.length > 0) {
                    this.filters.where = { 
                        ...this.filters.where, 
                        venue: {
                            id: In(venueIdsArray), 
                        }
                    };
                }
            }

            if (venue != null) {
                this.filters.where = { 
                    ...this.filters.where, 
                    venue: { 
                        name: ILike(`%${venue}%`)
                    }
                };
            }

            if(days != null){
                const daysArray = days!!.split(",")
                                 .map(field => field.trim())
                                 .filter(field => field); 

                if (daysArray.length > 0) {
                    this.filters.where = { 
                        ...this.filters.where, 
                        days: In(daysArray), 
                    };
                }
            }

            if(class_name != null){
                const classesArray = class_name!!.split(",")
                                 .map(field => field.trim())
                                 .filter(field => field); 

                if (classesArray.length > 0) {
                    this.filters.where = { 
                        ...this.filters.where, 
                        name: In(classesArray), 
                    };
                }
            }
           
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassDTO(req))
                                    .setMethod("getWeeklyClasss")
                                    .isValidateRole("WEEKLY_CLASS")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.venue_id,
                req.body.name,
                req.body.capacity,
                req.body.days,
                req.body.start_time,
                req.body.end_time,
                req.body.autumn_term_id,
                req.body.spring_term_id,
                req.body.summer_term_id
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassDTO(req))
                                    .setMethod("insertWeeklyClass")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("WEEKLY_CLASS")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassDTO(req))
                                    .setMethod("updateWeeklyClass")
                                    .isValidateRole("WEEKLY_CLASS")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassDTO(req))
                                    .setMethod("deleteWeeklyClass")
                                    .isValidateRole("WEEKLY_CLASS")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default WeeklyClassRoutes;
