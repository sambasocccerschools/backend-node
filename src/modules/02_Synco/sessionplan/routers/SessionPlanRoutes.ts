import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericRoutes,
         FindManyOptions,
         getUrlParam} from "@modules/index";
import SessionPlanDTO from "@modules/02_Synco/sessionplan/dtos/SessionPlanDTO";
import SessionPlanController from "../controllers/SessionPlanController";
import { In } from "typeorm";

class SessionPlanRoutes extends GenericRoutes {
    
    private buildBaseFilters(): FindManyOptions {
        return {
            relations: [
                "ability_group",
                "franchise"],
            where: {} 
        };
    }
    constructor() {
        super(new SessionPlanController(), "/sessionPlans");
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const filters = this.buildBaseFilters();
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SessionPlanDTO(req))
                                    .setMethod("getSessionPlanById")
                                    .isValidateRole("SESSION_PLAN")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const filters = this.buildBaseFilters();
            const ability_group_id: string | null = getUrlParam("ability_group_id", req) || null;

            if(ability_group_id != null){
                const abilityGroupIdsArray = ability_group_id!!.split(",")
                                        .map(field => field.trim())
                                        .filter(field => field); 

                if (abilityGroupIdsArray.length > 0) {
                    filters.where = { 
                        ...filters.where, 
                        ability_group: {
                            id: In(abilityGroupIdsArray), 
                        }
                    };
                }
            }

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new SessionPlanDTO(req))
                                    .setMethod("getSessionPlans")
                                    .isValidateRole("SESSION_PLAN")
                                    .isLogicalDelete()
                                    .setFilters(filters)
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
