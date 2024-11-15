import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { SubscriptionPlanPrice } from "@index/entity/SubscriptionPlanPrice";
import SubscriptionPlanPriceDTO from "@modules/02_Synco/subscriptionplanprice/dtos/SubscriptionPlanPriceDTO";

class SubscriptionPlanPriceRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(SubscriptionPlanPrice), "/subscriptionplanprice");
        this.filters.relations = ["subscription_plan_id",
                                    "payment_type_code",
                                    "student_coverage_code",
                                    "franchise_id"];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SubscriptionPlanPriceDTO(req))
                                    .setMethod("getSubscriptionPlanPriceById")
                                    .isValidateRole("SUBSCRIPTION_PLAN_PRICE")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SubscriptionPlanPriceDTO(req))
                                    .setMethod("getSubscriptionPlanPrices")
                                    .isValidateRole("SUBSCRIPTION_PLAN_PRICE")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.name,
                req.body.subscription_plan_id,
                req.body.payment_type_code,
                req.body.student_coverage_code
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SubscriptionPlanPriceDTO(req))
                                    .setMethod("insertSubscriptionPlanPrice")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("SUBSCRIPTION_PLAN_PRICE")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SubscriptionPlanPriceDTO(req))
                                    .setMethod("updateSubscriptionPlanPrice")
                                    .isValidateRole("SUBSCRIPTION_PLAN_PRICE")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SubscriptionPlanPriceDTO(req))
                                    .setMethod("deleteSubscriptionPlanPrice")
                                    .isValidateRole("SUBSCRIPTION_PLAN_PRICE")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default SubscriptionPlanPriceRoutes;
