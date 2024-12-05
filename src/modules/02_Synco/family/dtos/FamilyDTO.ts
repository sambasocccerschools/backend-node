
import { Family } from "@index/entity/Family";
import { Request, IAdapterFromBody } from "@modules/index";

export default class FamilyDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): Family {
        const entity = new Family();
        entity.loyalty_points = this.req.body.loyalty_points;
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
    entityFromPostBody(): Family {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): Family {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: Family): any {
        return {
            id: entity.id,
            loyalty_points: entity.loyalty_points,
            franchise: entity.franchise,
            is_deleted: entity.is_deleted,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: Family[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
