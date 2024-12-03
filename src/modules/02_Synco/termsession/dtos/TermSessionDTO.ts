
import { TermSession } from "@index/entity/TermSession";
import { Request, IAdapterFromBody } from "@modules/index";
export default class TermSessionDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): TermSession {
        const entity = new TermSession();
        entity.term_id = this.req.body.term_id;
        entity.franchise_id = this.req.body.franchise_id;
     
        if (isCreating) {
            entity.created_date = new Date();
        } else {
            entity.is_deleted = this.req.body.is_deleted;
            entity.updated_date = new Date();
        }

        return entity;
    }

    // POST
    entityFromPostBody(): TermSession {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): TermSession {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: TermSession): any {
        return {
            id: entity.id,
            term_id: entity.term_id,
            franchise_id: entity.franchise_id,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: TermSession[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
