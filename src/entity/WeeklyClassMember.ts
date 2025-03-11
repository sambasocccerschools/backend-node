import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";    
import { Franchise } from "./Franchise"; 
import { User } from "@TenshiJS/entity/User";
import { Student } from "./Student";
import { UnitDynamicCentral } from "./UnitDynamicCentral";
import { SubscriptionPlanPrice } from "./SubscriptionPlanPrice";
import { WeeklyClass } from "./WeeklyClass";
import { Family } from "./Family";

@Entity("weekly_classes_members")
export class WeeklyClassMember {
    @PrimaryGeneratedColumn({ type: "int", unsigned: true })
    id: number;

    @ManyToOne(() => WeeklyClass, { eager: true })
    @JoinColumn({ name: "weekly_class", referencedColumnName: "id" })
    weekly_class: WeeklyClass;

    @ManyToOne(() => SubscriptionPlanPrice, { eager: true })
    @JoinColumn({ name: "subscription_plan_price", referencedColumnName: "id" })
    subscription_plan_price: SubscriptionPlanPrice;

    //Member Status
    @ManyToOne(() => UnitDynamicCentral)
    @JoinColumn({ name: "member_status", referencedColumnName: "code" })
    member_status: UnitDynamicCentral;

    @ManyToOne(() => Student)
    @JoinColumn({ name: "student", referencedColumnName: "id" })
    student: Student;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "agent", referencedColumnName: "id" })
    agent: User | null;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "booked_by", referencedColumnName: "id" })
    booked_by: User | null;

    @Column({ type: "date", nullable: true, default: null })
    start_date: Date | null;

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