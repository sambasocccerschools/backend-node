import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    JoinColumn 
} from "typeorm";
import { SessionPlan } from "./SessionPlan";
import { Franchise } from "./Franchise";

@Entity("session_plan_exercises")
export class SessionPlanExercise {
    @PrimaryGeneratedColumn({ type: "int", unsigned: true })
    id: number;

    @ManyToOne(() => SessionPlan)
    @JoinColumn({ name: "session_plan", referencedColumnName: "id" })
    session_plan: SessionPlan;

    @Column({ type: "varchar", length: 255 })
    title: string;

    @Column({ type: "varchar", length: 255 })
    subtitle: string;

    @Column({ type: "varchar", length: 255 })
    title_duration: string;

    @Column({ type: "text", nullable: true, default: null })
    description: string;
    
    /*
        [
            {
                "extension":"png",
                "url":"http://",
                "type": "IMG"
            }
        ]
    */
    @Column({ type: "json", nullable: true, default: null })
    json_urls: any;

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
