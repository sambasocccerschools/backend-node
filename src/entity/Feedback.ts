import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Family } from "./Family";
import { WeeklyClass } from "./WeeklyClass";
import { UnitDynamicCentral } from "./UnitDynamicCentral";
import { Franchise } from "./Franchise";
import { User } from "@TenshiJS/entity/User";

@Entity("feedback")
export class Feedback {
    @PrimaryGeneratedColumn({ type: "int", unsigned: true })
    id: number;

    @ManyToOne(() => WeeklyClass)
    @JoinColumn({ name: "weekly_class", referencedColumnName: "id" })
    weekly_class: WeeklyClass;

    //FEEDBACK_TYPES
    @ManyToOne(() => UnitDynamicCentral)
    @JoinColumn({ name: "feedback_type", referencedColumnName: "code" })
    feedback_type: UnitDynamicCentral;

    //FEEDBACK_CATEGORIES
    @ManyToOne(() => UnitDynamicCentral)
    @JoinColumn({ name: "feedback_category", referencedColumnName: "code" })
    feedback_category: UnitDynamicCentral;

    @Column({ type: "varchar", length: 255, nullable: true })
    other_feedback_category: string | null;

    //FEEDBACK_STATUS
    @ManyToOne(() => UnitDynamicCentral)
    @JoinColumn({ name: "feedback_status", referencedColumnName: "code" })
    feedback_status: UnitDynamicCentral;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "agent", referencedColumnName: "id" })
    agent: User | null;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "reported_by", referencedColumnName: "id" })
    reported_by: User | null;

    @Column({ type: "text", nullable: true })
    additional_notes: string | null;

    @ManyToOne(() => Franchise, { nullable: true })
    @JoinColumn({ name: "franchise", referencedColumnName: "id" })
    franchise: Franchise | null;

    @ManyToOne(() => Family)
    @JoinColumn({ name: "family", referencedColumnName: "id" })
    family: Family;

    @Column({ type: "tinyint", default: 0 })
    is_deleted: boolean;

    @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
    created_date: Date | null;

    @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_date: Date | null;
}
