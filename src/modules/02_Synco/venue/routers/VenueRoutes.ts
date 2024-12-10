import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { Venue } from "@index/entity/Venue";
import VenueDTO from "@modules/02_Synco/venue/dtos/VenueDTO";
import { ConstRegex } from "@index/consts/Const";


class VenueRoutes extends GenericRoutes{
    
    constructor() {
        super(new GenericController(Venue), "/venue");
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {
            const filters: FindManyOptions = {};
            filters.relations = ["region"];
            
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new VenueDTO(req))
                                    .setMethod("getVenueById")
                                    .isValidateRole("VENUE")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const filters: FindManyOptions = {};
            filters.relations = ["region"];
            
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new VenueDTO(req))
                                    .setMethod("getVenues")
                                    .isValidateRole("VENUE")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.name, 
                req.body.latitude,
                req.body.longitude
            ];

            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new VenueDTO(req))
                                    .setMethod("insertVenue")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("VENUE")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new VenueDTO(req))
                                    .setMethod("updateVenue")
                                    .isValidateRole("VENUE")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new VenueDTO(req))
                                    .setMethod("deleteVenue")
                                    .isValidateRole("VENUE")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}
export default VenueRoutes;