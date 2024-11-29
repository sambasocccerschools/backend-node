import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    ManyToOne, 
    JoinColumn 
} from "typeorm";
import { WeeklyClass } from "./WeeklyClass";
import { SubscriptionPlanPrice } from "./SubscriptionPlanPrice";
import { UnitDynamicCentral } from "./UnitDynamicCentral";
import { Student } from "./Student";
import { Franchise } from "./Franchise";
import { User } from "@TenshiJS/entity/User";

@Entity("weekly_classes_waiting_lists")
export class WeeklyClassWaitingList {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: number;

    @ManyToOne(() => WeeklyClass, { eager: true })
    @JoinColumn({ name: "weekly_class_id", referencedColumnName: "id" })
    weekly_class_id: WeeklyClass;

    @ManyToOne(() => SubscriptionPlanPrice, { eager: true, nullable: true })
    @JoinColumn({ name: "subscription_plan_price_id", referencedColumnName: "id" })
    subscription_plan_price_id: SubscriptionPlanPrice | null;

    //WAITING_LIST_STATUS
    @ManyToOne(() => UnitDynamicCentral, { eager: true })
    @JoinColumn({ name: "waiting_list_status_code", referencedColumnName: "code" })
    waiting_list_status_code: UnitDynamicCentral;

    @ManyToOne(() => Student, { eager: true })
    @JoinColumn({ name: "student_id", referencedColumnName: "id" })
    student_id: Student;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "agent_id", referencedColumnName: "id" })
    agent_id: User | null;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "booked_by", referencedColumnName: "id" })
    booked_by: User | null;

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
