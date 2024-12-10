
import { SessionPlan } from "@index/entity/SessionPlan";
import { Request, IAdapterFromBody } from "@modules/index";

export default class SessionPlanDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): any {

        const entity: Record<string, any> = {
            title : this.req.body.title,
            description : this.req.body.description,
            ability_group : this.req.body.ability_group_id,
            franchise : this.req.body.franchise_id,
            exercises : this.req.body.exercises,
        };

        if (isCreating) {
            entity.created_date = new Date();
        } else {
            entity.is_deleted = this.req.body.is_deleted;
            entity.updated_date = new Date();
        }

        return entity;
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
            id: entity.id,
            title: entity.title,
            description: entity.description,
            ability_group: entity.ability_group,
            exercises : entity.exercises,
            franchise: entity.franchise,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
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
