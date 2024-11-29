import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    JoinColumn 
} from "typeorm";
import { WeeklyClass } from "./WeeklyClass";
import { UnitDynamicCentral } from "./UnitDynamicCentral";
import { Guardian } from "./Guardian";
import { Franchise } from "./Franchise";
import { User } from "@TenshiJS/entity/User";

@Entity("weekly_classes_leads")
export class WeeklyClassLead {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: number;

    //LEAD_STATUS
    @ManyToOne(() => UnitDynamicCentral, { eager: true })
    @JoinColumn({ name: "lead_status_code", referencedColumnName: "code" })
    lead_status_code: UnitDynamicCentral;

    @ManyToOne(() => WeeklyClass, { eager: true, nullable: true })
    @JoinColumn({ name: "weekly_class_id", referencedColumnName: "id" })
    weekly_class_id: WeeklyClass | null;

    @ManyToOne(() => Guardian, { eager: true })
    @JoinColumn({ name: "guardian_id", referencedColumnName: "id" })
    guardian_id: Guardian;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "agent_id", referencedColumnName: "id" })
    agent_id: User | null;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "booked_by", referencedColumnName: "id" })
    booked_by: User | null;

    @ManyToOne(() => Franchise, { eager: true, nullable: true })
    @JoinColumn({ name: "franchise_id", referencedColumnName: "id" })
    franchise_id: Franchise | null;

    @Column({ type: "tinyint", default: 0 })
    is_deleted: boolean;

    @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
    created_date: Date | null;

    @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_date: Date | null;
}
