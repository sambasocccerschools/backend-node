import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { Family } from "@index/entity/Family";
import FamilyDTO from "@modules/02_Synco/family/dtos/FamilyDTO";

class FamilyRoutes extends GenericRoutes {
    
    private buildBaseFilters(): FindManyOptions {
        return {
            relations: [
                "franchise"],
            where: {} 
        };
    }
    constructor() {
        super(new GenericController(Family), "/family");
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const filters = this.buildBaseFilters();
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new FamilyDTO(req))
                                    .setMethod("getFamilyById")
                                    .isValidateRole("FAMILY")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const filters = this.buildBaseFilters();
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new FamilyDTO(req))
                                    .setMethod("getFamilys")
                                    .isValidateRole("FAMILY")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new FamilyDTO(req))
                                    .setMethod("insertFamily")
                                    .isValidateRole("FAMILY")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new FamilyDTO(req))
                                    .setMethod("updateFamily")
                                    .isValidateRole("FAMILY")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new FamilyDTO(req))
                                    .setMethod("deleteFamily")
                                    .isValidateRole("FAMILY")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default FamilyRoutes;
