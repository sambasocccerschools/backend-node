import { Uniform } from "@index/entity/Uniform";
import { Request, IAdapterFromBody} from "@modules/index";


export default  class UniformDTO implements IAdapterFromBody{
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    private getEntity (isCreating: Boolean): Uniform{
        const entity = new Uniform();
        entity.title = this.req.body.title;
        entity.description = this.req.body.description;
        entity.price = this.req.body.price;
        entity.url = this.req.body.url;

        if(isCreating){
            entity.created_date = new Date();
        }else{
            entity.is_deleted = this.req.body.is_deleted;
            entity.updated_date = new Date();
        }

        return entity;
    }

    //POST
    entityFromPostBody() : Uniform{
        return this.getEntity(true);
    }

    //PUT
    entityFromPutBody() : Uniform{
        return this.getEntity(false);
    }

    entityToResponse(entity: Uniform) : any{
    
        return  {
            id : entity.id,
            title: entity.title,
            description: entity.description,
            price: entity.price,
            url: entity.url,
            created_date: entity.created_date,
            updated_date: entity.updated_date
        };
    }

    entitiesToResponse(entities: Uniform[] | null): any {
        const response: any[] = [];
    
        if(entities != null){
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        
        return response;
    }
}
