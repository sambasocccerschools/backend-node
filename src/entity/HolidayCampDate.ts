// src/entity/SubscriptionPlan.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";   
import { Franchise } from "./Franchise"; 
import { UnitDynamicCentral } from "./UnitDynamicCentral"; 

@Entity("holiday_camp_dates")
export class HolidayCampDate {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: number;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: 'date'})
    start_date: Date;

    @Column({type: "date"})
    end_date: Date;

    //CAMP_TYPES
    @ManyToOne(() => UnitDynamicCentral)
    @JoinColumn({ name: "camp_type", referencedColumnName: "code" })
    camp_type: UnitDynamicCentral;

    @ManyToOne(() => Franchise)
    @JoinColumn({ name: "franchise", referencedColumnName: "id" })
    franchise: Franchise | null;

    @Column({ type: "tinyint", default: 0 })
    is_deleted: boolean;

    @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
    created_date: Date | null;

    @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_date: Date | null;
}
