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
    @PrimaryGeneratedColumn({ type: "int", unsigned: true })
    id: number;

    @ManyToOne(() => WeeklyClass, { eager: true })
    @JoinColumn({ name: "weekly_class", referencedColumnName: "id" })
    weekly_class: WeeklyClass;

    @ManyToOne(() => SubscriptionPlanPrice, { eager: true, nullable: true })
    @JoinColumn({ name: "subscription_plan_price", referencedColumnName: "id" })
    subscription_plan_price: SubscriptionPlanPrice | null;

    //WAITING_LIST_STATUS
    @ManyToOne(() => UnitDynamicCentral)
    @JoinColumn({ name: "waiting_list_status", referencedColumnName: "code" })
    waiting_list_status: UnitDynamicCentral;

    @ManyToOne(() => Student)
    @JoinColumn({ name: "student", referencedColumnName: "id" })
    student: Student;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "agent", referencedColumnName: "id" })
    agent: User | null;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "booked_by", referencedColumnName: "id" })
    booked_by: User | null;

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
