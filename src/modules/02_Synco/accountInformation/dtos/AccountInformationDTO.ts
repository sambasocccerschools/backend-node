
import { Family } from "@index/entity/Family";
import { Request, IAdapterFromBody } from "@modules/index";

export default class AccountInformationDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    // POST
    entityFromPostBody(): any {
        return null;
    }

    // PUT
    entityFromPutBody(): any {
        return null;
    }

    // GET
    entityToResponse(entity: any): any {
        return {
            id: entity.id,
            guardians: entity.guardians,
            students: entity.students,
            emergency_contacts: entity.emergency_contacts,
            comments: entity.comments,
            service_history: entity.service_history,
            feedbacks: entity.feedbacks,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: Family[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
