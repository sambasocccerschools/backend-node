import { Franchise } from "@index/entity/Franchise";
import { Request, IAdapterFromBody} from "@modules/index";
import { User } from "@TenshiJS/entity/User";


export default  class FranchiseDTO implements IAdapterFromBody{
    req: Request;
    userId: string;

    constructor(req: Request, userId: string | null = null) {
        this.req = req;
        if(userId != null){
            this.userId = userId;
        }
    }

    private getEntity (isCreating: Boolean): Franchise{
        const entity = new Franchise();
        entity.first_name = this.req.body.first_name;
        entity.last_name = this.req.body.last_name;
        entity.phone_number = this.req.body.phone_number;
        entity.email = this.req.body.email;
        entity.dob = this.req.body.dob;
        entity.age = this.req.body.age;
        entity.postal_code = this.req.body.postal_code;
        entity.message = this.req.body.message;
        entity.location = this.req.body.location;
        entity.liquid_capacity = this.req.body.liquid_capacity;
        entity.referral_source_code = this.req.body.referral_source_code;

        //insert user 
        const user = new User(); 
        user.id = this.userId;
        entity.added_by =  user;

        if(isCreating){
            entity.created_date = new Date();
        }else{
            entity.is_deleted = this.req.body.is_deleted;
            entity.updated_date = new Date();
        }

        return entity;
    }

    //POST
    entityFromPostBody() : Franchise{
        return this.getEntity(true);
    }

     //PUT
     entityFromPutBody() : Franchise{
        return this.getEntity(false);
    }

    //GET
    entityToResponse(entity: Franchise) : any{
        return  {
            id : entity.id,
            first_name: entity.first_name,
            last_name: entity.last_name,
            phone_number: entity.phone_number,
            email: entity.email,
            dob: entity.dob,
            age: entity.age,
            postal_code: entity.postal_code,
            message: entity.message,
            location: entity.location,
            liquid_capacity: entity.liquid_capacity,
            referral_source_code: entity.referral_source_code,
            //i DONT WANT TO SHOW ALL INFORMATION
            //added_by: entity.added_by,
            added_by: entity.added_by != null ? entity.added_by.id : null,
            created_date: entity.created_date,
            updated_date: entity.updated_date
        };
    }

  entitiesToResponse(entities: Franchise[] | null): any {
        const response: any[] = [];
    
        if(entities != null){
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        return response;
    }
}
