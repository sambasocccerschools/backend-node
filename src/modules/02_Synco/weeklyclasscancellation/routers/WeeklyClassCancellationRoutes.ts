import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { WeeklyClassCancellation } from "@index/entity/WeeklyClassCancellation";
import WeeklyClassCancellationDTO from "@modules/02_Synco/weeklyclasscancellation/dtos/WeeklyClassCancellationDTO";

class WeeklyClassCancellationRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(WeeklyClassCancellation), "/weeklyClassesCancellations");
        this.filters.relations = ["weekly_class_member","member_cancel_type","membership_cancel_reason","member_cancel_status","agent","cancelled_by","franchise"];
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
                req.body.member_cancel_status
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
    }
}

export default WeeklyClassCancellationRoutes;
