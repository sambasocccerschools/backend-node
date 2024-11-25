
import { WeeklyClassWaitingList } from "@index/entity/WeeklyClassWaitingList";
import { Request, IAdapterFromBody } from "@modules/index";

export default class WeeklyClassWaitingListDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): WeeklyClassWaitingList {
        const entity = new WeeklyClassWaitingList();
        entity.weekly_class_id = this.req.body.weekly_class_id;
        entity.subscription_plan_price_id = this.req.body.subscription_plan_price_id;
        entity.waiting_list_status_code = this.req.body.waiting_list_status_code;
        entity.student_id = this.req.body.student_id;
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
    entityFromPostBody(): WeeklyClassWaitingList {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): WeeklyClassWaitingList {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: WeeklyClassWaitingList): any {
        return {
            id: entity.id,
            weekly_class: entity.weekly_class_id,
            subscription_plan_price: entity.subscription_plan_price_id,
            waiting_list_status: entity.waiting_list_status_code,
            student: entity.student_id,
            agent: entity.agent_id,
            booked_by: entity.booked_by,
            franchise: entity.franchise_id,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: WeeklyClassWaitingList[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
