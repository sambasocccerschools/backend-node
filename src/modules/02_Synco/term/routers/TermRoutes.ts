import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericRoutes,
         FindManyOptions} from "@modules/index";
import TermDTO from "@modules/02_Synco/term/dtos/TermDTO";
import TermController from "../controllers/TermController";

class TermRoutes extends GenericRoutes {
    
    private buildBaseFilters(): FindManyOptions {
        return {
            relations: [
                "season",
                "franchise"],
            where: {} 
        };
    }

    constructor() {
        super(new TermController(), "/terms");
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const filters = this.buildBaseFilters();
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new TermDTO(req))
                                    .setMethod("getTermById")
                                    .isValidateRole("TERM")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const filters = this.buildBaseFilters();
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new TermDTO(req))
                                    .setMethod("getTerms")
                                    .isValidateRole("TERM")
                                    .isLogicalDelete()
                                    .setFilters(filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.name,
                req.body.start_date,
                req.body.end_date,
                req.body.half_term_date,
                req.body.season_code
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new TermDTO(req))
                                    .setMethod("insertTerm")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("TERM")
                                    .build();
        
            this.getController().insert(requestHandler);
        });


        this.router.post(`${this.getRouterName()}/add_front`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.name,
                req.body.start_date,
                req.body.end_date,
                req.body.half_term_date,
                req.body.season_code
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new TermDTO(req))
                                    .setMethod("insertFromFrontTerm")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("TERM")
                                    .build();
        
            (this.getController() as TermController).insertDynamic(requestHandler);
        });

        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new TermDTO(req))
                                    .setMethod("updateTerm")
                                    .isValidateRole("TERM")
                                    .build();
        
            this.getController().update(requestHandler);
        });

        this.router.put(`${this.getRouterName()}/edit_front`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new TermDTO(req))
                                    .setMethod("updateTerm")
                                    .isValidateRole("TERM")
                                    .build();
        
            (this.getController() as TermController).updateDynamic(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new TermDTO(req))
                                    .setMethod("deleteTerm")
                                    .isValidateRole("TERM")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default TermRoutes;
