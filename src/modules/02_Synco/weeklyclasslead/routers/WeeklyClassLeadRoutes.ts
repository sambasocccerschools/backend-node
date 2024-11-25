import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { WeeklyClassLead } from "@index/entity/WeeklyClassLead";
import WeeklyClassLeadDTO from "@modules/02_Synco/weeklyclasslead/dtos/WeeklyClassLeadDTO";

class WeeklyClassLeadRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(WeeklyClassLead), "/weeklyClassesLeads");
        this.filters.relations = [
            "lead_status_code",
            "weekly_class_id",
            "guardian_id",
            "agent_id",
            "booked_by",
            "franchise_id"
        ];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassLeadDTO(req))
                                    .setMethod("getWeeklyClassLeadById")
                                    .isValidateRole("WEEKLY_CLASS_LEAD")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassLeadDTO(req))
                                    .setMethod("getWeeklyClassLeads")
                                    .isValidateRole("WEEKLY_CLASS_LEAD")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.lead_status_code,
                req.body.guardian_id
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassLeadDTO(req))
                                    .setMethod("insertWeeklyClassLead")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("WEEKLY_CLASS_LEAD")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassLeadDTO(req))
                                    .setMethod("updateWeeklyClassLead")
                                    .isValidateRole("WEEKLY_CLASS_LEAD")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassLeadDTO(req))
                                    .setMethod("deleteWeeklyClassLead")
                                    .isValidateRole("WEEKLY_CLASS_LEAD")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default WeeklyClassLeadRoutes;
