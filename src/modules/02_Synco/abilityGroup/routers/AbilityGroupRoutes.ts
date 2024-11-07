import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { AbilityGroup } from "@index/entity/AbilityGroup";
import AbilityGroupDTO from "@modules/02_Synco/abilityGroup/dtos/AbilityGroupDTO";
import { ConstRegex } from "@index/consts/Const";


class AbilityGroupRoutes extends GenericRoutes{
    
    constructor() {
        super(new GenericController(AbilityGroup), "/abilityGroups");
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const filters: FindManyOptions = {};
            filters.relations = ["service_code", "service_package_code"];

            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new AbilityGroupDTO(req))
                                    .setMethod("getAbilityGroupById")
                                    .isValidateRole("ABILITY_GROUP")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const filters: FindManyOptions = {};
            filters.relations = ["service_code", "service_package_code"];
            
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new AbilityGroupDTO(req))
                                    .setMethod("getAbilityGroups")
                                    .isValidateRole("ABILITY_GROUP")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.name, 
                req.body.min_age,
                req.body.max_age
            ];

            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new AbilityGroupDTO(req))
                                    .setMethod("insertAbilityGroup")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("ABILITY_GROUP")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new AbilityGroupDTO(req))
                                    .setMethod("updateAbilityGroup")
                                    .isValidateRole("ABILITY_GROUP")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new AbilityGroupDTO(req))
                                    .setMethod("deleteAbilityGroup")
                                    .isValidateRole("ABILITY_GROUP")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}
export default AbilityGroupRoutes;