
import { HolidayCampDate } from "@index/entity/HolidayCampDate";
import { Request, IAdapterFromBody } from "@modules/index";

export default class HolidayCampDateDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): HolidayCampDate {
        const entity = new HolidayCampDate();
        entity.name = this.req.body.name;
        entity.start_date = this.req.body.start_date;
        entity.end_date = this.req.body.end_date;
        entity.camp_type = this.req.body.camp_type_code;
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
    entityFromPostBody(): HolidayCampDate {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): HolidayCampDate {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: HolidayCampDate): any {
        return {
            id: entity.id,
            name: entity.name,
            start_date: entity.start_date,
            end_date: entity.end_date,
            camp_type: entity.camp_type,
            franchise: entity.franchise,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: HolidayCampDate[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
