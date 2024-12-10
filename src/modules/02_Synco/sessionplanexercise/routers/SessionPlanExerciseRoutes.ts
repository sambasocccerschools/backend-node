import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { SessionPlanExercise } from "@index/entity/SessionPlanExercise";
import SessionPlanExerciseDTO from "@modules/02_Synco/sessionplanexercise/dtos/SessionPlanExerciseDTO";

class SessionPlanExerciseRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(SessionPlanExercise), "/sessionPlanExercises");
        this.filters.relations = ["session_plan","franchise"];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SessionPlanExerciseDTO(req))
                                    .setMethod("getSessionPlanExerciseById")
                                    .isValidateRole("SESSION_PLAN_EXERCISE")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SessionPlanExerciseDTO(req))
                                    .setMethod("getSessionPlanExercises")
                                    .isValidateRole("SESSION_PLAN_EXERCISE")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.session_plan,
                req.body.title,
                req.body.subtitle,
                req.body.title_duration
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SessionPlanExerciseDTO(req))
                                    .setMethod("insertSessionPlanExercise")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("SESSION_PLAN_EXERCISE")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SessionPlanExerciseDTO(req))
                                    .setMethod("updateSessionPlanExercise")
                                    .isValidateRole("SESSION_PLAN_EXERCISE")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SessionPlanExerciseDTO(req))
                                    .setMethod("deleteSessionPlanExercise")
                                    .isValidateRole("SESSION_PLAN_EXERCISE")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default SessionPlanExerciseRoutes;
