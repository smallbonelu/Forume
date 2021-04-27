import { BaseEntity, Column } from "typeorm";

export class Auditable extends BaseEntity {
  @Column("varchar", {
    name: "CreatedBy",
    nullable: false,
    length: 60,
    default: () => `getpgusername()`,
  })
  createdBy: string;

  @Column("timestamp with time zone", {
    name: "CreatedOn",
    nullable: false,
    default: () => `now()`,
  })
  createdOn: Date;

  @Column("varchar", {
    name: "LastModifiedBy",
    nullable: false,
    length: 60,
    default: () => `getpgusername()`,
  })
  lastModifiedBy: string;

  @Column("timestamp with time zone", {
    name: "LastModifiedOn",
    nullable: false,
    default: () => `now()`,
  })
  lastModifiedOn: Date;
}
