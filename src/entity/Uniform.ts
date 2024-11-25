// src/entity/UnitDynamicCentral.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("uniforms")
export class Uniform {
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 200, unique: true })
  title: string;

  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  url: string;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_date: Date;

  @Column({ type: "datetime", default: null, onUpdate: "CURRENT_TIMESTAMP" })
  updated_date: Date | null;

}
