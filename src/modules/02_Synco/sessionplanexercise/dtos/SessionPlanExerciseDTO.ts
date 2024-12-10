
import { SessionPlanExercise } from "@index/entity/SessionPlanExercise";
import { Request, IAdapterFromBody } from "@modules/index";

export default class SessionPlanExerciseDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): SessionPlanExercise {
        const entity = new SessionPlanExercise();
        entity.session_plan = this.req.body.session_plan;
        entity.title = this.req.body.title;
        entity.subtitle = this.req.body.subtitle;
        entity.title_duration = this.req.body.title_duration;
        entity.description = this.req.body.description;
        entity.franchise = this.req.body.franchise;
        entity.banner_url = this.req.body.banner_url;
        entity.video_url = this.req.body.video_url;
     
        if (isCreating) {
            entity.created_date = new Date();
        } else {
            entity.updated_date = new Date();
        }

        return entity;
    }

    // POST
    entityFromPostBody(): SessionPlanExercise {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): SessionPlanExercise {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: SessionPlanExercise): any {
        return {
            id: entity.id,
            session_plan: entity.session_plan,
            title: entity.title,
            subtitle: entity.subtitle,
            title_duration: entity.title_duration,
            description: entity.description,
            banner_url: entity.banner_url,
            video_url: entity.video_url,
            franchise: entity.franchise,
            is_deleted: entity.is_deleted,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: SessionPlanExercise[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
