import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions,
         JWTObject} from "@modules/index";
import { Franchise } from "@index/entity/Franchise";
import FranchiseDTO from "@modules/02_Synco/franchise/dtos/FranchiseDTO";

class FranchiseRoutes extends GenericRoutes{
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(Franchise), "/franchise");
        this.filters.relations = ["referral_source", "added_by"];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new FranchiseDTO(req))
                                    .setMethod("getFranchiseById")
                                    .isValidateRole("FRANCHISE")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new FranchiseDTO(req))
                                    .setMethod("getFranchises")
                                    .isValidateRole("FRANCHISE")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.first_name, 
                req.body.last_name,
                req.body.phone_number,
                req.body.email,
                req.body.location,
                req.body.referral_source_code,
            ];
            
            const jwtData : JWTObject = res.locals.jwtData;
            const franchiseDto = new FranchiseDTO(req, jwtData.id.toString());

            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(franchiseDto)
                                    .setMethod("insertFranchise")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("FRANCHISE")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new FranchiseDTO(req))
                                    .setMethod("updateFranchise")
                                    .isValidateRole("FRANCHISE")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new FranchiseDTO(req))
                                    .setMethod("deleteFranchise")
                                    .isValidateRole("FRANCHISE")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}
export default FranchiseRoutes;