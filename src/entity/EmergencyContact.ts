import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    JoinColumn
} from "typeorm";
import { Family } from "./Family";
import { Franchise } from "./Franchise";
import { UnitDynamicCentral } from "./UnitDynamicCentral";

@Entity("emergency_contacts")
export class EmergencyContact {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: number;

    @Column({ type: "varchar", length: 255 })
    first_name: string;

    @Column({ type: "varchar", length: 255 })
    last_name: string;

    @Column({ type: "varchar", length: 255 })
    phone_number: string;

    // RELATIONSHIPS
    @ManyToOne(() => UnitDynamicCentral, { nullable: true})
    @JoinColumn({ name: "relationship", referencedColumnName: "code" })
    relationship: UnitDynamicCentral | null = null;

    @ManyToOne(() => Family, { nullable: true })
    @JoinColumn({ name: "family", referencedColumnName: "id" })
    family: Family | null;

    @ManyToOne(() => Franchise, { nullable: true })
    @JoinColumn({ name: "franchise", referencedColumnName: "id" })
    franchise: Franchise | null;
  
    @Column({ type: "tinyint", default: 0 })
    is_deleted: boolean;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_date: Date;

    @Column({ type: "datetime", default: null, onUpdate: "CURRENT_TIMESTAMP" })
    updated_date: Date | null;
}
