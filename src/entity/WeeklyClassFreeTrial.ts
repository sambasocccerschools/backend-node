import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    JoinColumn 
} from "typeorm";
import { WeeklyClass } from "./WeeklyClass";
import { Student } from "./Student";
import { Franchise } from "./Franchise";
import { User } from "@TenshiJS/entity/User";
import { UnitDynamicCentral } from "./UnitDynamicCentral";

@Entity("weekly_classes_free_trials")
export class WeeklyClassFreeTrial {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: number;

    @ManyToOne(() => WeeklyClass)
    @JoinColumn({ name: "weekly_class", referencedColumnName: "id" })
    weekly_class: WeeklyClass;

    @ManyToOne(() => UnitDynamicCentral)
    @JoinColumn({ name: "free_trial_status", referencedColumnName: "code" })
    free_trial_status: UnitDynamicCentral;

    @ManyToOne(() => Student)
    @JoinColumn({ name: "student", referencedColumnName: "id" })
    student: Student;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "agent", referencedColumnName: "id" })
    agent: User | null;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "booked_by", referencedColumnName: "id" })
    booked_by: User | null;

    @Column({ type: "date", nullable: true, default: null })
    trial_date: Date | null;

    @Column({ type: "tinyint", unsigned: true, default: 1 })
    attempt: number;

    @ManyToOne(() => Franchise, { nullable: true })
    @JoinColumn({ name: "franchise", referencedColumnName: "id" })
    franchise: Franchise | null;

    @Column({ type: "tinyint", default: 0 })
    is_deleted: boolean;

    @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
    created_date: Date | null;

    @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_date: Date | null;
}
