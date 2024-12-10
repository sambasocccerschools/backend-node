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
    @JoinColumn({ name: "term_session", referencedColumnName: "id" })
    term_session: TermSession;

    @ManyToOne(() => AbilityGroup, {eager :  true})
    @JoinColumn({ name: "ability_group", referencedColumnName: "id" })
    ability_group: AbilityGroup;

    @ManyToOne(() => SessionPlan, {eager :  true})
    @JoinColumn({ name: "session_plan", referencedColumnName: "id" })
    session_plan: SessionPlan;

    @ManyToOne(() => Franchise, { nullable: true })
    @JoinColumn({ name: "franchise", referencedColumnName: "id" })
    franchise: Franchise | null;

    @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP" })
    created_date: Date | null;

    @Column({ type: "timestamp", nullable: true, default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    updated_date: Date | null;
}
