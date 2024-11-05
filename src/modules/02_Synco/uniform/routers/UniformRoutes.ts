import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes} from "@modules/index";
import { Uniform } from "@index/entity/Uniform";
import UniformDTO from "@modules/02_Synco/uniform/dtos/UniformDTO";
import { ConstRegex } from "@index/consts/Const";


class UniformRoutes extends GenericRoutes{
    
    constructor() {
        super(new GenericController(Uniform), "/uniform");
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UniformDTO(req))
                                    .setMethod("getUniformById")
                                    .isValidateRole("UNIFORM")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UniformDTO(req))
                                    .setMethod("getUniforms")
                                    .isValidateRole("UNIFORM")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.title, 
                req.body.price
            ];

            const regexValidationList: [string, string][] = [
                [ConstRegex.PRICE_REGEX, req.body.price as string]
            ];

            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UniformDTO(req))
                                    .setMethod("insertUniform")
                                    .setRequiredFiles(requiredBodyList)
                                    .setRegexValidation(regexValidationList)
                                    .isValidateRole("UNIFORM")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UniformDTO(req))
                                    .setMethod("updateUniform")
                                    .isValidateRole("UNIFORM")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UniformDTO(req))
                                    .setMethod("deleteUniform")
                                    .isValidateRole("UNIFORM")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}
export default UniformRoutes;