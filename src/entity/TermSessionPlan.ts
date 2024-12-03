import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    JoinColumn 
} from "typeorm";
import { TermSession } from "./TermSession";
import { AbilityGroup } from "./AbilityGroup";
import { SessionPlan } from "./SessionPlan";
import { Franchise } from "./Franchise";

@Entity("term_session_plans")
export class TermSessionPlan {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: number;

    @ManyToOne(() => TermSession)
    @JoinColumn({ name: "term_session_id", referencedColumnName: "id" })
    term_session_id: TermSession;

    @ManyToOne(() => AbilityGroup)
    @JoinColumn({ name: "ability_group_id", referencedColumnName: "id" })
    ability_group_id: AbilityGroup;

    @ManyToOne(() => SessionPlan)
    @JoinColumn({ name: "session_plan_id", referencedColumnName: "id" })
    session_plan_id: SessionPlan;

    @ManyToOne(() => Franchise, { nullable: true })
    @JoinColumn({ name: "franchise_id", referencedColumnName: "id" })
    franchise_id: Franchise | null;

    @Column({ type: "tinyint", default: 0 })
    is_deleted: boolean;

    @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
    created_date: Date | null;

    @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_date: Date | null;
}
