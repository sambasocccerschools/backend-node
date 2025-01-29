
import { WeeklyClassCancellation } from "@index/entity/WeeklyClassCancellation";
import { Request, IAdapterFromBody } from "@modules/index";

export default class WeeklyClassCancellationDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): WeeklyClassCancellation {
        const entity = new WeeklyClassCancellation();
        entity.weekly_class_member = this.req.body.weekly_class_member;
        entity.termination_date = this.req.body.termination_date != null ? this.req.body.termination_date : new Date();
        entity.member_cancel_type = this.req.body.member_cancel_type;
        entity.membership_cancel_reason = this.req.body.membership_cancel_reason;
        entity.member_cancel_status = this.req.body.member_cancel_status;
        entity.additional_notes = this.req.body.additional_notes;
        entity.agent = this.req.body.agent;
        entity.cancelled_by = this.req.body.cancelled_by;
        entity.franchise = this.req.body.franchise;
     
        if (isCreating) {
            entity.created_date = new Date();
            entity.is_deleted = this.req.body.is_deleted;
        } else {
            entity.updated_date = new Date();
        }

        return entity;
    }

    // POST
    entityFromPostBody(): WeeklyClassCancellation {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): WeeklyClassCancellation {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: any): any {
        return {
            id: entity.id,
            weekly_class_member: entity.weekly_class_member,
            termination_date: entity.termination_date,
            member_cancel_type: entity.member_cancel_type,
            membership_cancel_reason: entity.membership_cancel_reason,
            member_cancel_status: entity.member_cancel_status,
            additional_notes: entity.additional_notes,
            venue: entity.venue,
            guardian: entity.guardian,
            total_student: entity.total_student,
            agent: entity.agent,
            cancelled_by: entity.cancelled_by,
            franchise: entity.franchise,
            is_deleted: entity.is_deleted,
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

    weeklyClassesCancellationAssignAgentPostBody(): any{
        const weeklyClassesCancellations = {
            weekly_classes_cancellation_id:this.req.body.weekly_classes_cancellation_id,
            agent_id:this.req.body.agent_id
        };
    
        return weeklyClassesCancellations;
    }


    weeklyClassesCancellationChangeStatusPostBody(): any{
        const weeklyClassesCancellations = {
            weekly_classes_cancellation_id:this.req.body.weekly_classes_cancellation_id,
            member_cancel_status_code:this.req.body.member_cancel_status_code
        };
    
        return weeklyClassesCancellations;
    }
}
