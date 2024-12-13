
import { WeeklyClassLead } from "@index/entity/WeeklyClassLead";
import { Request, IAdapterFromBody } from "@modules/index";

export default class WeeklyClassLeadDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): any {

        const weeklyClassLead: Record<string, any> = {
            weekly_class: this.req.body.weekly_class_id,
            lead_status: this.req.body.lead_status_code,
            agent: this.req.body.agent_id,
            booked_by: this.req.body.booked_by,
            franchise: this.req.body.franchise_id,
            guardians: this.req.body.guardians,
            emergency_contacts: this.req.body.emergency_contacts,
            comments: this.req.body.comments,
         };
 
         if (isCreating) {
            weeklyClassLead.created_date = new Date();
         } else {
            weeklyClassLead.is_deleted = this.req.body.is_deleted;
            weeklyClassLead.updated_date = new Date();
         }
 
         return weeklyClassLead;
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
    entityToResponse(entity: any): any {
        return {
            id: entity.id,
            lead_status: entity.lead_status,
            weekly_class: entity.weekly_class,
            guardian: entity.guardian,
            kid_range: entity.kid_range,
            agent: entity.agent,
            booked_by: entity.booked_by,
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

    weeklyClassesLeadsChangeStatusPostBody(): any{
        const weeklyClassesLeads = {
            weekly_classes_lead_id:this.req.body.weekly_classes_lead_id,
            lead_status_code:this.req.body.lead_status_code
        };
    
        return weeklyClassesLeads;
    }

    weeklyClassesLeadsAssignAgentPostBody(): any{
        const weeklyClassesLeads = {
            weekly_classes_lead_id:this.req.body.weekly_classes_lead_id,
            agent_id:this.req.body.agent_id
        };
    
        return weeklyClassesLeads;
    }
}
