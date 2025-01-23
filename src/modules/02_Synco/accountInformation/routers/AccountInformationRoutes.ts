
import { Request, Response, 
    RequestHandler, RequestHandlerBuilder, 
    GenericRoutes,
    FindManyOptions} from "@modules/index";
import AccountInformationDTO from "../dtos/AccountInformationDTO";
import AccountInformationController from "../controllers/AccountInformationController";

class AccountInformationRoutes extends GenericRoutes {

private filters: FindManyOptions = {};
constructor() {
   super(new AccountInformationController(), "/accountInformation");
   this.filters.relations = ["franchise"];
}

protected initializeRoutes() {
   this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

       const requestHandler: RequestHandler = 
                               new RequestHandlerBuilder(res, req)
                               .setAdapter(new AccountInformationDTO(req))
                               .setMethod("getAccountInformationById")
                               .isValidateRole("ACCOUNT_INFORMATION")
                               .isLogicalDelete()
                               .setFilters(this.filters)
                               .build();
   
       this.getController().getById(requestHandler);
   });
   
   this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
   
       const requestHandler: RequestHandler = 
                               new RequestHandlerBuilder(res, req)
                               .setAdapter(new AccountInformationDTO(req))
                               .setMethod("getAccountInformations")
                               .isValidateRole("ACCOUNT_INFORMATION")
                               .isLogicalDelete()
                               .setFilters(this.filters)
                               .build();
   
       this.getController().getAll(requestHandler);
   });
   
    }
}

export default AccountInformationRoutes;
