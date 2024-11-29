import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";    
import { Franchise } from "./Franchise"; 
import { User } from "@TenshiJS/entity/User";
import { Student } from "./Student";
import { UnitDynamicCentral } from "./UnitDynamicCentral";
import { SubscriptionPlanPrice } from "./SubscriptionPlanPrice";
import { WeeklyClass } from "./WeeklyClass";

@Entity("weekly_classes_members")
export class WeeklyClassMember {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: number;

    @ManyToOne(() => WeeklyClass, { eager: true })
    @JoinColumn({ name: "weekly_class_id", referencedColumnName: "id" })
    weekly_class_id: WeeklyClass;

    @ManyToOne(() => SubscriptionPlanPrice, { eager: true })
    @JoinColumn({ name: "subscription_plan_price_id", referencedColumnName: "id" })
    subscription_plan_price_id: SubscriptionPlanPrice;

    //Member Status
    @ManyToOne(() => UnitDynamicCentral, { eager: true })
    @JoinColumn({ name: "member_status_code", referencedColumnName: "code" })
    member_status_code: UnitDynamicCentral;

    @ManyToOne(() => Student, { eager: true })
    @JoinColumn({ name: "student_id", referencedColumnName: "id" })
    student_id: Student;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "agent_id", referencedColumnName: "id" })
    agent_id: User | null;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "booked_by", referencedColumnName: "id" })
    booked_by: User | null;

    @Column({ type: "date", nullable: true, default: null })
    start_date: Date | null;

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