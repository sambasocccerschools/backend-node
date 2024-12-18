import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericRoutes,
         FindManyOptions} from "@modules/index";
import WeeklyClassFreeTrialDTO from "@modules/02_Synco/weeklyclassfreetrial/dtos/WeeklyClassFreeTrialDTO";
import WeeklyClassFreeTrialController from "../controllers/WeeklyClassFreeTrialController";

class WeeklyClassFreeTrialRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new WeeklyClassFreeTrialController(), "/weeklyClassesFreeTrials");
        this.filters.relations = [
            "weekly_class",
            "free_trial_status",
            "student",
            "agent",
            "booked_by",
            "franchise"
        ];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassFreeTrialDTO(req))
                                    .setMethod("getWeeklyClassFreeTrialById")
                                    .isValidateRole("WEEKLY_CLASS_FREE_TRIAL")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassFreeTrialDTO(req))
                                    .setMethod("getWeeklyClassFreeTrials")
                                    .isValidateRole("WEEKLY_CLASS_FREE_TRIAL")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.weekly_class_id,
                req.body.free_trial_status_code,
                req.body.student_id
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassFreeTrialDTO(req))
                                    .setMethod("insertWeeklyClassFreeTrial")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("WEEKLY_CLASS_FREE_TRIAL")
                                    .build();
        
            this.getController().insert(requestHandler);
        });


        this.router.post(`${this.getRouterName()}/add_front`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.weekly_class_id,
                req.body.free_trial_status_code,
                req.body.students
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassFreeTrialDTO(req))
                                    .setMethod("add_frontWeeklyClassFreeTrial")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("WEEKLY_CLASS_LEAD")
                                    .build();
        
            (this.getController() as WeeklyClassFreeTrialController).insertDynamic(requestHandler);
        });

        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassFreeTrialDTO(req))
                                    .setMethod("updateWeeklyClassFreeTrial")
                                    .isValidateRole("WEEKLY_CLASS_FREE_TRIAL")
                                    .build();
        
            this.getController().update(requestHandler);
        });

        this.router.put(`${this.getRouterName()}/assignAgent`, async (req: Request, res: Response) => {
                const requestHandler: RequestHandler = 
                            new RequestHandlerBuilder(res, req)
                            .setAdapter(new WeeklyClassFreeTrialDTO(req))
                            .setMethod("assignAgentWeeklyClassFreeTrial")
                            .isValidateRole("WEEKLY_CLASS_FREE_TRIAL")
                            .isRequireIdFromQueryParams(false)
                            .build();
                
                (this.getController() as WeeklyClassFreeTrialController).assignAgent(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/changeStatus`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                            new RequestHandlerBuilder(res, req)
                            .setAdapter(new WeeklyClassFreeTrialDTO(req))
                            .setMethod("changeStatusWeeklyClassFreeTrial")
                            .isValidateRole("WEEKLY_CLASS_FREE_TRIAL")
                            .isRequireIdFromQueryParams(false)
                            .build();
        
            (this.getController() as WeeklyClassFreeTrialController).changeStatus(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new WeeklyClassFreeTrialDTO(req))
                                    .setMethod("deleteWeeklyClassFreeTrial")
                                    .isValidateRole("WEEKLY_CLASS_FREE_TRIAL")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default WeeklyClassFreeTrialRoutes;
