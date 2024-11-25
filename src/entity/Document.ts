// src/entity/Document.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("documents")
export class Document {
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
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
              "REPORT"], 
            default: "GENERAL_GALLERY" })
  action_type: string; 

  @Column({ type: "enum", enum: [
                          "DOC", 
                          "IMG", 
                          "EXCEL", 
                          "OTHER"], 
                          default: "IMG" })
  type: "DOC" | "IMG" | "EXCEL" | "OTHER";

  @Column({ type: "varchar", length: 400, nullable: true, default: null })
  description: string | null;

  @Column({ type: "varchar", length: 500, nullable: true, default: null })
  url: string | null;

  @Column({ type: "int", unsigned: true })
  id_for_table: number;

  @Column({ type: "enum", 
            enum: ["USER", 
                  "UNIFORMS", 
                  "GENERAL", 
                  "WEEKLY_CLASSES_MEMBERS"], 
            default: "GENERAL" })
  table: string;

  @Column({ type: "tinyint", default: 0 })
  is_deleted: boolean;

  @Column({ type: "tinyint", default: 0 })
  is_public: boolean;

  @Column({ type: "int", unsigned: true })
  user_id: number;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  created_date: Date;
}
