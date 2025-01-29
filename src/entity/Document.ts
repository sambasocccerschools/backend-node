// src/entity/Document.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("documents")
export class Document {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number;

  //the title or the document, this cannot will be change
  @Column({ type: "varchar", length: 350 })
  title: string;

  //the code is the title but in upper case
  @Column({ type: "varchar", length: 500, unique: true })
  code: string;

  //this is the file name upload to aws or to server
  @Column({ type: "varchar", length: 500, unique: true  })
  file_name: string;

  @Column({ type: "varchar", length: 10 })
  extension: string;

  @Column({ type: "enum", 
            enum: [
              "PROFILE_PICTURE", 
              "GENERAL_GALLERY", 
              "PERSONAL_DOCUMENT", 
              "UNIFORM_PICTURE", 
              "SESSION_PLAN_BANNER",
              "SESSION_PLAN_VIDEO",
              "SESSION_PLAN_EXCERCISES"], 
              nullable: true, 
              default: null  })
  action_type: string | null; 

  @Column({ type: "enum", enum: [
                          "DOC", 
                          "IMG", 
                          "EXCEL", 
                          "VIDEO",
                          "OTHER"], 
                          default: "IMG" })
  type: "DOC" | "IMG" | "EXCEL" | "VIDEO" | "OTHER";

  @Column({ type: "varchar", length: 400, nullable: true, default: null })
  description: string | null;

  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  url: string | null;

  @Column({ type: "int", unsigned: true, nullable: true, default: null})
  id_for_table: number | null;

  @Column({ type: "enum", 
            enum: ["USER", 
                  "UNIFORMS", 
                  "GENERAL", 
                  "WEEKLY_CLASSES_MEMBERS",
                  "SESSION_PLAN"], 
            nullable: true, 
            default: null })
  table: string | null;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "tinyint", default: 0 })
  is_public: boolean;

  @Column({ type: "int", unsigned: true, nullable: true, default: null })
  user_id: number | null;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_date: Date;
}
