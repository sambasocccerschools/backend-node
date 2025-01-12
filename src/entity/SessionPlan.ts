// src/entity/SubscriptionPlan.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";   
import { Franchise } from "./Franchise"; 
import { UnitDynamicCentral } from "./UnitDynamicCentral"; 
import { SubscriptionPlan } from "./SubscriptionPlan";
import { AbilityGroup } from "./AbilityGroup";

@Entity("session_plans")
export class SessionPlan {
    @PrimaryGeneratedColumn({ type: "int", unsigned: true })
    id: number;

    @Column({ type: "varchar", length: 255 })
    title: string;

    @Column({ type: "varchar", length: 500, nullable: true, default: null })
    description: string;

    @ManyToOne(() => AbilityGroup)
    @JoinColumn({ name: "ability_group", referencedColumnName: "id" })
    ability_group: AbilityGroup;

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
