
import { Guardian } from "@index/entity/Guardian";
import { Request, IAdapterFromBody } from "@modules/index";

export default class GuardianDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): Guardian {
        const entity = new Guardian();
        entity.first_name = this.req.body.first_name;
        entity.last_name = this.req.body.last_name;
        entity.phone_number = this.req.body.phone_number;
        entity.email = this.req.body.email;
        entity.other_relationship = this.req.body.other_relationship;
        entity.relationship = this.req.body.relationship_code;
        entity.referral_source = this.req.body.referral_source_code;
        entity.family = this.req.body.family_id;
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
            first_name: entity.first_name,
            last_name: entity.last_name,
            phone_number: entity.phone_number,
            email: entity.email,
            other_relationship: entity.other_relationship,
            relationship: entity.relationship,
            referral_source: entity.referral_source,
            family: entity.family,
            franchise: entity.franchise,
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
