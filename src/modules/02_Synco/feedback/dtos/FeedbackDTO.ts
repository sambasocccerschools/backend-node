
import { Feedback } from "@index/entity/Feedback";
import { Request, IAdapterFromBody } from "@modules/index";

export default class FeedbackDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): Feedback {
        const entity = new Feedback();
        entity.weekly_class = this.req.body.weekly_class_id;
        entity.feedback_type = this.req.body.feedback_type_code;
        entity.feedback_category = this.req.body.feedback_category_code;
        entity.other_feedback_category = this.req.body.other_feedback_category;
        entity.feedback_status = this.req.body.feedback_status_code;
        entity.agent = this.req.body.agent_id;
        entity.reported_by = this.req.body.reported_by;
        entity.additional_notes = this.req.body.additional_notes;
        entity.franchise = this.req.body.franchise_id;
        entity.family = this.req.body.family_id;
     
        if (isCreating) {
            entity.created_date = new Date();
        } else {
            entity.is_deleted = this.req.body.is_deleted;
            entity.updated_date = new Date();
        }

        return entity;
    }

    // POST
    entityFromPostBody(): Feedback {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): Feedback {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: Feedback): any {
        return {
            id: entity.id,
            weekly_class: entity.weekly_class,
            feedback_type: entity.feedback_type,
            feedback_category: entity.feedback_category,
            other_feedback_category: entity.other_feedback_category,
            feedback_status: entity.feedback_status,
            agent: entity.agent,
            reported_by: entity.reported_by,
            additional_notes: entity.additional_notes,
            franchise: entity.franchise,
            family: entity.family,
            is_deleted: entity.is_deleted,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: Feedback[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }


    feedbackAssignAgentPostBody(): any{
        const feedbacks = {
            feedbacks_id:this.req.body.feedbacks_id,
            agent_id:this.req.body.agent_id
        };
        return feedbacks;
    }


    feedbackChangeStatusPostBody(): any{
        const Feedbacks = {
            feedbacks_id:this.req.body.feedbacks_id,
            feedback_status_code:this.req.body.feedback_status_code
        };
    
        return Feedbacks;
    }
}
