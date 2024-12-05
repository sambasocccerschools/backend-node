
import { SubscriptionPlan } from "@index/entity/SubscriptionPlan";
import { Request, IAdapterFromBody } from "@modules/index";

export default class SubscriptionPlanDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): SubscriptionPlan {
        const entity = new SubscriptionPlan();
        entity.service = this.req.body.service_code;
        entity.venue = this.req.body.venue_id;
        entity.name = this.req.body.name;
        entity.duration = this.req.body.duration;
        entity.franchise = this.req.body.franchise_id;
     
        if (isCreating) {
            entity.created_date = new Date();
        } else {
            entity.is_deleted = this.req.body.is_deleted;
            entity.updated_date = new Date();
        }

        return entity;
    }

    // POST
    entityFromPostBody(): SubscriptionPlan {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): SubscriptionPlan {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: SubscriptionPlan): any {
        return {
            id: entity.id,
            service: entity.service,
            venue: entity.venue,
            name: entity.name,
            duration: entity.duration,
            franchise: entity.franchise,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: SubscriptionPlan[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
