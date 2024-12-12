
import { AccountInformationComment } from "@index/entity/AccountInformationComment";
import { Request, IAdapterFromBody } from "@modules/index";

export default class AccountInformationCommentDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): AccountInformationComment {
        const entity = new AccountInformationComment();
        entity.message = this.req.body.message;
        entity.user = this.req.body.user_id;
        entity.family = this.req.body.family_id;
        entity.franchise = this.req.body.franchise_id;
     
        if (isCreating) {
            entity.created_date = new Date();
        } else {
            entity.updated_date = new Date();
        }

        return entity;
    }

    // POST
    entityFromPostBody(): AccountInformationComment {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): AccountInformationComment {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: AccountInformationComment): any {
        return {
            id: entity.id,
            message: entity.message,
            user: entity.user,
            family: entity.family,
            franchise: entity.franchise,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: AccountInformationComment[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
