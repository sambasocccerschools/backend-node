// src/entity/SubscriptionPlan.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";    
import { Franchise } from "./Franchise"; 
import { Term } from "./Term";
import { Venue } from "./Venue";

@Entity("weekly_classes")
export class WeeklyClass {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: number;

    @ManyToOne(() => Venue, { eager: true })
    @JoinColumn({ name: "venue_id", referencedColumnName: "id" })
    venue_id: Venue;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "int",  default: 0  })
    capacity: number;

    @Column({ type: "enum", 
              enum: [
                "Monday", 
                "Tuesday", 
                "Wednesday", 
                "Thursday", 
                "Friday", 
                "Saturday", 
                "Sunday"]
            })
    days: string; 

    // 'HH:mm:ss'
    @Column({ type: "time"})
    start_time: string;

    @Column({type: "time"})
    end_time: string;

    @ManyToOne(() => Term, { eager: true })
    @JoinColumn({ name: "autumn_term_id", referencedColumnName: "id" })
    autumn_term_id: Term;

    @Column({ type: "tinyint", default: 1 })
    is_autumn_indoor: boolean;

    @ManyToOne(() => Term, { eager: true })
    @JoinColumn({ name: "spring_term_id", referencedColumnName: "id" })
    spring_term_id: Term;

    @Column({ type: "tinyint", default: 1 })
    is_spring_indoor: boolean;

    @ManyToOne(() => Term, { eager: true })
    @JoinColumn({ name: "summer_term_id", referencedColumnName: "id" })
    summer_term_id: Term;

    @Column({ type: "tinyint", default: 1 })
    is_summer_indoor: boolean;

    @Column({ type: "tinyint", default: 1 })
    is_free_trail_dates: boolean;

    @Column({ type: "json", nullable: true, default: null })
    free_trial_dates: any;

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

