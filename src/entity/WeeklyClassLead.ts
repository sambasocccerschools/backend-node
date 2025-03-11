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
import { Family } from "./Family";

@Entity("weekly_classes_leads")
export class WeeklyClassLead {
    @PrimaryGeneratedColumn({ type: "int", unsigned: true })
    id: number;

    //LEAD_STATUS
    @ManyToOne(() => UnitDynamicCentral)
    @JoinColumn({ name: "lead_status", referencedColumnName: "code" })
    lead_status: UnitDynamicCentral;

    @ManyToOne(() => WeeklyClass, { eager: true, nullable: true })
    @JoinColumn({ name: "weekly_class", referencedColumnName: "id" })
    weekly_class: WeeklyClass | null;

    @ManyToOne(() => Guardian)
    @JoinColumn({ name: "guardian", referencedColumnName: "id" })
    guardian: Guardian;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "agent", referencedColumnName: "id" })
    agent: User | null;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "booked_by", referencedColumnName: "id" })
    booked_by: User | null;

    @ManyToOne(() => Family, { eager: true, nullable: true })
    @JoinColumn({ name: "family", referencedColumnName: "id" })
    family: Family | null;

    @ManyToOne(() => Franchise, { nullable: true })
    @JoinColumn({ name: "franchise", referencedColumnName: "id" })
    franchise: Franchise | null;

    @Column({ type: "tinyint", default: 0 })
    is_deleted: boolean;

    @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
    created_date: Date | null;

    @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_date: Date | null;
}
