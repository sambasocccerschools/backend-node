import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    JoinColumn 
} from "typeorm";
import { WeeklyClassMember } from "./WeeklyClassMember";
import { WeeklyClass } from "./WeeklyClass";
import { SubscriptionPlanPrice } from "./SubscriptionPlanPrice";
import { Student } from "./Student";

import { Franchise } from "./Franchise";
import { User } from "@TenshiJS/entity/User";
import { UnitDynamicCentral } from "./UnitDynamicCentral";

@Entity("weekly_classes_sales")
export class WeeklyClassSale {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: number;

    @Column({ type: "date", nullable: true, default: null })
    start_date: string | null;

    @ManyToOne(() => WeeklyClassMember)
    @JoinColumn({ name: "weekly_class_member_id", referencedColumnName: "id" })
    weekly_class_member_id: WeeklyClassMember;

    @ManyToOne(() => WeeklyClass)
    @JoinColumn({ name: "weekly_class_id", referencedColumnName: "id" })
    weekly_class_id: WeeklyClass;

    @ManyToOne(() => SubscriptionPlanPrice)
    @JoinColumn({ name: "subscription_plan_price_id", referencedColumnName: "id" })
    subscription_plan_price_id: SubscriptionPlanPrice;

    //Sale Status
    @ManyToOne(() => UnitDynamicCentral)
    @JoinColumn({ name: "sale_status_code", referencedColumnName: "code" })
    sale_status_code: UnitDynamicCentral;

    @ManyToOne(() => Student)
    @JoinColumn({ name: "student_id", referencedColumnName: "id" })
    student_id: Student;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "agent_id", referencedColumnName: "id" })
    agent_id: User | null;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "booked_by", referencedColumnName: "id" })
    booked_by: User | null;

    @ManyToOne(() => Franchise, { nullable: true })
    @JoinColumn({ name: "franchise_id", referencedColumnName: "id" })
    franchise_id: Franchise | null;

    @Column({ type: "tinyint", default: 0 })
    is_deleted: boolean;

    @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
    created_date: Date | null;

    @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_date: Date | null;
}
