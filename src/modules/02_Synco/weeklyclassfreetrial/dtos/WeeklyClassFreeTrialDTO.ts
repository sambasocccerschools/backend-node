
import { Request, IAdapterFromBody } from "@modules/index";

export default class WeeklyClassFreeTrialDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): any {

        const weeklyClassFreeTrial: Record<string, any> = {
            weekly_class: this.req.body.weekly_class_id,
            free_trial_status: this.req.body.free_trial_status_code,
            agent: this.req.body.agent_id,
            booked_by: this.req.body.booked_by,
            trial_date: this.req.body.trial_date,
            family: this.req.body.family_id,
            franchise: this.req.body.franchise_id,
            student: this.req.body.student_id,
            students: this.req.body.students,
            guardians: this.req.body.guardians,
            emergency_contacts: this.req.body.emergency_contacts,
            comments: this.req.body.comments,
         };
 
         if (isCreating) {
            weeklyClassFreeTrial.created_date = new Date();
         } else {
            weeklyClassFreeTrial.is_deleted = this.req.body.is_deleted;
            weeklyClassFreeTrial.updated_date = new Date();
         }
 
         return weeklyClassFreeTrial;
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
            weekly_class: entity.weekly_class,
            free_trial_status: entity.free_trial_status,
            student: entity.student,
            guardian: entity.guardian,
            agent: entity.agent,
            booked_by: entity.booked_by,
            trial_date: entity.trial_date,
            attempt: entity.attempt,
            family: entity.family,
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


    weeklyClassesFreeTrialChangeStatusPostBody(): any{
        const weeklyClassesFreeTrials = {
            weekly_classes_free_trial_id:this.req.body.weekly_classes_free_trial_id,
            free_trial_status_code:this.req.body.free_trial_status_code
        };
    
        return weeklyClassesFreeTrials;
    }

    weeklyClassesFreeTrialAssignAgentPostBody(): any{
        const weeklyClassesFreeTrials = {
            weekly_classes_free_trial_id:this.req.body.weekly_classes_free_trial_id,
            agent_id:this.req.body.agent_id
        };
    
        return weeklyClassesFreeTrials;
    }
}
