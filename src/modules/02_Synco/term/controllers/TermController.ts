import { Franchise } from "@index/entity/Franchise";
import { Term } from "@index/entity/Term";
import { TermSession } from "@index/entity/TermSession";
import { TermSessionPlan } from "@index/entity/TermSessionPlan";
import { ConstHTTPRequest, ConstMessagesJson, ConstStatusJson } from "@TenshiJS/consts/Const";
import GenericController from "@TenshiJS/generics/Controller/GenericController";
import GenericRepository from "@TenshiJS/generics/Repository/GenericRepository";
import RequestHandler from "@TenshiJS/generics/RequestHandler/RequestHandler";
import { FindManyOptions } from "typeorm";

export default  class TermController extends GenericController{

    constructor() {
        super(Term);
    }

    async insertDynamic(reqHandler: RequestHandler): Promise<any> {

        return this.getService().insertService(reqHandler, async (jwtData, httpExec) => {

            let body = reqHandler.getAdapter().entityFromPostBody();
            // Set the user ID of the entity with the ID of the JWT
            body = this.setUserId(body, jwtData!.id);

            try{
                const termSessionRepository = await new GenericRepository(TermSession);
                const termSessionPlanRepository = await new GenericRepository(TermSessionPlan);

                // Insert the entity into the database
                const createTerm = await this.getRepository().add(body);

                let isSuccess = true;
                let errorMessage:any = "";

                if (Array.isArray(body.sessions) && body.sessions.length > 0) {

                    for (const session of body.sessions) {
                        let termSession = new TermSession();
                        termSession.term = createTerm;
                        termSession.franchise = createTerm.franchise;
    
                        try {
                            termSession = await termSessionRepository.add(termSession);
                        } catch (error: any) {
                            isSuccess = false;
                            errorMessage += error.message;
                        } 
    
                        const plans = session.plans;
                        if (Array.isArray(plans) && plans.length > 0) {
                            for (const plan of plans) {
                                try {
                                    plan.term_session = termSession.id;
                                    plan.franchise = createTerm.franchise;
                                    await termSessionPlanRepository.add(plan);
                                } catch (error: any) {
                                    isSuccess = false;
                                    errorMessage += error.message;
                                }
                            }
                        } 
                    }
                }

                if (isSuccess) {
                    return httpExec.successAction(
                        reqHandler.getAdapter().entityToResponse(createTerm),
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





     async updateDynamic(reqHandler: RequestHandler): Promise<any> {

        return this.getService().updateService(reqHandler, async (jwtData, httpExec, id) => {

            // Get data from the body
            const body = reqHandler.getAdapter().entityFromPutBody();

            const termSessionRepository = await new GenericRepository(TermSession);
            const termSessionPlanRepository = await new GenericRepository(TermSessionPlan);
            
            // Update the entity in the database
            let updateTerm;
            try {
                const updateTermBody = { ...body };
                if (updateTermBody.sessions) {
                    delete updateTermBody.sessions;
                }
                updateTerm = await this.getRepository().update(id!!, updateTermBody, reqHandler.getLogicalDelete());
            } catch (error: any) {
                return await httpExec.databaseError(error.message, jwtData!.id.toString(), reqHandler.getMethod(), this.getControllerName());
            }
            
            let isSuccess = true;
            let errorMessage: any = "";
            
            // Process the sessions
            if (Array.isArray(body.sessions) && body.sessions.length > 0) {
                for (const session of body.sessions) {
                    let termSession;
            
                    if (session.id) {
                        // Retrieve the existing term session
                        try {
                            termSession = await termSessionRepository.findById(session.id, false);
                            if (!termSession) {
                                isSuccess = false;
                                errorMessage += `Term session with id ${session.id} not found. `;
                                continue;
                            }
                        } catch (error: any) {
                            isSuccess = false;
                            errorMessage += `Failed to retrieve session with id ${session.id}: ${error.message} `;
                            continue;
                        }
                    
                        // Delete existing plans for this session
                        try {
                            const deleteMany: FindManyOptions = {
                                where: {
                                    term_session: session.id,
                                }
                            };
                            await termSessionPlanRepository.removeByOptions(deleteMany);
                        } catch (error: any) {
                            isSuccess = false;
                            errorMessage += `Failed to delete plans for session ${session.id}: ${error.message} `;
                            continue;
                        }

                    } else {
                        // Insert a new term session
                        termSession = new TermSession();
                        termSession.term = updateTerm.id;
                        termSession.franchise = updateTerm.franchise;
                    
                        try {
                            termSession = await termSessionRepository.add(termSession);
                        } catch (error: any) {
                            isSuccess = false;
                            errorMessage += `Failed to add new session: ${error.message} `;
                            continue;
                        }
                    }
                    
            
                    // Insert the plans for this session
                    if (Array.isArray(session.plans) && session.plans.length > 0) {
                        for (const plan of session.plans) {
                            try {
                                plan.term_session = termSession.id;
                                plan.franchise = updateTerm.franchise;
                                await termSessionPlanRepository.add(plan);
                            } catch (error: any) {
                                isSuccess = false;
                                errorMessage += `Failed to add plan for session ${termSession.id}: ${error.message} `;
                            }
                        }
                    }
                }
            }
            
            if (isSuccess) {
                return httpExec.successAction(
                    reqHandler.getAdapter().entityToResponse(updateTerm),
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
                    // Repositories for termSession and termSessionPlan
                    const termSessionRepository = await new GenericRepository(TermSession);
                    const termSessionPlanRepository = await new GenericRepository(TermSessionPlan);
    
                    // Fetch term sessions for the entity
                    const termSessionOptions: FindManyOptions = {
                        where: {
                            term: {
                                id: id, 
                            },
                        },
                    };
                  
                    const termSessions = await termSessionRepository.findByOptions(false, true, termSessionOptions);
                   
                    // Add termSessionPlan to each termSession
                    for (const session of termSessions) {
                        const termSessionPlanOptions: FindManyOptions = {
                            where: {
                                term_session: {
                                    id: session.id
                                }
                            }
                        };
                        session.termSessionPlans = await termSessionPlanRepository.findByOptions(false, true, termSessionPlanOptions);
                    }
    
                    // Attach termSessions to entity
                    entity.sessions = termSessions;
    
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
                // Ejecutar la acción de obtener todos los registros en la base de datos
                const entities = await this.getRepository().findAll(
                    reqHandler.getLogicalDelete(),
                    reqHandler.getFilters(),
                    page,
                    size
                );
    
                if (entities != null && entities != undefined && entities.length > 0) {
                    // Repositorios para termSession y termSessionPlan
                    const termSessionRepository = await new GenericRepository(TermSession);
                    const termSessionPlanRepository = await new GenericRepository(TermSessionPlan);
    
                    // Iterar sobre las entidades para agregar sus termSessions y termSessionPlans
                    for (const entity of entities) {
                        // Opciones para buscar termSessions relacionadas
                        const termSessionOptions: FindManyOptions = {
                            where: {
                                term: {
                                    id: entity.id, // Asume que entity tiene una propiedad 'id'
                                },
                            },
                        };
    
                        const termSessions = await termSessionRepository.findByOptions(false, true, termSessionOptions);
    
                        // Agregar termSessionPlans a cada termSession
                        for (const session of termSessions) {
                            const termSessionPlanOptions: FindManyOptions = {
                                where: {
                                    term_session: {
                                        id: session.id,
                                    },
                                },
                            };
                            session.termSessionPlans = await termSessionPlanRepository.findByOptions(
                                false,
                                true,
                                termSessionPlanOptions
                            );
                        }
    
                        // Adjuntar las termSessions al entity
                        entity.sessions = termSessions;
                    }
    
                    // Preparar la respuesta
                    const codeResponse: string =
                        reqHandler.getCodeMessageResponse() != null
                            ? (reqHandler.getCodeMessageResponse() as string)
                            : ConstHTTPRequest.GET_ALL_SUCCESS;
    
                    // Devolver la respuesta exitosa
                    return httpExec.successAction(reqHandler.getAdapter().entitiesToResponse(entities), codeResponse);
                } else {
                    // Si no se encontraron entidades, devolver error dinámico
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS);
                }
            } catch (error: any) {
                // Manejar errores de base de datos
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