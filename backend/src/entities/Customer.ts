import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("customers")
export class Customer {
  @PrimaryColumn()
  customerNumber!: number;

  @Column()
  customerName!: string;

  @Column()
  contactLastName!: string;

  @Column()
  contactFirstName!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column()
  addressLine1!: string;

  @Column({ nullable: true })
  addressLine2!: string;

  @Column()
  city!: string;

  @Column({ nullable: true })
  state!: string;

  @Column()
  postalCode!: string;

  @Column()
  country!: string;

  @Column({ nullable: true })
  creditLimit!: number;
}
