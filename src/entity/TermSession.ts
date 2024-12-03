import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Franchise } from "./Franchise";
import { Term } from "./Term";

@Entity("term_sessions")
export class TermSession {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: number;

    @ManyToOne(() => Term, { eager: true })
    @JoinColumn({ name: "term_id", referencedColumnName: "id" })
    term_id: Term;

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

