import { 
    Entity, 
    Column, 
    ManyToOne, 
    JoinColumn, 
    PrimaryGeneratedColumn
} from "typeorm";
import { Family } from "./Family";
import { Franchise } from "./Franchise";
import { UnitDynamicCentral } from "./UnitDynamicCentral";

@Entity("guardians")
export class Guardian {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    other_relationship: string | null = null;

    // RELATIONSHIPS
    @ManyToOne(() => UnitDynamicCentral, { nullable: true})
    @JoinColumn({ name: "relationship_code", referencedColumnName: "code" })
    relationship_code: UnitDynamicCentral | null = null;

    // REFERRAL SOURCES
    @ManyToOne(() => UnitDynamicCentral, { nullable: true })
    @JoinColumn({ name: "referral_source_code", referencedColumnName: "code" })
    referral_source_code: UnitDynamicCentral | null = null;

    @ManyToOne(() => Family, { nullable: true })
    @JoinColumn({ name: "family_id", referencedColumnName: "id" })
    family_id: Family | null = null;

    @ManyToOne(() => Franchise, { nullable: true })
    @JoinColumn({ name: "franchise_id", referencedColumnName: "id" })
    franchise_id: Franchise | null = null;

    @Column({ type: "tinyint", default: 0 })
    is_deleted: boolean;

    @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
    created_date: Date | null;

    @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_date: Date | null;
}