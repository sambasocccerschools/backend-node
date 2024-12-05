import { AbilityGroup } from "@index/entity/AbilityGroup";
import { Request, IAdapterFromBody} from "@modules/index";
import { Franchise } from '@entity/Franchise';


export default  class AbilityGroupDTO implements IAdapterFromBody{
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity (isCreating: Boolean): AbilityGroup{
        const entity = new AbilityGroup();
        entity.name = this.req.body.name;
        entity.min_age = this.req.body.min_age;
        entity.max_age = this.req.body.max_age;
        entity.service = this.req.body.service_code;
        entity.service_package = this.req.body.service_package_code;
        entity.franchise = this.req.body.franchise_id;

        if(isCreating){
            entity.created_date = new Date();
        }else{
            entity.is_deleted = this.req.body.is_deleted;
            entity.updated_date = new Date();
        }
        return entity;
    }

    //POST
    entityFromPostBody() : AbilityGroup{
        return this.getEntity(true);
    }

    entityToResponse(entity: AbilityGroup) : any{

        return  {
            id : entity.id,
            name: entity.name,
            min_age: entity.min_age,
            max_age: entity.max_age,
            service: entity.service ? entity.service : null,
            service_package: entity.service_package ? entity.service_package : null,
            franchise: entity.franchise ? entity.franchise : null, 
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
        return this.getEntity(false);;
    }
}
