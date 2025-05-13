import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { TermSession } from "@index/entity/TermSession";
import TermSessionDTO from "@modules/02_Synco/termsession/dtos/TermSessionDTO";

class TermSessionRoutes extends GenericRoutes {
    
    private buildBaseFilters(): FindManyOptions {
        return {
            relations: [
                "term",
                "franchise"],
            where: {} 
        };
    }
    constructor() {
        super(new GenericController(TermSession), "/termSessions");
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const filters = this.buildBaseFilters();
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new TermSessionDTO(req))
                                    .setMethod("getTermSessionById")
                                    .isValidateRole("TERM_SESSION")
                                    .setFilters(filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const filters = this.buildBaseFilters();
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new TermSessionDTO(req))
                                    .setMethod("getTermSessions")
                                    .isValidateRole("TERM_SESSION")
                                    .setFilters(filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.term_id
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new TermSessionDTO(req))
                                    .setMethod("insertTermSession")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("TERM_SESSION")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new TermSessionDTO(req))
                                    .setMethod("updateTermSession")
                                    .isValidateRole("TERM_SESSION")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new TermSessionDTO(req))
                                    .setMethod("deleteTermSession")
                                    .isValidateRole("TERM_SESSION")
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default TermSessionRoutes;
