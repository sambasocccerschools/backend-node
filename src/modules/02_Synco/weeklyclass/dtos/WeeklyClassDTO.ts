
import { WeeklyClass } from "@index/entity/WeeklyClass";
import { Request, IAdapterFromBody } from "@modules/index";

export default class WeeklyClassDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): WeeklyClass {
        const entity = new WeeklyClass();
        entity.venue = this.req.body.venue_id;
        entity.name = this.req.body.name;
        entity.min_age = this.req.body.min_age;
        entity.max_age = this.req.body.max_age;
        entity.capacity = this.req.body.capacity;
        entity.days = this.req.body.days;
        entity.start_time = this.req.body.start_time;
        entity.end_time = this.req.body.end_time;
        entity.autumn_term = this.req.body.autumn_term_id;
        entity.is_autumn_indoor = this.req.body.is_autumn_indoor;
        entity.spring_term = this.req.body.spring_term_id;
        entity.is_spring_indoor = this.req.body.is_spring_indoor;
        entity.summer_term = this.req.body.summer_term_id;
        entity.is_summer_indoor = this.req.body.is_summer_indoor;
        entity.is_free_trail_dates = this.req.body.is_free_trail_dates;
        entity.free_trial_dates = this.req.body.free_trial_dates;
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
    entityFromPostBody(): WeeklyClass {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): WeeklyClass {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: WeeklyClass): any {
        return {
            id: entity.id,
            venue: entity.venue,
            name: entity.name,
            min_age: entity.min_age,
            max_age: entity.max_age,
            capacity: entity.capacity,
            days: entity.days,
            start_time: entity.start_time,
            end_time: entity.end_time,
            autumn_term: entity.autumn_term,
            is_autumn_indoor: entity.is_autumn_indoor,
            spring_term: entity.spring_term,
            is_spring_indoor: entity.is_spring_indoor,
            summer_term: entity.summer_term,
            is_summer_indoor: entity.is_summer_indoor,
            is_free_trail_dates: entity.is_free_trail_dates,
            free_trial_dates: entity.free_trial_dates,
            franchise: entity.franchise,
            is_deleted: entity.is_deleted,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: WeeklyClass[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
