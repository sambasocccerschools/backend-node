import { Venue } from "@index/entity/Venue";
import { WeeklyClass } from "@index/entity/WeeklyClass";
import { WeeklyClassFreeTrial } from "@index/entity/WeeklyClassFreeTrial";
import { WeeklyClassMember } from "@index/entity/WeeklyClassMember";
import { ConstHTTPRequest, ConstMessagesJson, ConstStatusJson } from "@TenshiJS/consts/Const";
import { RequestHandler } from "@TenshiJS/generics";
import GenericController from "@TenshiJS/generics/Controller/GenericController";
import GenericRepository from "@TenshiJS/generics/Repository/GenericRepository";
import { In, Not } from "typeorm";

interface WeeklyClassStats {
    id: number;
    member_capacity: number;
    min_age: number;
    max_age: number;
    free_trial_capacity: number;
    remaining_capacity: number;
    total_capacity: number;
    name: string; 
}

export default  class WeeklyClassCapacitiesController extends GenericController{
    constructor() {
        super(Venue);
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

                if (!entities || entities.length === 0) {
                    return httpExec.dynamicError(ConstStatusJson.NOT_FOUND, ConstMessagesJson.DONT_EXISTS);
                }

                const weeklyClassRepository = await new GenericRepository(WeeklyClass);
                const weeklyClassMemberRepository = await new GenericRepository(WeeklyClassMember);
                const weeklyClassFreeTrialRepository = await new GenericRepository(WeeklyClassFreeTrial);


                for (const venue of entities) {
                    const weeklyClasses = await weeklyClassRepository.findByOptions(true, true, {
                        where: {
                            venue: { id: venue.id },
                            is_deleted: false,
                        },
                    });

                    
                  let venueTotalCapacity = 0;
                  let venueBookedCapacity = 0;
                  const weekly_classes: WeeklyClassStats[] = [];
                  for(const weeklyClass of weeklyClasses){
                        // Fetch members filtered by status
                        const filteredMembers = await weeklyClassMemberRepository.findByOptions(true, true, {
                            where: {
                                weekly_class: { id: weeklyClass.id },
                                is_deleted: false,
                                member_status: { slug: Not(In(["pay-pending", "cancelled"])) },
                            },
                        });

                        // Count free trials
                        const freeTrialCount = await weeklyClassFreeTrialRepository.getRepository().count({
                            where: { weekly_class: { id: weeklyClass.id }, is_deleted: false },
                        });

                        // Calculate capacities
                        const totalCapacity = weeklyClass.capacity;
                        const memberCapacity = filteredMembers.length;
                        const remainingCapacity = totalCapacity - (memberCapacity + freeTrialCount);

                        venueTotalCapacity = venueTotalCapacity + weeklyClass.capacity;
                        venueBookedCapacity = (memberCapacity + freeTrialCount + venueBookedCapacity);

                        weekly_classes.push({
                            id: weeklyClass.id,
                            name: weeklyClass.name,
                            min_age: weeklyClass.min_age,
                            max_age: weeklyClass.max_age,
                            member_capacity: memberCapacity,
                            free_trial_capacity: freeTrialCount,
                            remaining_capacity: remainingCapacity,
                            total_capacity: totalCapacity,
                        });
                    }

                    venue.weekly_classes = weekly_classes;
                    venue.total_capacity = venueTotalCapacity;
                    venue.total_booked_capacity = venueBookedCapacity;
                    venue.remaining_capacity = venue.total_capacity - venue.total_booked_capacity;
                }

                return httpExec.successAction(
                    reqHandler.getAdapter().entitiesToResponse(entities),
                    ConstHTTPRequest.GET_ALL_SUCCESS
                );
            } catch (error: any) {
                return httpExec.databaseError(
                    error,
                    jwtData.id.toString(),
                    reqHandler.getMethod(),
                    this.getControllerName()
                );
            }
        });
    }
}