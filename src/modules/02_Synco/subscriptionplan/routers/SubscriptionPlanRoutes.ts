import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { SubscriptionPlan } from "@index/entity/SubscriptionPlan";
import SubscriptionPlanDTO from "@modules/02_Synco/subscriptionplan/dtos/SubscriptionPlanDTO";

class SubscriptionPlanRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(SubscriptionPlan), "/subscriptionPlans");
        this.filters.relations = ["service","venue","franchise"];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SubscriptionPlanDTO(req))
                                    .setMethod("getSubscriptionPlanById")
                                    .isValidateRole("SUBSCRIPTION_PLAN")
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SubscriptionPlanDTO(req))
                                    .setMethod("getSubscriptionPlans")
                                    .isValidateRole("SUBSCRIPTION_PLAN")
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.service,
                req.body.venue,
                req.body.name,
                req.body.duration
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SubscriptionPlanDTO(req))
                                    .setMethod("insertSubscriptionPlan")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("SUBSCRIPTION_PLAN")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SubscriptionPlanDTO(req))
                                    .setMethod("updateSubscriptionPlan")
                                    .isValidateRole("SUBSCRIPTION_PLAN")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SubscriptionPlanDTO(req))
                                    .setMethod("deleteSubscriptionPlan")
                                    .isValidateRole("SUBSCRIPTION_PLAN")
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default SubscriptionPlanRoutes;
