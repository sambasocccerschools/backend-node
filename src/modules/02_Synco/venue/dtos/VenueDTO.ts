import { Venue } from "@index/entity/Venue";
import { Request, IAdapterFromBody} from "@modules/index";


export default  class VenueDTO implements IAdapterFromBody{
    req: Request;

    constructor(req: Request) {
        this.req = req;
    }

    //POST
    entityFromPostBody() : Venue{
        const entity = new Venue();
        entity.area = this.req.body.area;
        entity.name = this.req.body.name;
        entity.facility_enter_guide = this.req.body.facility_enter_guide;
        entity.parking_note = this.req.body.parking_note;
        entity.address = this.req.body.address;
        entity.latitude = this.req.body.latitude;
        entity.longitude = this.req.body.longitude;
        entity.has_parking = this.req.body.has_parking;
        entity.has_congestion = this.req.body.has_congestion;
        entity.price = this.req.body.price;
        entity.region_code = this.req.body.region_code;
        //entity.franchise_id = this.req.body.franchise_id;
        entity.created_date = new Date();
        return entity;
    }

    entityToResponse(entity: Venue) : any{

        return  {
            id : entity.id,
            area: entity.area,
            name: entity.name,
            facility_enter_guide: entity.facility_enter_guide,
            parking_note: entity.parking_note,
            address: entity.address,
            latitude: entity.latitude,
            longitude: entity.longitude,
            has_parking: entity.has_parking,
            has_congestion: entity.has_congestion,
            price: entity.price,
            region: entity.region_code ? entity.region_code : null,
            //franchise_id: entity.franchise_id,
            created_date: entity.created_date,
            updated_date: entity.updated_date
        };
    }


/*************  ✨ Codeium Command ⭐  *************/
/**
 * Converts an array of Venue entities into an array of response objects.
 * 
 * @param entities - An array of Venue entities or null.
 * @returns An array of transformed response objects. If the input is null, returns an empty array.
 */
/******  ec88a7a7-675f-43f1-a857-73ec4312ed74  *******/    entitiesToResponse(entities: Venue[] | null): any {
        const response: any[] = [];
    
        if(entities != null){
            for (const entity of entities) {
                response.push(this.entityToResponse(entity));
            }
        }
        
        return response;
    }
    
    //PUT
    entityFromPutBody() : Venue{
        const entity = new Venue();
        entity.area = this.req.body.area;
        entity.name = this.req.body.name;
        entity.facility_enter_guide = this.req.body.facility_enter_guide;
        entity.parking_note = this.req.body.parking_note;
        entity.address = this.req.body.address;
        entity.latitude = this.req.body.latitude;
        entity.longitude = this.req.body.longitude;
        entity.has_parking = this.req.body.has_parking;
        entity.has_congestion = this.req.body.has_congestion;
        entity.price = this.req.body.price;
        entity.region_code = this.req.body.region_code;
        //entity.franchise_id = this.req.body.franchise_id;
        entity.updated_date = new Date();
        return entity;
    }
}
