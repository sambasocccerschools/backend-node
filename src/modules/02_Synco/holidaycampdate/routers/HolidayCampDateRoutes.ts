import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { HolidayCampDate } from "@index/entity/HolidayCampDate";
import HolidayCampDateDTO from "@modules/02_Synco/holidaycampdate/dtos/HolidayCampDateDTO";

class HolidayCampDateRoutes extends GenericRoutes {
    
    private buildBaseFilters(): FindManyOptions {
        return {
            relations: [
                "camp_type",
                "franchise"],
            where: {} 
        };
    }
    constructor() {
        super(new GenericController(HolidayCampDate), "/holidayCampDates");
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const filters = this.buildBaseFilters();
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new HolidayCampDateDTO(req))
                                    .setMethod("getHolidayCampDateById")
                                    .isValidateRole("HOLIDAY_CAMP_DATE")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const filters = this.buildBaseFilters();
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new HolidayCampDateDTO(req))
                                    .setMethod("getHolidayCampDates")
                                    .isValidateRole("HOLIDAY_CAMP_DATE")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.name,
                req.body.start_date,
                req.body.end_date,
                req.body.camp_type_code
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new HolidayCampDateDTO(req))
                                    .setMethod("insertHolidayCampDate")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("HOLIDAY_CAMP_DATE")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new HolidayCampDateDTO(req))
                                    .setMethod("updateHolidayCampDate")
                                    .isValidateRole("HOLIDAY_CAMP_DATE")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new HolidayCampDateDTO(req))
                                    .setMethod("deleteHolidayCampDate")
                                    .isValidateRole("HOLIDAY_CAMP_DATE")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default HolidayCampDateRoutes;
