import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { SessionPlan } from "@index/entity/SessionPlan";
import SessionPlanDTO from "@modules/02_Synco/sessionplan/dtos/SessionPlanDTO";

class SessionPlanRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(SessionPlan), "/sessionPlans");
        this.filters.relations = ["ability_group","franchise"];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SessionPlanDTO(req))
                                    .setMethod("getSessionPlanById")
                                    .isValidateRole("SESSION_PLAN")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SessionPlanDTO(req))
                                    .setMethod("getSessionPlans")
                                    .isValidateRole("SESSION_PLAN")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.title,
                req.body.ability_group_id
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SessionPlanDTO(req))
                                    .setMethod("insertSessionPlan")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("SESSION_PLAN")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SessionPlanDTO(req))
                                    .setMethod("updateSessionPlan")
                                    .isValidateRole("SESSION_PLAN")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SessionPlanDTO(req))
                                    .setMethod("deleteSessionPlan")
                                    .isValidateRole("SESSION_PLAN")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default SessionPlanRoutes;
