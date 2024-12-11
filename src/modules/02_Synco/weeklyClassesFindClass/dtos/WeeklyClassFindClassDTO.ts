
import { Request, IAdapterFromBody } from "@modules/index";

export default class WeeklyClassFindClassDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): any {
    
        return null;
    }

    // POST
    entityFromPostBody(): any {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): any {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: any): any {
        return {
            id : entity.id,
            area: entity.area,
            name: entity.name,
            facility_enter_guide: entity.facility_enter_guide,
            parking_note: entity.parking_note,
            address: entity.address,
            latitude: entity.latitude,
            longitude: entity.longitude,
            has_parking: entity.has_parking,
            has_congestion: entity.has_congestion,
            price: entity.price,
            region: entity.region ? entity.region : null,
            franchise: entity.franchise ? entity.franchise : null, 
            classes: entity.classes,
            subscriptionPlans: entity.subscriptionPlans,
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
