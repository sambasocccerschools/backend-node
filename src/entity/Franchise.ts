// src/entity/UnitDynamicCentral.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { UnitDynamicCentral } from "./UnitDynamicCentral";
import { User } from "@TenshiJS/entity/User";

@Entity("franchises")
export class Franchise {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: number;
    
    @Column({ type: "varchar", length: 255 })
    first_name: string;

    @Column({ type: "varchar", length: 255 })
    last_name: string;

    @Column({ type: "datetime", nullable: true, default: null  })
    dob: Date | null;

    @Column({ type: "int", nullable: true, default: null  })
    age: number | null;

    @Column({ type: "varchar", length: 255  })
    phone_number: string;

    @Column({ type: "varchar", length: 255  })
    email: string;
  
    @Column({ type: "varchar", length: 30, nullable: true, default: null  })
    postal_code: string;

    @Column({ type: "varchar", length: 400 })
    location: string;

    @Column({ type: "int", default: 0 })
    liquid_capacity: number;

    @Column({ type: "varchar", length: 500, nullable: true, default: null  })
    message: string;

    //REFERRAL_SOURCES
    @ManyToOne(() => UnitDynamicCentral, { eager: true })
    @JoinColumn({ name: "referral_source_code", referencedColumnName: "code" })
    referral_source_code: UnitDynamicCentral;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "added_by", referencedColumnName: "id", })
    added_by: User | null = null;

    @Column({ type: "tinyint", default: 0 })
    is_deleted: boolean;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_date: Date;

    @Column({ type: "datetime", default: null, onUpdate: "CURRENT_TIMESTAMP" })
    updated_date: Date | null;
}
