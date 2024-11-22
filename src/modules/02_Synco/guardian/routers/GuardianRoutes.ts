import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { Guardian } from "@index/entity/Guardian";
import GuardianDTO from "@modules/02_Synco/guardian/dtos/GuardianDTO";

class GuardianRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(Guardian), "/guardian");
        this.filters.relations = [
            "relationship_code",
            "referral_source_code",
            "family_id",
            "franchise_id"];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new GuardianDTO(req))
                                    .setMethod("getGuardianById")
                                    .isValidateRole("GUARDIAN")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new GuardianDTO(req))
                                    .setMethod("getGuardians")
                                    .isValidateRole("GUARDIAN")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new GuardianDTO(req))
                                    .setMethod("insertGuardian")
                                    .isValidateRole("GUARDIAN")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new GuardianDTO(req))
                                    .setMethod("updateGuardian")
                                    .isValidateRole("GUARDIAN")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new GuardianDTO(req))
                                    .setMethod("deleteGuardian")
                                    .isValidateRole("GUARDIAN")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default GuardianRoutes;
