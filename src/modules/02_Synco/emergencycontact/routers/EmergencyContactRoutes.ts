import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { EmergencyContact } from "@index/entity/EmergencyContact";
import EmergencyContactDTO from "@modules/02_Synco/emergencycontact/dtos/EmergencyContactDTO";

class EmergencyContactRoutes extends GenericRoutes {
    
    private buildBaseFilters(): FindManyOptions {
        return {
            relations: [
                "relationship",
                "family",
                "franchise"],
            where: {} 
        };
    }
    constructor() {
        super(new GenericController(EmergencyContact), "/emergencycontact");
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const filters = this.buildBaseFilters();
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new EmergencyContactDTO(req))
                                    .setMethod("getEmergencyContactById")
                                    .isValidateRole("EMERGENCY_CONTACT")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const filters = this.buildBaseFilters();
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new EmergencyContactDTO(req))
                                    .setMethod("getEmergencyContacts")
                                    .isValidateRole("EMERGENCY_CONTACT")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.first_name,
                req.body.last_name,
                req.body.phone_number
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new EmergencyContactDTO(req))
                                    .setMethod("insertEmergencyContact")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("EMERGENCY_CONTACT")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new EmergencyContactDTO(req))
                                    .setMethod("updateEmergencyContact")
                                    .isValidateRole("EMERGENCY_CONTACT")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new EmergencyContactDTO(req))
                                    .setMethod("deleteEmergencyContact")
                                    .isValidateRole("EMERGENCY_CONTACT")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default EmergencyContactRoutes;
