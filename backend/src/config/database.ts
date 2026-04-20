import { DataSource } from "typeorm";
import { Customer } from "../entities/Customer";
import { Order } from "../entities/Order";
import { Product } from "../entities/Product";
import { OrderDetail } from "../entities/OrderDetail";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3307"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "classicmodels",
  synchronize: false,
  logging: false,
  entities: [Customer, Order, Product, OrderDetail],
});
