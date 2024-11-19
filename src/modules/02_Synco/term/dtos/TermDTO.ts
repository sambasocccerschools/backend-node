
import { Term } from "@index/entity/Term";
import { Request, IAdapterFromBody } from "@modules/index";

export default class TermDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): Term {
        const entity = new Term();
        entity.name = this.req.body.name;
        entity.start_date = this.req.body.start_date;
        entity.end_date = this.req.body.end_date;
        entity.half_term_date = this.req.body.half_term_date;
        entity.season_code = this.req.body.season_code;
        entity.franchise_id = this.req.body.franchise_id;
     
        if (isCreating) {
            entity.created_date = new Date();
        } else {
            entity.updated_date = new Date();
        }

        return entity;
    }

    // POST
    entityFromPostBody(): Term {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): Term {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: Term): any {
        return {
            id: entity.id as number,
            name: entity.name,
            start_date: entity.start_date,
            end_date: entity.end_date,
            half_term_date: entity.half_term_date,
            season: entity.season_code,
            franchise: entity.franchise_id,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: Term[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
