
import { Request, IAdapterFromBody } from "@modules/index";

export default class WeeklyClassCapacitiesDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    // POST
    entityFromPostBody(): any {
        return null;
    }

    // PUT
    entityFromPutBody(): any {
        return null;
    }

    // GET
    entityToResponse(entity: any): any {
        return {
            id : entity.id,
            name: entity.name,
            weekly_classes: entity.weekly_classes,
            total_capacity: entity.total_capacity,
            total_booked_capacity: entity.total_booked_capacity,
            remaining_capacity: entity.remaining_capacity,
            created_date: entity.created_date,
            updated_date: entity.updated_date
        };
    }

    entitiesToResponse(entities: any[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
