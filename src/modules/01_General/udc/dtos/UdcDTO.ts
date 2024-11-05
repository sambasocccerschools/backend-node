import { Request, IAdapterFromBody } from "@modules/index";
import { UnitDynamicCentral } from '@index/modules/01_General/udc';

export default  class UdcDTO implements IAdapterFromBody{
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    //POST
    entityFromPostBody() : UnitDynamicCentral{
        const entity = new UnitDynamicCentral();
        entity.code = this.req.body.code;
        entity.type = this.req.body.type;
        entity.title = this.req.body.title;
        entity.title_es = this.req.body.title_es;
        entity.slug = this.req.body.slug;
        entity.father_code = this.req.body.father_code;
        entity.value1 = this.req.body.value1;
        entity.value2 = this.req.body.value2;
        entity.created_date = new Date();
        return entity;
    }

    entityToResponse(entity: UnitDynamicCentral) : any{
    
        return  {
            id : entity.id,
            code: entity.code,
            type: entity.type,
            title: entity.title,
            title_es: entity.title_es,
            slug: entity.slug,
            father_code: entity.father_code,
            value1: entity.value1,
            value2: entity.value2,
            created_date: entity.created_date,
            updated_date: entity.updated_date,
            user_updated_id: entity.user_updated_id
        };
    }

    entitiesToResponse(entities: UnitDynamicCentral[] | null): any {
        const response: any[] = [];
    
        if(entities != null){
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        
        return response;
    }
    
    //PUT
    entityFromPutBody() : UnitDynamicCentral{
        const entity = new UnitDynamicCentral();
        entity.type = this.req.body.type;
        entity.title = this.req.body.title;
        entity.title_es = this.req.body.title_es;
        entity.slug = this.req.body.slug;
        entity.father_code = this.req.body.father_code;
        entity.value1 = this.req.body.value1;
        entity.value2 = this.req.body.value2;
        entity.updated_date = new Date();
        entity.user_updated_id = this.req.body.user_updated_id;
        return entity;
    }
}
