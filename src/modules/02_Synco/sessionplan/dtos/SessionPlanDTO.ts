
import { SessionPlan } from "@index/entity/SessionPlan";
import { Request, IAdapterFromBody } from "@modules/index";

export default class SessionPlanDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): SessionPlan {
        const entity = new SessionPlan();
        entity.title = this.req.body.title;
        entity.description = this.req.body.description;
        entity.ability_group = this.req.body.ability_group_id;
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
    entityFromPostBody(): SessionPlan {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): SessionPlan {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: SessionPlan): any {
        return {
            id: entity.id,
            title: entity.title,
            description: entity.description,
            ability_group: entity.ability_group,
            franchise: entity.franchise,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: SessionPlan[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
