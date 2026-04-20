import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Customer } from "./Customer";
import { OrderDetail } from "./OrderDetail";

@Entity("orders")
export class Order {
  @PrimaryColumn()
  orderNumber!: number;

  @Column({ type: "date" })
  orderDate!: Date;

  @Column({ type: "date", nullable: true })
  requiredDate!: Date;

  @Column({ type: "date", nullable: true })
  shippedDate!: Date;

  @Column()
  status!: string;

  @Column({ type: "text", nullable: true })
  comments!: string;

  @Column()
  customerNumber!: number;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: "customerNumber" })
  customer!: Customer;

  @OneToMany(() => OrderDetail, (detail) => detail.order)
  details!: OrderDetail[];
}
