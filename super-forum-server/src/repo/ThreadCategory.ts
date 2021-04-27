import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Auditable } from "./Auditable";
import { Thread } from "./Thread";

@Entity({ name: "ThreadCategories" })
export class ThreadCategory extends Auditable {
  @PrimaryGeneratedColumn({
    name: "Id",
    type: "bigint",
  })
  id: string;

  @Column("varchar", {
    name: "Name",
    unique: true,
    nullable: false,
    length: 100,
  })
  name: string;

  @Column("varchar", {
    name: "Description",
    nullable: true,
    length: 150,
  })
  description: string;

  @OneToMany(() => Thread, (thread) => thread.category)
  threads: Thread[];
}
