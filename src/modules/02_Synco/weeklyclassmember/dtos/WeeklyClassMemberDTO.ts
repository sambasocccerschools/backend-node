
import { WeeklyClassMember } from "@index/entity/WeeklyClassMember";
import { Request, IAdapterFromBody } from "@modules/index";

export default class WeeklyClassMemberDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): WeeklyClassMember {
        const entity = new WeeklyClassMember();
        entity.weekly_class = this.req.body.weekly_class_id;
        entity.subscription_plan_price = this.req.body.subscription_plan_price_id;
        entity.member_status = this.req.body.member_status_code;
        entity.student = this.req.body.student_id;
        entity.agent = this.req.body.agent_id;
        entity.booked_by = this.req.body.booked_by;
        entity.start_date = this.req.body.start_date;
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
    entityFromPostBody(): WeeklyClassMember {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): WeeklyClassMember {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: any): any {
        return {
            id: entity.id,
            weekly_class: entity.weekly_class,
            subscription_plan_price: entity.subscription_plan_price,
            member_status: entity.member_status,
            student: entity.student,
            //agent: entity.agent_id,
            //booked_by: entity.booked_by,
            agent: entity.agent != null ? entity.agent.id : null,
            booked_by: entity.booked_by != null ? entity.booked_by.id : null,
            start_date: entity.start_date,
            life_cycle_membership: entity.life_cycle_membership,
            franchise: entity.franchise,
            is_deleted: entity.is_deleted,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }


    entitiesToResponse(entities: WeeklyClassMember[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }

    weeklyClassesMemberChangeStatusPostBody(): any{
        const weeklyClassesMembers = {
            weekly_classes_member_id:this.req.body.weekly_classes_member_id,
            member_status_code:this.req.body.member_status_code
        };
    
        return weeklyClassesMembers;
    }
}
