import { Request, Response, 
    RequestHandler, RequestHandlerBuilder, 
    GenericRoutes,
    FindManyOptions,
    getUrlParam} from "@modules/index";
import WeeklyClassFindClassDTO from "@modules/02_Synco/weeklyClassesFindClass/dtos/WeeklyClassFindClassDTO";
import { ILike, In } from "typeorm";
import WeeklyClassFindClassController from "../controllers/WeeklyClassFindClassController";

class WeeklyClassFindClassRoutes extends GenericRoutes {

private filters: FindManyOptions = {};
    constructor() {
    super(new WeeklyClassFindClassController(), "/allWeeklyClasses");
    this.filters.relations = ["region","franchise"];
    }

    protected initializeRoutes() {
    
    
        this.router.get(`${this.getRouterName()}/find_a_class`, async (req: Request, res: Response) => {
            this.filters.where = { };

            const venue: string | null = getUrlParam("venue", req) || null;
            const postcode: string | null = getUrlParam("postcode", req) || null;
            const lat: string | null = getUrlParam("lat", req) || null;
            const lng: string | null = getUrlParam("lng", req) || null;
            

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

            if (venue != null) {
                this.filters.where = { 
                    ...this.filters.where, 
                    name:  ILike(`%${venue}%`)
                };
            }

            if(venue_id != null){
                const venueIdsArray = venue_id!!.split(",")
                                      .map(field => field.trim())
                                      .filter(field => field); 

                if (venueIdsArray.length > 0) {
                    this.filters.where = { 
                        ...this.filters.where, 
                        id: In(venueIdsArray), 
                    };
                }
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
                                    .setAdapter(new WeeklyClassFindClassDTO(req))
                                    .setMethod("getWeeklyClasss")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
    
    
    }
}

export default WeeklyClassFindClassRoutes;
