import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("products")
export class Product {
  @PrimaryColumn()
  productCode!: string;

  @Column()
  productName!: string;

  @Column()
  productLine!: string;

  @Column()
  productScale!: string;

  @Column()
  productVendor!: string;

  @Column({ type: "text", nullable: true })
  productDescription!: string;

  @Column()
  quantityInStock!: number;

  @Column()
  buyPrice!: number;

  @Column({ nullable: true })
  MSRP!: number;
}
