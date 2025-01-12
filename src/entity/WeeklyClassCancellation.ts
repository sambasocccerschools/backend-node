import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    JoinColumn 
} from "typeorm";
import { UnitDynamicCentral } from "./UnitDynamicCentral";
import { Franchise } from "./Franchise";
import { User } from "@TenshiJS/entity/User";
import { WeeklyClassMember } from "./WeeklyClassMember";

@Entity("weekly_classes_cancellations")
export class WeeklyClassCancellation {
    @PrimaryGeneratedColumn({ type: "int", unsigned: true })
    id: number;

    @ManyToOne(() => WeeklyClassMember)
    @JoinColumn({ name: "weekly_class_member", referencedColumnName: "id" })
    weekly_class_member: WeeklyClassMember;
    
    @Column({ type: "date", nullable: false })
    termination_date: Date;

    @ManyToOne(() => UnitDynamicCentral)
    @JoinColumn({ name: "member_cancel_type", referencedColumnName: "code" })
    member_cancel_type: UnitDynamicCentral;

    @ManyToOne(() => UnitDynamicCentral)
    @JoinColumn({ name: "membership_cancel_reason", referencedColumnName: "code" })
    membership_cancel_reason: UnitDynamicCentral;

    @ManyToOne(() => UnitDynamicCentral)
    @JoinColumn({ name: "member_cancel_status", referencedColumnName: "code" })
    member_cancel_status: UnitDynamicCentral;

    @Column({ type: "text", nullable: true })
    additional_notes: string | null;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "agent", referencedColumnName: "id" })
    agent: User | null;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "cancelled_by", referencedColumnName: "id" })
    cancelled_by: User | null;

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
