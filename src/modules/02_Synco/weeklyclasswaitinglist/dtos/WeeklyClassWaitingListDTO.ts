
import { WeeklyClassWaitingList } from "@index/entity/WeeklyClassWaitingList";
import { Request, IAdapterFromBody } from "@modules/index";

export default class WeeklyClassWaitingListDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): any {

        const weeklyClassWaitingList: Record<string, any> = {
            weekly_class: this.req.body.weekly_class_id,
            subscription_plan_price: this.req.body.subscription_plan_price_id,
            waiting_list_status: this.req.body.waiting_list_status,
            student: this.req.body.student_id,
            agent: this.req.body.agent_id,
            booked_by: this.req.body.booked_by,
            franchise: this.req.body.franchise_id,
            students: this.req.body.students,
            guardians: this.req.body.guardians,
            emergency_contacts: this.req.body.emergency_contacts,
            comments: this.req.body.comments,
         };
 
         if (isCreating) {
            weeklyClassWaitingList.created_date = new Date();
         } else {
            weeklyClassWaitingList.is_deleted = this.req.body.is_deleted;
            weeklyClassWaitingList.updated_date = new Date();
         }
 
         return weeklyClassWaitingList;
    }

    // POST
    entityFromPostBody(): WeeklyClassWaitingList {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): WeeklyClassWaitingList {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: any): any {
        return {
            id: entity.id,
            weekly_class: entity.weekly_class,
            subscription_plan_price: entity.subscription_plan_price,
            waiting_list_status: entity.waiting_list_status,
            student: entity.student,
            agent: entity.agent != null ? entity.agent.id : null,
            booked_by: entity.booked_by != null ? entity.booked_by.id : null,
            life_cycle_membership: entity.life_cycle_membership,
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


    weeklyClassesWaitingListChangeStatusPostBody(): any{
        const weeklyClassesWaitingList = {
            weekly_classes_waiting_list_id:this.req.body.weekly_classes_waiting_list_id,
            waiting_list_status_code:this.req.body.waiting_list_status_code
        };
    
        return weeklyClassesWaitingList;
    }


    weeklyClassesWaitingListAssignAgentPostBody(): any{
        const weeklyClassesWaitingList = {
            weekly_classes_waiting_list_id:this.req.body.weekly_classes_waiting_list_id,
            agent_id:this.req.body.agent_id
        };
    
        return weeklyClassesWaitingList;
    }
}
