import { Request, Response, 
    RequestHandler, RequestHandlerBuilder, 
    GenericRoutes,
    FindManyOptions,
    getUrlParam,
    GenericRepository} from "@modules/index";
import WeeklyClassFindClassDTO from "@modules/02_Synco/weeklyClassesFindClass/dtos/WeeklyClassFindClassDTO";
import { ILike, In } from "typeorm";
import WeeklyClassFindClassController from "../controllers/WeeklyClassFindClassController";
import { Venue } from "@index/entity/Venue";
import { WeeklyClass } from "@index/entity/WeeklyClass";

class WeeklyClassFindClassRoutes extends GenericRoutes {

    private buildBaseFilters(): FindManyOptions {
        return {
            relations: ["region", "franchise"],
            where: {} // vacío para que se construya por cada request
        };
    }
    constructor() {
        super(new WeeklyClassFindClassController(), "/allWeeklyClasses");
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/find_a_class`, async (req: Request, res: Response) => {
            const filters = this.buildBaseFilters();

            const venue: string | null = getUrlParam("venue", req) || null;
            const postcode: string | null = getUrlParam("postcode", req) || null;
            const lat: string | null = getUrlParam("lat", req) || null;
            const lng: string | null = getUrlParam("lng", req) || null;
            

            //this can join by comma
            const venue_id: string | null = getUrlParam("venue_id", req) || null;
            const class_name: string | null = getUrlParam("class_name", req) || null;

            if(postcode != null){
                filters.where = { 
                    ...filters.where, 
                    franchise: {
                        postal_code: postcode, 
                    }
                };
            }

            if (venue != null) {
                filters.where = { 
                    ...filters.where, 
                    name:  ILike(`%${venue}%`)
                };
            }

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

           /* if(class_name != null){
                const classesArray = class_name!!.split(",")
                                 .map(field => field.trim())
                                 .filter(field => field); 

                if (classesArray.length > 0) {
                    filters.where = { 
                        ...filters.where, 
                        name: In(classesArray), 
                    };
                }
            }*/

            if (class_name != null) {
                const classesArray = class_name
                    .split(",")
                    .map(v => v.trim())
                    .filter(Boolean);
                
                if (classesArray.length > 0) {
                    const matchingIds = await this.getVenueIdsByClassName(classesArray);
                
                    filters.where = {
                        ...filters.where,
                        id: matchingIds.length > 0 ? In(matchingIds) : In([-1]) 
                    };
                }
            }

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassFindClassDTO(req))
                                    .setMethod("getWeeklyClasss")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
    }


    async getVenueIdsByClassName(keywords: string[]): Promise<number[]> {
        const repo = await new GenericRepository(WeeklyClass);
      
        const qb = repo.createQueryBuilder("weeklyClass")
          .select("weeklyClass.venue", "id")
          .groupBy("weeklyClass.venue");
      
        keywords.forEach((kw, idx) => {
          const param = `kw${idx}`;
          if (idx === 0) {
            qb.where(`LOWER(weeklyClass.name) LIKE :${param}`, { [param]: `%${kw.toLowerCase()}%` });
          } else {
            qb.orWhere(`LOWER(weeklyClass.name) LIKE :${param}`, { [param]: `%${kw.toLowerCase()}%` });
          }
        });
      
        const raw = await qb.getRawMany(); // [{ id: 123 }, { id: 456 }]
        return raw.map(r => Number(r.id));
      }
    
}

export default WeeklyClassFindClassRoutes;
