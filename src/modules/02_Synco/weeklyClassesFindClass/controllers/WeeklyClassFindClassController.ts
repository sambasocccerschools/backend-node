import { SubscriptionPlan } from "@index/entity/SubscriptionPlan";
import { SubscriptionPlanPrice } from "@index/entity/SubscriptionPlanPrice";
import { Term } from "@index/entity/Term";
import { UnitDynamicCentral } from "@index/entity/UnitDynamicCentral";
import { Venue } from "@index/entity/Venue";
import { WeeklyClass } from "@index/entity/WeeklyClass";
import { WeeklyClassFreeTrial } from "@index/entity/WeeklyClassFreeTrial";
import { WeeklyClassMember } from "@index/entity/WeeklyClassMember";
import { ConstHTTPRequest, ConstMessagesJson, ConstStatusJson } from "@TenshiJS/consts/Const";
import { FindManyOptions, RequestHandler } from "@TenshiJS/generics";
import GenericController from "@TenshiJS/generics/Controller/GenericController";
import GenericRepository from "@TenshiJS/generics/Repository/GenericRepository";
import { getUrlParam } from "@TenshiJS/utils/generalUtils";
import { In } from "typeorm";

export default  class WeeklyClassFindClassController extends GenericController{
    private filters: FindManyOptions = {};
    constructor() {
        super(Venue);
    }

    async getAll(reqHandler: RequestHandler): Promise<any> {

        return this.getService().getAllService(reqHandler, async (jwtData , httpExec, page: number, size: number) => {
            try {
                this.filters.where = { };
                // Execute the get all action in the database
                const entities = await this.getRepository().findAll(reqHandler.getLogicalDelete(), reqHandler.getFilters(), page, size);
                if(entities != null && entities != undefined){

                    const weeklyClassRepository = await new GenericRepository(WeeklyClass);
                    const weeklyClassMemberRepository = await new GenericRepository(WeeklyClassMember);
                    const weeklyClassFreeTrialRepository = await new GenericRepository(WeeklyClassFreeTrial);
                    const SubscriptionPlanRepository = await new GenericRepository(SubscriptionPlan);
                    const SubscriptionPlanPriceRepository = await new GenericRepository(SubscriptionPlanPrice);
                    const terms = await this.getGroupedTerms();

                    for (const venue of entities) {

                        const days: string | null = getUrlParam("days", reqHandler.getRequest()) || null;
                        if(days != null){
                            const daysArray = days!!.split(",")
                                            .map(field => field.trim())
                                            .filter(field => field); 

                            if (daysArray.length > 0) {
                                this.filters.where = { 
                                    ...this.filters.where, 
                                    days: In(daysArray), 
                                };
                            }
                        }

                        this.filters.where = { 
                            ...this.filters.where, 
                            venue: {
                                id: venue.id
                            },
                        };

                        this.filters.order = {
                            id: 'ASC', 
                        };
                      
                        const findManyOptions: FindManyOptions = {
                            where: {
                                venue: {
                                    id: venue.id
                                }
                            },
                            order: {
                                id: 'ASC', 
                            },
                        };


                        //******************* */
                        //  Weekly Classes 
                        //******************* */
                        const weeklyClasses = await weeklyClassRepository.findByOptions(true, true, this.filters);

                        const groupedClasses: any[] = []; // Inicializar el array vacío

                        for (const weekly_currently of weeklyClasses) {
                            // Obtener el año de summer_term.start_date
                            const year = new Date(weekly_currently.summer_term.start_date).getFullYear();
                        
                            // Buscar el grupo correspondiente al año o crearlo si no existe
                            let yearGroup = groupedClasses.find((group) => group.year === year);
                            if (!yearGroup) {
                                yearGroup = { year, classes: [] };
                                groupedClasses.push(yearGroup);
                            }
                        
                            const countMembers = await weeklyClassMemberRepository.getRepository().count({
                                where: {
                                    weekly_class: { id: parseInt(weekly_currently.id, 10) },
                                    is_deleted: false,
                                },
                            }) || 0;


                            const countMembersFreeTrial = await weeklyClassFreeTrialRepository.getRepository().count({
                                where: {
                                    weekly_class: { id: parseInt(weekly_currently.id, 10) },
                                    is_deleted: false,
                                },
                            }) || 0;

                        
                            // Agregar la clase transformada al grupo correspondiente
                            yearGroup.classes.push({
                                id: parseInt(weekly_currently.id, 10), // Asegúrate de que el ID sea un número
                                name: weekly_currently.name,
                                min_age: weekly_currently.min_age,
                                max_age: weekly_currently.max_age,
                                total_capacity: weekly_currently.capacity,
                                capacity_spaces: weekly_currently.capacity - (countMembers + countMembersFreeTrial),
                                days: weekly_currently.days,
                                start_time: weekly_currently.start_time,
                                end_time: weekly_currently.end_time,
                                is_autumn_indoor: !!weekly_currently.is_autumn_indoor, // Convertir a booleano
                                is_spring_indoor: !!weekly_currently.is_spring_indoor, // Convertir a booleano
                                is_summer_indoor: !!weekly_currently.is_summer_indoor, // Convertir a booleano
                                is_free_trail_dates: !!weekly_currently.is_free_trail_dates, // Convertir a booleano
                                created_at: new Date(weekly_currently.created_date).getTime() / 1000, // Convertir a timestamp en segundos
                                deleted_at: weekly_currently.updated_date ? new Date(weekly_currently.updated_date).getTime() / 1000 : null, // Manejar null si no hay update_date
                            });
                        }
                        
                        venue.classes = groupedClasses;

                        //******************* */
                        //  Subscription Plans
                        //******************* */
                        const subscriptionPlans = await SubscriptionPlanRepository.findByOptions(true, true, findManyOptions);
                        const transformedData = [];
                        for (const subPlan of subscriptionPlans) {
                            const findManySubPlanPrice: FindManyOptions = {
                                where: {
                                    subscription_plan: {
                                        id: subPlan.id,
                                    },
                                },
                                order: {
                                    id: 'ASC',
                                },
                            };
                        
                            const subscriptionPlansPrices = await SubscriptionPlanPriceRepository.findByOptions(
                                true,
                                true,
                                findManySubPlanPrice
                            );

                           
                            for (const price of subscriptionPlansPrices) {
                                const priceName = price.student_coverage.title || 'Unknown Coverage';
                        
                                // Busca el grupo en `transformedData` por priceName
                                let priceGroup : any = transformedData.find((group) => group.priceName === priceName);
                        
                                if (!priceGroup) {
                                    // Si no existe, crea un nuevo grupo
                                    priceGroup = { priceName, plans: [] };
                                    transformedData.push(priceGroup);
                                }
                        
                                // Agrega el plan y su precio al grupo correspondiente
                                priceGroup.plans.push({
                                    plan: {
                                        id: subPlan.id,
                                        name: subPlan.name,
                                    },
                                    price: {
                                        id: price.id,
                                        name: price.name,
                                        payment_type: price.payment_type
                                            ? {
                                                  id: price.payment_type.id,
                                                  name: price.payment_type.title,
                                                  created_at: new Date(price.payment_type.created_date).getTime(),
                                                  deleted_at: price.payment_type.is_deleted ? new Date().getTime() : null,
                                              }
                                            : null,
                                        student_coverage: price.student_coverage
                                            ? {
                                                  id: price.student_coverage.id,
                                                  name: price.student_coverage.title,
                                                  created_at: new Date(price.student_coverage.created_date).getTime(),
                                                  deleted_at: price.student_coverage.is_deleted ? new Date().getTime() : null,
                                              }
                                            : null,
                                        monthly_subscription_fee: `£${price.monthly_subscription_fee}/month`,
                                        price_per_class_per_child: `£${price.price_per_class_per_child}/month`,
                                        one_off_joining_fee: `£${price.one_off_joining_fee}`,
                                        created_at: new Date(price.created_date).getTime(),
                                        deleted_at: price.is_deleted ? new Date().getTime() : null,
                                    },
                                });
                            }
                        }

                        venue.subscriptionPlans = transformedData;
                        venue.terms = terms;
                    }


                    const codeResponse : string = 
                    reqHandler.getCodeMessageResponse() != null ? 
                    reqHandler.getCodeMessageResponse() as string :
                    ConstHTTPRequest.GET_ALL_SUCCESS;
    
                    // Return the success response
                    return httpExec.successAction(
                        reqHandler.getAdapter().entitiesToResponse(entities), 
                        codeResponse);

                }else{
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS);
                }

            } catch (error: any) {
                // Return the database error response
                return await httpExec.databaseError(error, jwtData.id.toString(),
                    reqHandler.getMethod(), this.getControllerName());
            }
        });
    }



    async getGroupedTerms() {
        const termRepository = await new GenericRepository(Term);
    
        // Fetch all terms
        const terms = await termRepository.findByOptions(true, true, null);
    
        // Group and transform the terms data
        const groupedTerms = terms.reduce((acc: any[], term: { start_date: string | number | Date; season: unknown; }) => {
            const year = new Date(term.start_date).getFullYear();
    
            // Find the year group or create a new one
            let yearGroup = acc.find((group: { year: number }) => group.year === year);
            if (!yearGroup) {
                yearGroup = { year, terms: [] };
                acc.push(yearGroup);
            }
    
            // Check if there is already an object with `autumn`, `spring`, and `summer` in this year group
            let termObject = yearGroup.terms[0];
            if (!termObject) {
                termObject = { autumn: null, spring: null, summer: null };
                yearGroup.terms.push(termObject);
            }
    
            // Assign the term to the appropriate season
            const season = term.season as unknown as UnitDynamicCentral;
            if (season?.code === 'AUTUMN') {
                termObject.autumn = term;
            } else if (season?.code === 'SPRING') {
                termObject.spring = term;
            } else if (season?.code === 'SUMMER') {
                termObject.summer = term;
            }
    
            return acc; // Return the accumulated array
        }, []);
    
        return groupedTerms;
    }
    

}