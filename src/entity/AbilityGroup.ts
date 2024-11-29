// src/entity/UnitDynamicCentral.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { UnitDynamicCentral } from "./UnitDynamicCentral";
import { Franchise } from "./Franchise";

@Entity("ability_group")
export class AbilityGroup {

    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: number;
    
    @Column({ type: "varchar", length: 255})
    name: string;

    @Column({ type: "int", unsigned: true })
    min_age: number;

    @Column({ type: "int", unsigned: true })
    max_age: number;

    @ManyToOne(() => Franchise, { eager: true, nullable: true })
    @JoinColumn({ name: "franchise_id", referencedColumnName: "id" })
    franchise_id: Franchise | null;

    //SERVICES
    @ManyToOne(() => UnitDynamicCentral, { eager: true })
    @JoinColumn({ name: "service_code", referencedColumnName: "code" })
    service_code: UnitDynamicCentral;

    //SERVICE_PACKAGES
    @ManyToOne(() => UnitDynamicCentral, { eager: true })
    @JoinColumn({ name: "service_package_code", referencedColumnName: "code" })
    service_package_code: UnitDynamicCentral;

    @Column({ type: "tinyint", default: 0 })
    is_deleted: boolean;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_date: Date;

    @Column({ type: "datetime", default: null, onUpdate: "CURRENT_TIMESTAMP" })
    updated_date: Date | null;
}
