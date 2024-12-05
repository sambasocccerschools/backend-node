
import { TermSessionPlan } from "@index/entity/TermSessionPlan";
import { Request, IAdapterFromBody } from "@modules/index";

export default class TermSessionPlanDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): TermSessionPlan {
        const entity = new TermSessionPlan();
        entity.term_session = this.req.body.term_session_id;
        entity.ability_group = this.req.body.ability_group_id;
        entity.session_plan = this.req.body.session_plan_id;
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
    entityFromPostBody(): TermSessionPlan {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): TermSessionPlan {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: TermSessionPlan): any {
        return {
            
            id: entity.id,
            term_session: entity.term_session,
            ability_group: entity.ability_group,
            session_plan: entity.session_plan,
            franchise: entity.franchise,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: TermSessionPlan[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
