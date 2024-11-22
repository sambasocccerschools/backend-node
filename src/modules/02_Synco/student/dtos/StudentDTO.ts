
import { Student } from "@index/entity/Student";
import { Request, IAdapterFromBody } from "@modules/index";

export default class StudentDTO implements IAdapterFromBody {
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity(isCreating: boolean): Student {
        const entity = new Student();
        entity.first_name = this.req.body.first_name;
        entity.last_name = this.req.body.last_name;
        entity.dob = this.req.body.dob;
        entity.age = this.req.body.age;
        entity.medical_information = this.req.body.medical_information;
        entity.gender = this.req.body.gender;
        entity.family_id = this.req.body.family_id;
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
    entityFromPostBody(): Student {
        return this.getEntity(true);
    }

    // PUT
    entityFromPutBody(): Student {
        return this.getEntity(false);
    }

    // GET
    entityToResponse(entity: Student): any {
        return {
            id: entity.id,
            first_name: entity.first_name,
            last_name: entity.last_name,
            dob: entity.dob,
            age: entity.age,
            medical_information: entity.medical_information,
            gender: entity.gender,
            family: entity.family_id,
            franchise: entity.franchise_id,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
        };
    }

    entitiesToResponse(entities: Student[] | null): any {
        const response: any[] = [];
        if (entities != null) {
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
