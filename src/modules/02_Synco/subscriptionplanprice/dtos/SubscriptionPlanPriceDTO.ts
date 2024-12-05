
import { SubscriptionPlanPrice } from "@index/entity/SubscriptionPlanPrice";
import { Request, IAdapterFromBody } from "@modules/index";

export default class SubscriptionPlanPriceDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): SubscriptionPlanPrice {
        const entity = new SubscriptionPlanPrice();
        entity.name = this.req.body.name;
        entity.subscription_plan = this.req.body.subscription_plan_id;
        entity.payment_type = this.req.body.payment_type_code;
        entity.student_coverage = this.req.body.student_coverage_code;
        entity.monthly_subscription_fee = this.req.body.monthly_subscription_fee;
        entity.price_per_class_per_child = this.req.body.price_per_class_per_child;
        entity.one_off_joining_fee = this.req.body.one_off_joining_fee;
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
    entityFromPostBody(): SubscriptionPlanPrice {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): SubscriptionPlanPrice {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: SubscriptionPlanPrice): any {
        return {
            id: entity.id,
            name: entity.name,
            subscription_plan: entity.subscription_plan,
            payment_type: entity.payment_type,
            student_coverage: entity.student_coverage,
            monthly_subscription_fee: entity.monthly_subscription_fee,
            price_per_class_per_child: entity.price_per_class_per_child,
            one_off_joining_fee: entity.one_off_joining_fee,
            franchise: entity.franchise,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: SubscriptionPlanPrice[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
