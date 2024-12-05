import { Request, Response, 
         RequestHandler, RequestHandlerBuilder, 
         GenericController, GenericRoutes,
         FindManyOptions} from "@modules/index";
import { Student } from "@index/entity/Student";
import StudentDTO from "@modules/02_Synco/student/dtos/StudentDTO";

class StudentRoutes extends GenericRoutes {
    
    private filters: FindManyOptions = {};
    constructor() {
        super(new GenericController(Student), "/student");
        this.filters.relations = ["family","franchise"];
    }

    protected initializeRoutes() {
        this.router.get(`${this.getRouterName()}/get`, async (req: Request, res: Response) => {

            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new StudentDTO(req))
                                    .setMethod("getStudentById")
                                    .isValidateRole("STUDENT")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getById(requestHandler);
        });
        
        this.router.get(`${this.getRouterName()}/get_all`, async (req: Request, res: Response) => {
        
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new StudentDTO(req))
                                    .setMethod("getStudents")
                                    .isValidateRole("STUDENT")
                                    .isLogicalDelete()
                                    .setFilters(this.filters)
                                    .build();
        
            this.getController().getAll(requestHandler);
        });
        
        this.router.post(`${this.getRouterName()}/add`, async (req: Request, res: Response) => {

            const requiredBodyList: Array<string> = [
                req.body.first_name,
                req.body.last_name,
                req.body.age
            ];
            
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new StudentDTO(req))
                                    .setMethod("insertStudent")
                                    .setRequiredFiles(requiredBodyList)
                                    .isValidateRole("STUDENT")
                                    .build();
        
            this.getController().insert(requestHandler);
        });
        
        this.router.put(`${this.getRouterName()}/edit`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new StudentDTO(req))
                                    .setMethod("updateStudent")
                                    .isValidateRole("STUDENT")
                                    .build();
        
            this.getController().update(requestHandler);
        });
        
        this.router.delete(`${this.getRouterName()}/delete`, async (req: Request, res: Response) => {
            const requestHandler: RequestHandler = 
                                    new RequestHandlerBuilder(res, req)
                                    .setAdapter(new StudentDTO(req))
                                    .setMethod("deleteStudent")
                                    .isValidateRole("STUDENT")
                                    .isLogicalDelete()
                                    .build();
        
            this.getController().delete(requestHandler);
        });
    }
}

export default StudentRoutes;
