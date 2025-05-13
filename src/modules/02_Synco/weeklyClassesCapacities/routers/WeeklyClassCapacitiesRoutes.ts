import { Request, Response, 
    RequestHandler, RequestHandlerBuilder, 
    GenericRoutes,
    FindManyOptions,
    getUrlParam} from "@modules/index";
import { ILike, In } from "typeorm";
import WeeklyClassCapacitiesController from "../controllers/WeeklyClassCapacitiesController";
import WeeklyClassCapacitiesDTO from "../dtos/WeeklyClassCapacitiesDTO";

class WeeklyClassCapacitiesRoutes extends GenericRoutes {

    private buildBaseFilters(): FindManyOptions {
        return {
            relations: [
                "franchise"],
            where: {} 
        };
    }
    constructor() {
        super(new WeeklyClassCapacitiesController(), "/weeklyClassesCapacities");
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get_capacities`, async (req: Request, res: Response) => {
            const filters = this.buildBaseFilters();

            const start_date: string | null = getUrlParam("start_date", req) || null;
            const end_date: string | null = getUrlParam("end_date", req) || null;

            //const venue: string | null = getUrlParam("venue", req) || null;
            const venue_id: string | null = getUrlParam("venue_id", req) || null;

            /*if (venue != null) {
                this.filters.where = { 
                    ...this.filters.where, 
                    name:  ILike(`%${venue}%`)
                };
            }*/

            if(venue_id != null){
                const venueIdsArray = venue_id!!.split(",")
                                      .map(field => field.trim())
                                      .filter(field => field); 

                if (venueIdsArray.length > 0) {
                    filters.where = { 
                        ...filters.where, 
                        id: In(venueIdsArray), 
                    };
                }
            }

          /*  if (start_date != null) {
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
            }*/

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassCapacitiesDTO(req))
                                    .setMethod("getWeeklyClassesCapcities")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .isValidateRole("WEEKLY_CLASS_CAPACITIES")
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
    }
}

export default WeeklyClassCapacitiesRoutes;
