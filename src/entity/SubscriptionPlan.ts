// src/entity/SubscriptionPlan.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Venue } from "./Venue";     
import { Franchise } from "./Franchise"; 
import { UnitDynamicCentral } from "./UnitDynamicCentral"; 

@Entity("subscription_plans")
export class SubscriptionPlan {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: number;

    //SERVICE
    @ManyToOne(() => UnitDynamicCentral, { eager: true })
    @JoinColumn({ name: "service_code", referencedColumnName: "code" })
    service_code: UnitDynamicCentral;

    @ManyToOne(() => Venue, { eager: true })
    @JoinColumn({ name: "venue_id", referencedColumnName: "id" })
    venue_id: Venue;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "int", default: 0 })
    duration: number;

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
