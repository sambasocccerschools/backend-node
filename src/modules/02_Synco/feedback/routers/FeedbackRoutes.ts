import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { Feedback } from "@index/entity/Feedback";
import FeedbackDTO from "@modules/02_Synco/feedback/dtos/FeedbackDTO";
import FeedbackController from "../controllers/FeedbackController";

class FeedbackRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new FeedbackController(), "/feedback");
        this.filters.relations = [
            "weekly_class",
            "feedback_type",
            "feedback_category",
            "feedback_status",
            "agent",
            "reported_by",
            "franchise",
            "family"];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new FeedbackDTO(req))
                                    .setMethod("getFeedbackById")
                                    .isValidateRole("FEEDBACK")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new FeedbackDTO(req))
                                    .setMethod("getFeedbacks")
                                    .isValidateRole("FEEDBACK")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.weekly_class_id,
                req.body.feedback_type_code,
                req.body.feedback_category_code,
                req.body.feedback_status_code,
                req.body.family_id
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new FeedbackDTO(req))
                                    .setMethod("insertFeedback")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("FEEDBACK")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new FeedbackDTO(req))
                                    .setMethod("updateFeedback")
                                    .isValidateRole("FEEDBACK")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new FeedbackDTO(req))
                                    .setMethod("deleteFeedback")
                                    .isValidateRole("FEEDBACK")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });



         this.router.put(`${this.getRouterName()}/assignAgent`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                        new RequestHandlerBuilder(res, req)
                        .setAdapter(new FeedbackDTO(req))
                        .setMethod("assignAgentFeedback")
                        .isValidateRole("FEEDBACK")
                        .isRequireIdFromQueryParams(false)
                        .build();
            
            (this.getController() as FeedbackController).assignAgent(requestHandler);
        });

        //TODO
        //This works like Resolve Endpoint, just pass SOLVED_FS in the status      
        this.router.put(`${this.getRouterName()}/changeStatus`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                        new RequestHandlerBuilder(res, req)
                        .setAdapter(new FeedbackDTO(req))
                        .setMethod("changeStatusFeedback")
                        .isValidateRole("FEEDBACK")
                        .isRequireIdFromQueryParams(false)
                        .build();
            
            (this.getController() as FeedbackController).changeStatus(requestHandler);
        });
    }
}

export default FeedbackRoutes;
