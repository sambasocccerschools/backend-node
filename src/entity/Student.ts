import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Franchise } from "./Franchise";
import { Family } from "./Family";

@Entity("students")
export class Student {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: number;

    @Column({ type: "varchar", length: 255 })
    first_name: string;

    @Column({ type: "varchar", length: 255 })
    last_name: string;

    @Column({ type: "date", nullable: true, default: null })
    dob: Date | null;

    @Column({ type: "int" })
    age: number;

    @Column({ type: "text", nullable: true, default: null })
    medical_information: string | null;

    @Column({ type: "varchar", length: 15, nullable: true, default: null  })
    gender: string;

    @ManyToOne(() => Family, { nullable: true })
    @JoinColumn({ name: "family", referencedColumnName: "id" })
    family: Family | null;

    @ManyToOne(() => Franchise, {nullable: true })
    @JoinColumn({ name: "franchise", referencedColumnName: "id" })
    franchise: Franchise | null;
  
    @Column({ type: "tinyint", default: 0 })
    is_deleted: boolean;

    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_date: Date;

    @Column({ type: "datetime", default: null, onUpdate: "CURRENT_TIMESTAMP" })
    updated_date: Date | null;
}