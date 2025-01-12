import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    JoinColumn
} from "typeorm";
import { Family } from "./Family";
import { Franchise } from "./Franchise";
import { User } from "@TenshiJS/entity/User";

@Entity("account_information_comments")
export class AccountInformationComment {
    @PrimaryGeneratedColumn({ type: "int", unsigned: true })
    id: number;

    @Column({ type: "varchar", length: 500 })
    message: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "user", referencedColumnName: "id" })
    user: User | null;

    @ManyToOne(() => Family, { nullable: true })
    @JoinColumn({ name: "family", referencedColumnName: "id" })
    family: Family | null;

    @ManyToOne(() => Franchise, { nullable: true })
    @JoinColumn({ name: "franchise", referencedColumnName: "id" })
    franchise: Franchise | null;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_date: Date;

    @Column({ type: "datetime", default: null, onUpdate: "CURRENT_TIMESTAMP" })
    updated_date: Date | null;
}
