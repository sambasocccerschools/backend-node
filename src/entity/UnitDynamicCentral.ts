// src/entity/UnitDynamicCentral.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("units_dynamic_central")
export class UnitDynamicCentral {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 100, unique: true })
  code: string;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "enum", enum: ["PROJECT_TYPE", "PROJECT_CATEGORY", "INDUSTRY_TYPE"], nullable: true })
  type: "PROJECT_TYPE" | "PROJECT_CATEGORY" | "INDUSTRY_TYPE" | null;

  @Column({ type: "varchar", length: 400, nullable: true, default: null })
  description: string | null;

  @Column({ type: "varchar", length: 300 })
  value1: string;

  @Column({ type: "varchar", length: 300, nullable: true, default: null })
  value2: string | null;

  @Column({ type: "varchar", length: 300, nullable: true, default: null })
  value3: string | null;

  @Column({ type: "varchar", length: 300, nullable: true, default: null })
  value4: string | null;

  @Column({ type: "varchar", length: 300, nullable: true, default: null })
  value5: string | null;

  @Column({ type: "varchar", length: 3, nullable: true, default: null })
  country_iso_code: string | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_date: Date;

  @Column({ type: "datetime", nullable: true, default: null })
  updated_date: Date | null;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "int", unsigned: true, nullable: true, default: null })
  user_id: number | null;

  @Column({ type: "int", unsigned: true, nullable: true, default: null })
  user_updated_id: number | null;

  @Column({ type: "varchar", length: 200, nullable: true, default: null })
  app_guid: string | null;
}