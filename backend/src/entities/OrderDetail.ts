import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity("orderdetails")
export class OrderDetail {
  @PrimaryColumn()
  orderNumber!: number;

  @PrimaryColumn()
  productCode!: string;

  @Column()
  quantityOrdered!: number;

  @Column()
  priceEach!: number;

  @Column()
  orderLineNumber!: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: "orderNumber" })
  order!: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "productCode" })
  product!: Product;
}
