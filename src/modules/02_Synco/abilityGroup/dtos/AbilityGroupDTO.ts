import { AbilityGroup } from "@index/entity/AbilityGroup";
import { Request, IAdapterFromBody} from "@modules/index";


export default  class AbilityGroupDTO implements IAdapterFromBody{
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    //POST
    entityFromPostBody() : AbilityGroup{
        const entity = new AbilityGroup();
        entity.name = this.req.body.name;
        entity.min_age = this.req.body.min_age;
        entity.max_age = this.req.body.max_age;
        entity.service_code = this.req.body.service_code;
        entity.service_package_code = this.req.body.service_package_code;
        //entity.franchise_id = this.req.body.franchise_id;
        entity.created_date = new Date();
        return entity;
    }

    entityToResponse(entity: AbilityGroup) : any{

        return  {
            id : entity.id,
            name: entity.name,
            min_age: entity.min_age,
            max_age: entity.max_age,
            service: entity.service_code ? entity.service_code : null,
            service_package: entity.service_package_code ? entity.service_package_code : null,
            //franchise_id: entity.franchise_id,
            created_date: entity.created_date,
            updated_date: entity.updated_date
        };
    }

  entitiesToResponse(entities: AbilityGroup[] | null): any {
        const response: any[] = [];
    
        if(entities != null){
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        
        return response;
    }
    
    //PUT
    entityFromPutBody() : AbilityGroup{
        return this.entityFromPostBody();
    }
}
