import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Franchise } from "./Franchise";
import { Term } from "./Term";

@Entity("term_sessions")
export class TermSession {
    @PrimaryGeneratedColumn({ type: "int", unsigned: true })
    id: number;

    @ManyToOne(() => Term, { eager: true })
    @JoinColumn({ name: "term", referencedColumnName: "id" })
    term: Term;

    @ManyToOne(() => Franchise, {  nullable: true })
    @JoinColumn({ name: "franchise", referencedColumnName: "id" })
    franchise: Franchise | null;

    @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
    created_date: Date | null;

    @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_date: Date | null;
}

