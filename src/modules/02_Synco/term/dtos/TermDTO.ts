
import { Term } from "@index/entity/Term";
import { Request, IAdapterFromBody } from "@modules/index";

export default class TermDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): any {

        const term: Record<string, any> = {
            name : this.req.body.name,
            start_date : this.req.body.start_date,
            end_date : this.req.body.end_date,
            half_term_date : this.req.body.half_term_date,
            season : this.req.body.season_code,
            franchise : this.req.body.franchise_id,
            sessions: this.req.body.sessions
        };

        if (isCreating) {
            term.created_date = new Date();
        } else {
            term
            term.is_deleted = this.req.body.is_deleted;
            term.updated_date = new Date();
        }

        return term;
    }

    // POST
    entityFromPostBody(): any {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): Term {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: any): any {
        return {
            id: entity.id as number,
            name: entity.name,
            start_date: entity.start_date,
            end_date: entity.end_date,
            half_term_date: entity.half_term_date,
            season: entity.season,
            franchise: entity.franchise,
            sessions: entity.sessions,
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
}
