// src/entity/UnitDynamicCentral.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("units_dynamic_central")
export class UnitDynamicCentral {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 200, unique: true })
  code: string;

  @Column({ type: "enum", 
            enum: ["CAMP_TYPES",
                    "EVENT_TYPES", 
                    "FEEDBACK_CATEGORIES", 
                    "FEEDBACK_STATUS",
                    "FEEDBACK_TYPES",
                    "FREE_TRIAL_STATUS",
                    "GUARDIAN_REFEREE_STATUS",
                    "LEAD_STATUS",
                    "MEMBER_CANCEL_STATUS",
                    "MEMBER_CANCEL_TYPES",
                    "MEMBER_STATUS",
                    "MEMBERSHIP_CANCEL_REASON_CATEGORIES",
                    "MEMBERSHIP_CANCEL_REASONS",
                    "MEMBERSHIP_FREEZE_REASONS",
                    "PAYMENT_TYPES",
                    "REFERRAL_SOURCES",
                    "REGIONS",
                    "RELATIONSHIP_TYPES",
                    "SALE_STATUS",
                    "SEASONS",
                    "SERVICES",
                    "SERVICE_PACKAGES",
                    "STUDENT_COVERAGES",
                    "WAITING_LIST_STATUS"
                  ]
          })           
  type: string | null;

  @Column({ type: "varchar", length: 200, nullable: true, default: null })
  title: string;

  @Column({ type: "varchar", length: 200, nullable: true, default: null })
  title_es: string;

  @Column({ type: "varchar", length: 200, nullable: true, default: null })
  slug: string;

  @Column({ type: "varchar", length: 200, nullable: true, default: null })
  father_code: string | null;

  @Column({ type: "varchar", length: 200, nullable: true, default: null })
  value1: string | null;

  @Column({ type: "varchar", length: 200, nullable: true, default: null })
  value2: string | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_date: Date;

  @Column({ type: "datetime", nullable: true, default: null })
  updated_date: Date | null;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "varchar",  nullable: true, default: null })
  user_updated_id: string | null;

}
