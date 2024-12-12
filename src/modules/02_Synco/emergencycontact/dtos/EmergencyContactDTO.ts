
import { EmergencyContact } from "@index/entity/EmergencyContact";
import { Request, IAdapterFromBody } from "@modules/index";
import { User } from "@TenshiJS/entity/User";

export default class EmergencyContactDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): EmergencyContact {
        const entity = new EmergencyContact();
        entity.first_name = this.req.body.first_name;
        entity.last_name = this.req.body.last_name;
        entity.phone_number = this.req.body.phone_number;
        entity.relationship = this.req.body.relationship_code;
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
    entityFromPostBody(): EmergencyContact {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): EmergencyContact {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: EmergencyContact): any {
        return {
            id: entity.id,
            first_name: entity.first_name,
            last_name: entity.last_name,
            phone_number: entity.phone_number,
            relationship: entity.relationship,
            family: entity.family,
            franchise: entity.franchise,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: EmergencyContact[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
