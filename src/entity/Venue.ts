// src/entity/UnitDynamicCentral.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { UnitDynamicCentral } from "./UnitDynamicCentral";

@Entity("venues")
export class Venue {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column({ type: "varchar", length: 255, nullable: true, default: null })
    area: string;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "varchar", length: 500, nullable: true, default: null  })
    facility_enter_guide: string;

    @Column({ type: "varchar", length: 500, nullable: true, default: null  })
    parking_note: string;

    @Column({ type: "varchar", length: 500, nullable: true, default: null  })
    address: string;

    @Column({ type: "decimal", precision: 11, scale: 8 })
    latitude: number | null;
  
    @Column({ type: "decimal", precision: 11, scale: 8  })
    longitude: number | null;

    @Column({ type: "tinyint", default: 1 })
    has_parking: boolean;

    @Column({ type: "tinyint", default: 1 })
    has_congestion: boolean;

    @Column('decimal', { precision: 10, scale: 2, nullable: true, default: null  })
    price: number;

    @Column({ type: "tinyint", default: 0 })
    is_deleted: boolean;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_date: Date;

    @Column({ type: "datetime", default: null, onUpdate: "CURRENT_TIMESTAMP" })
    updated_date: Date | null;

    /*@ManyToOne(() => Franchise, (franchise) => franchise.code)
    @JoinColumn({ name: "franchise_id" })
    franchise_id: Franchise;*/

    @ManyToOne(() => UnitDynamicCentral)
    @JoinColumn({ name: "region_code", referencedColumnName: "code" })
    region_code: UnitDynamicCentral;
}
