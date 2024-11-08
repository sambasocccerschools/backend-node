import { FindOneOptions, GenericRepository } from "@modules/index";
import { User } from "@TenshiJS/entity/User";
import { AccountStatusEnum } from "@TenshiJS/enums/AccountStatusEnum";

export default class UserRepository extends GenericRepository{

    constructor() {
        super(User);
    }

    async getUserByEmail(entity: any): Promise<User | null> {

        try {
            const user : User = entity;
            const email = user.email;
            const user_name = user.user_name;

            let getEntity : User | null = null;

            if(email != null && email != undefined){
                //find by user and password
                const options: FindOneOptions = { where: { email: email, "is_deleted" : 0, "is_active_from_email": 1, "account_status" : AccountStatusEnum.Active} }; 
                const getEntityEmail : User = await this.getRepository().findOne(options); 
                getEntity = getEntityEmail;
            }
            
            if(getEntity == null){
                if(user_name != null && user_name != undefined){
                    const options: FindOneOptions = { where: { user_name: user_name, "is_deleted" : 0, "is_active_from_email": 1, "account_status" : AccountStatusEnum.Active} }; 
                    getEntity = await this.getRepository().findOne(options); 
                }
            }

            return getEntity ; 

        } catch (error : any) {
            throw error;
        } 
    }

    async getUserByEmailParam(email: string): Promise<User | null> {
        try {
            let options: FindOneOptions = { where: { email: email, "is_deleted" : 0} }; 
            const getEntity = await this.getRepository().findOne(options); 
            return getEntity ; 

        } catch (error : any) {
            throw error;
        } 
    }
}
