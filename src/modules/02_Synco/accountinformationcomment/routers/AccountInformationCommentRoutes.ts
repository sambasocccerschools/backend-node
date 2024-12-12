import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { AccountInformationComment } from "@index/entity/AccountInformationComment";
import AccountInformationCommentDTO from "@modules/02_Synco/accountinformationcomment/dtos/AccountInformationCommentDTO";

class AccountInformationCommentRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(AccountInformationComment), "/accountInformationComment");
        this.filters.relations = ["user","family","franchise"];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AccountInformationCommentDTO(req))
                                    .setMethod("getAccountInformationCommentById")
                                    .isValidateRole("ACCOUNT_INFORMATION_COMMENT")
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AccountInformationCommentDTO(req))
                                    .setMethod("getAccountInformationComments")
                                    .isValidateRole("ACCOUNT_INFORMATION_COMMENT")
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.message
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AccountInformationCommentDTO(req))
                                    .setMethod("insertAccountInformationComment")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("ACCOUNT_INFORMATION_COMMENT")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AccountInformationCommentDTO(req))
                                    .setMethod("updateAccountInformationComment")
                                    .isValidateRole("ACCOUNT_INFORMATION_COMMENT")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new AccountInformationCommentDTO(req))
                                    .setMethod("deleteAccountInformationComment")
                                    .isValidateRole("ACCOUNT_INFORMATION_COMMENT")
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default AccountInformationCommentRoutes;
