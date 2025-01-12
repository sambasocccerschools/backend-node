// src/entity/SubscriptionPlan.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Venue } from "./Venue";     
import { Franchise } from "./Franchise"; 
import { UnitDynamicCentral } from "./UnitDynamicCentral"; 

@Entity("subscription_plans")
export class SubscriptionPlan {
    @PrimaryGeneratedColumn({ type: "int", unsigned: true })
    id: number;

    //SERVICE
    @ManyToOne(() => UnitDynamicCentral, { eager: true })
    @JoinColumn({ name: "service", referencedColumnName: "code" })
    service: UnitDynamicCentral;

    @ManyToOne(() => Venue)
    @JoinColumn({ name: "venue", referencedColumnName: "id" })
    venue: Venue;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "int", default: 0 })
    duration: number;

    @ManyToOne(() => Franchise, {  nullable: true })
    @JoinColumn({ name: "franchise", referencedColumnName: "id" })
    franchise: Franchise | null;

    @Column({ type: "tinyint", default: 0 })
    is_deleted: boolean;

    @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
    created_date: Date | null;

    @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_date: Date | null;
}
