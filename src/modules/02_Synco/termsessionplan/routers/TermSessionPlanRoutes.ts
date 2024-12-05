import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { TermSessionPlan } from "@index/entity/TermSessionPlan";
import TermSessionPlanDTO from "@modules/02_Synco/termsessionplan/dtos/TermSessionPlanDTO";

class TermSessionPlanRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(TermSessionPlan), "/termSessionPlan");
        this.filters.relations = [
            "term_session",
            "ability_group",
            "session_plan",
            "franchise"
        ];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new TermSessionPlanDTO(req))
                                    .setMethod("getTermSessionPlanById")
                                    .isValidateRole("TERM_SESSION_PLAN")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new TermSessionPlanDTO(req))
                                    .setMethod("getTermSessionPlans")
                                    .isValidateRole("TERM_SESSION_PLAN")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.term_session_id,
                req.body.ability_group_id,
                req.body.session_plan_id
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new TermSessionPlanDTO(req))
                                    .setMethod("insertTermSessionPlan")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("TERM_SESSION_PLAN")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new TermSessionPlanDTO(req))
                                    .setMethod("updateTermSessionPlan")
                                    .isValidateRole("TERM_SESSION_PLAN")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new TermSessionPlanDTO(req))
                                    .setMethod("deleteTermSessionPlan")
                                    .isValidateRole("TERM_SESSION_PLAN")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default TermSessionPlanRoutes;
