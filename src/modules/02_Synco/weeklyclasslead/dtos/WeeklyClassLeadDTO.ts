
import { WeeklyClassLead } from "@index/entity/WeeklyClassLead";
import { Request, IAdapterFromBody } from "@modules/index";

export default class WeeklyClassLeadDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): WeeklyClassLead {
        const entity = new WeeklyClassLead();
        entity.lead_status_code = this.req.body.lead_status_code;
        entity.weekly_class_id = this.req.body.weekly_class_id;
        entity.guardian_id = this.req.body.guardian_id;
        entity.agent_id = this.req.body.agent_id;
        entity.booked_by = this.req.body.booked_by;
        entity.franchise_id = this.req.body.franchise_id;
     
        if (isCreating) {
            entity.created_date = new Date();
        } else {
            entity.updated_date = new Date();
        }

        return entity;
    }

    // POST
    entityFromPostBody(): WeeklyClassLead {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): WeeklyClassLead {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: WeeklyClassLead): any {
        return {
            id: entity.id,
            lead_status_code: entity.lead_status_code,
            weekly_class_id: entity.weekly_class_id,
            guardian_id: entity.guardian_id,
            agent_id: entity.agent_id,
            booked_by: entity.booked_by,
            franchise_id: entity.franchise_id,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: WeeklyClassLead[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
