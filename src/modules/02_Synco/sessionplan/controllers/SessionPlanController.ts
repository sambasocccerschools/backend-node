import { SessionPlan } from "@index/entity/SessionPlan";
import { SessionPlanExercise } from "@index/entity/SessionPlanExercise";
import { Term } from "@index/entity/Term";
import { ConstHTTPRequest, ConstMessagesJson, ConstStatusJson } from "@TenshiJS/consts/Const";
import { FindManyOptions, RequestHandler } from "@TenshiJS/generics";
import GenericController from "@TenshiJS/generics/Controller/GenericController";
import GenericRepository from "@TenshiJS/generics/Repository/GenericRepository";

export default  class SessionPlanController extends GenericController{

    constructor() {
        super(SessionPlan);
    }

    async insert(reqHandler: RequestHandler): Promise<any> {

        return this.getService().insertService(reqHandler, async (jwtData, httpExec) => {

            let body = reqHandler.getAdapter().entityFromPostBody();
            // Set the user ID of the entity with the ID of the JWT
            body = this.setUserId(body, jwtData!.id);

            try{
                const sessionPlanExerciseRepository = await new GenericRepository(SessionPlanExercise);

                // Insert the entity into the database
                const createSessionPlan = await this.getRepository().add(body);

                let isSuccess = true;
                let errorMessage:any = "";

                if (Array.isArray(body.exercises) && body.exercises.length > 0) {

                    
                    for (const exercise of body.exercises) {
                        let sessionPlanExercise = new SessionPlanExercise();
                        sessionPlanExercise.session_plan = createSessionPlan.id;
                        sessionPlanExercise.franchise = createSessionPlan.franchise;
                        sessionPlanExercise.title = exercise.title;
                        sessionPlanExercise.subtitle = exercise.subtitle;
                        sessionPlanExercise.title_duration = exercise.title_duration;
                        sessionPlanExercise.description = exercise.description;
                        sessionPlanExercise.json_urls = exercise.json_urls;
                        
                        try {
                            sessionPlanExercise = await sessionPlanExerciseRepository.add(sessionPlanExercise);
                        } catch (error: any) {
                            isSuccess = false;
                            errorMessage += error.message;
                        } 
                    }
                }

                if (isSuccess) {
                    return httpExec.successAction(
                        reqHandler.getAdapter().entityToResponse(createSessionPlan),
                        ConstHTTPRequest.INSERT_ENTRIES_SUCCESS
                    );
                } else {
                    return await httpExec.databaseError(errorMessage, jwtData!.id.toString(), 
                    reqHandler.getMethod(), this.getControllerName());
                }

            }catch(error : any){
                // Return the database error response
                return await httpExec.databaseError(error, jwtData!.id.toString(), 
                reqHandler.getMethod(), this.getControllerName());
            }
        });
     }




     async update(reqHandler: RequestHandler): Promise<any> {

        return this.getService().updateService(reqHandler, async (jwtData, httpExec, id) => {

            // Get data from the body
            const body = reqHandler.getAdapter().entityFromPutBody();

            const sessionPlanExerciseRepository = await new GenericRepository(SessionPlanExercise);
            
            // Update the entity in the database
            let updateSessionP;
            try {
                const updateSessionPlan = { ...body };
                if (updateSessionPlan.exercises) {
                    delete updateSessionPlan.exercises;
                }
                updateSessionP = await this.getRepository().update(id!!, updateSessionPlan, reqHandler.getLogicalDelete());

                if(updateSessionP == null){
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS);
                }

            } catch (error: any) {
                return await httpExec.databaseError(error.message, jwtData!.id.toString(), reqHandler.getMethod(), this.getControllerName());
            }
            
            let isSuccess = true;
            let errorMessage: any = "";
            
            if(updateSessionP != null){
                // Process the exercises
                if (Array.isArray(body.exercises) && body.exercises.length > 0) {

                    // Delete existing exercises for session plans
                    try {
                        const deleteMany: FindManyOptions = {
                            where: {
                                session_plan: {
                                    id: id, 
                                },
                            }
                        };
                        await sessionPlanExerciseRepository.removeByOptions(deleteMany);
                    } catch (error: any) {
                        isSuccess = false;
                        errorMessage += `Failed to delete exercise sessions: ${error.message} `;
                        
                    }

                    for (const exercise of body.exercises) {

                        let sessionPlanExercise = new SessionPlanExercise();
                            sessionPlanExercise.session_plan = updateSessionP.id;
                            sessionPlanExercise.franchise = updateSessionP.franchise;
                            sessionPlanExercise.title = exercise.title;
                            sessionPlanExercise.subtitle = exercise.subtitle;
                            sessionPlanExercise.title_duration = exercise.title_duration;
                            sessionPlanExercise.description = exercise.description;
                            sessionPlanExercise.json_urls = exercise.json_urls;
                            
                            try {
                                sessionPlanExercise = await sessionPlanExerciseRepository.add(sessionPlanExercise);
                            } catch (error: any) {
                                isSuccess = false;
                                errorMessage += error.message;
                            } 
                    }
                }
            }
           
            
            if (isSuccess) {
                return httpExec.successAction(
                    reqHandler.getAdapter().entityToResponse(updateSessionP),
                    ConstHTTPRequest.UPDATE_ENTRIES_SUCCESS
                );
            } else {
                return await httpExec.databaseError(errorMessage, jwtData!.id.toString(), reqHandler.getMethod(), this.getControllerName());
            }
            
        });
     }

     


     async getById(reqHandler: RequestHandler): Promise<any> {
        return this.getService().getByIdService(reqHandler, async (jwtData, httpExec, id) => {
            try {
                // Execute the get by id action in the database
                const entity = await this.getRepository().findById(id, reqHandler.getLogicalDelete(), reqHandler.getFilters());
    
                if (entity != null && entity != undefined) {
                    // Repositories for sessionPlanExercise and sessionPlanPlan
                    const sessionPlanExerciseRepository = await new GenericRepository(SessionPlanExercise);
                  
                    // Fetch term sessions for the entity
                    const sessionPlanOptions: FindManyOptions = {
                        where: {
                            session_plan: {
                                id: id, 
                            },
                        },
                    };
                  
                    const sessionPlans = await sessionPlanExerciseRepository.findByOptions(false, true, sessionPlanOptions);
                   
                    // Attach sessionPlans to entity
                    entity.exercises = sessionPlans;
    
                    // Prepare the response
                    const codeResponse: string =
                        reqHandler.getCodeMessageResponse() != null
                            ? (reqHandler.getCodeMessageResponse() as string)
                            : ConstHTTPRequest.GET_BY_ID_SUCCESS;
    
                    // Return the success response
                    return httpExec.successAction(
                        reqHandler.getAdapter().entityToResponse(entity),
                        codeResponse
                    );
                } else {
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS);
                }
            } catch (error: any) {
                // Return the database error response
                return await httpExec.databaseError(
                    error,
                    jwtData.id.toString(),
                    reqHandler.getMethod(),
                    this.getControllerName()
                );
            }
        });
    }



    
    async getAll(reqHandler: RequestHandler): Promise<any> {
        return this.getService().getAllService(reqHandler, async (jwtData, httpExec, page: number, size: number) => {
            try {
               
                const entities = await this.getRepository().findAll(
                    reqHandler.getLogicalDelete(),
                    reqHandler.getFilters(),
                    page,
                    size
                );
    
                if (entities != null && entities != undefined && entities.length > 0) {
                    
                    const sessionPlanExerciseRepository = await new GenericRepository(SessionPlanExercise);
                    for (const entity of entities) {
                        const termSessionOptions: FindManyOptions = {
                            where: {
                                session_plan: {
                                    id: entity.id, 
                                },
                            },
                        };
    
                        const sessionPlanExercises = await sessionPlanExerciseRepository.findByOptions(false, true, termSessionOptions);
                        entity.exercises = sessionPlanExercises;
                    }
    
                    // Preparing the response
                    const codeResponse: string =
                        reqHandler.getCodeMessageResponse() != null
                            ? (reqHandler.getCodeMessageResponse() as string)
                            : ConstHTTPRequest.GET_ALL_SUCCESS;
    
                    //get the response
                    return httpExec.successAction(reqHandler.getAdapter().entitiesToResponse(entities), codeResponse);
                } else {
                    // dynamic error
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS);
                }
            } catch (error: any) {
                return await httpExec.databaseError(
                    error,
                    jwtData.id.toString(),
                    reqHandler.getMethod(),
                    this.getControllerName()
                );
            }
        });
    }
    
}