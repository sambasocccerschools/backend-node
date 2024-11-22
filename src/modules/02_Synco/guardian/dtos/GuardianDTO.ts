
import { Guardian } from "@index/entity/Guardian";
import { Request, IAdapterFromBody } from "@modules/index";

export default class GuardianDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): Guardian {
        const entity = new Guardian();
        entity.other_relationship = this.req.body.other_relationship;
        entity.relationship_code = this.req.body.relationship_code;
        entity.referral_source_code = this.req.body.referral_source_code;
        entity.family_id = this.req.body.family_id;
        entity.franchise_id = this.req.body.franchise_id;
     
        if (isCreating) {
            entity.created_date = new Date();
        } else {
            entity.is_deleted = this.req.body.is_deleted;
            entity.updated_date = new Date();
        }

        return entity;
    }

    // POST
    entityFromPostBody(): Guardian {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): Guardian {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: Guardian): any {
        return {
            id: entity.id,
            other_relationship: entity.other_relationship,
            relationship: entity.relationship_code,
            referral_source: entity.referral_source_code,
            family: entity.family_id,
            franchise: entity.franchise_id,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: Guardian[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
