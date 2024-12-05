
import { WeeklyClassSale } from "@index/entity/WeeklyClassSale";
import { Request, IAdapterFromBody } from "@modules/index";

export default class WeeklyClassSaleDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): WeeklyClassSale {
        const entity = new WeeklyClassSale();
        entity.start_date = this.req.body.start_date;
        entity.weekly_class_member = this.req.body.weekly_class_member_id;
        entity.weekly_class = this.req.body.weekly_class_id;
        entity.subscription_plan_price = this.req.body.subscription_plan_price_id;
        entity.sale_status = this.req.body.sale_status_code;
        entity.student = this.req.body.student_id;
        entity.agent = this.req.body.agent_id;
        entity.booked_by = this.req.body.booked_by;
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
    entityFromPostBody(): WeeklyClassSale {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): WeeklyClassSale {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: WeeklyClassSale): any {
        return {
            id: entity.id,
            start_date: entity.start_date,
            weekly_class_member: entity.weekly_class_member,
            weekly_class: entity.weekly_class,
            subscription_plan_price: entity.subscription_plan_price,
            sale_status: entity.sale_status,
            student: entity.student,
            agent: entity.agent,
            booked_by: entity.booked_by,
            franchise: entity.franchise,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: WeeklyClassSale[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
