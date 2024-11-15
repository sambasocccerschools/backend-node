// src/entity/SubscriptionPlan.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";   
import { Franchise } from "./Franchise"; 
import { UnitDynamicCentral } from "./UnitDynamicCentral"; 
import { SubscriptionPlan } from "./SubscriptionPlan";

@Entity("subscription_plan_prices")
export class SubscriptionPlanPrice {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: number;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @ManyToOne(() => SubscriptionPlan)
    @JoinColumn({ name: "subscription_plan_id", referencedColumnName: "id" })
    subscription_plan_id: SubscriptionPlan;

    //PAYMENT_TYPES
    @ManyToOne(() => UnitDynamicCentral)
    @JoinColumn({ name: "payment_type_code", referencedColumnName: "code" })
    payment_type_code: UnitDynamicCentral;

    //STUDENT_COVERAGES
    @ManyToOne(() => UnitDynamicCentral)
    @JoinColumn({ name: "student_coverage_code", referencedColumnName: "code" })
    student_coverage_code: UnitDynamicCentral;

    @Column('decimal', { precision: 8, scale: 2, default: 0.00 })
    monthly_subscription_fee: number;

    @Column('decimal', { precision: 8, scale: 2, default: 0.00 })
    price_per_class_per_child: number;

    @Column('decimal', { precision: 8, scale: 2, default: 0.00 })
    one_off_joining_fee: number;

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

