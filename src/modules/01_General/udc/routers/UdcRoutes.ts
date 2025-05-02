import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { UnitDynamicCentral, UdcDTO } from '@index/modules/01_General/udc';
import { getUrlParam } from "@TenshiJS/utils/generalUtils";

class UdcRoutes extends GenericRoutes{
    constructor() {
        super(new GenericController(UnitDynamicCentral), "/udc");
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UdcDTO(req))
                                    .setMethod("getUdcById")
                                    .isValidateRole("UNIT_DYNAMIC_CENTRAL")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_by_code`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UdcDTO(req))
                                    .setMethod("getUdcByCode")
                                    .isValidateRole("UNIT_DYNAMIC_CENTRAL")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().getByCode(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const type : string | null = getUrlParam("type", req) || null;
            const options: FindManyOptions = {};
            if(type != null){
                options.where = { ...options.where, type: type};
            }

            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UdcDTO(req))
                                    .setMethod("getUdcs")
                                    .isValidateRole("UNIT_DYNAMIC_CENTRAL")
                                    .isLogicalDelete()
                                    .setFilters(options)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.code, 
                req.body.type, 
                req.body.title
            ];

            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UdcDTO(req))
                                    .setMethod("insertUdc")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("UNIT_DYNAMIC_CENTRAL")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UdcDTO(req))
                                    .setMethod("updateUdc")
                                    .isValidateRole("UNIT_DYNAMIC_CENTRAL")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UdcDTO(req))
                                    .setMethod("deleteUdc")
                                    .isValidateRole("UNIT_DYNAMIC_CENTRAL")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });




        // ************************************************************
        //                          BULK Routers
        // ************************************************************
        this.router.post(`${this.getRouterName()}/add_multiple`, async (req: Request, res: Response) => {
            const requestHandler : RequestHandler = 
                                    new RequestHandlerBuilder(res,req)
                                    .setAdapter(new UdcDTO(req))
                                    .setMethod("insertMultipleUdc")
                                    .isValidateRole("UNIT_DYNAMIC_CENTRAL")
                                    .build();
        
            this.getController().insertMultiple(requestHandler);
        });

        this.router.patch(`${this.getRouterName()}/edit_multiple`, async (req: Request, res: Response) => {

            const requestHandler = new RequestHandlerBuilder(res, req)
                .setAdapter(new UdcDTO(req))
                .setMethod('updateMultipleUdc')
                .isValidateRole('UNIT_DYNAMIC_CENTRAL')
                .build();
        
            this.getController().updateMultiple(requestHandler);
            }
        );

        this.router.patch(`${this.getRouterName()}/edit_multiple_by_ids`,async (req: Request, res: Response) => {
            

              const requestHandler: RequestHandler = new RequestHandlerBuilder(res, req)
                .setAdapter(new UdcDTO(req))
                .setMethod('editMultipleByIds')
                .setRequiredFiles([req.body.ids])       // ensure `ids` is present
                .isValidateRole('UNIT_DYNAMIC_CENTRAL') // role validation
                .build();
      
              // dispatch to controller
              this.getController().updateMultipleByIds(requestHandler);
            }
          );
  

        this.router.post(`${this.getRouterName()}/delete_multiple`,async (req: Request, res: Response) => {
              // we expect { ids: [1,2,3] }
              const requestHandler: RequestHandler = new RequestHandlerBuilder(res, req)
                .setAdapter(new UdcDTO(req))
                .setMethod("deleteMultipleUdc")
                .isValidateRole("UNIT_DYNAMIC_CENTRAL")
                .isLogicalDelete()  
                .build();
          
              this.getController().deleteMultiple(requestHandler);
            }
        );
    }
}
export default UdcRoutes;