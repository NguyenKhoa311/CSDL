import { AppDataSource } from "../config/database";
import { Customer } from "../entities/Customer";
import { Order } from "../entities/Order";
import { Product } from "../entities/Product";
import { OrderDetail } from "../entities/OrderDetail";
import { Like } from "typeorm";

export class SearchService {
  private customerRepository = AppDataSource.getRepository(Customer);
  private orderRepository = AppDataSource.getRepository(Order);
  private productRepository = AppDataSource.getRepository(Product);
  private orderDetailRepository = AppDataSource.getRepository(OrderDetail);

  // Tìm kiếm khách hàng
  async searchCustomers(keyword: string) {
    return await this.customerRepository.find({
      where: [
        { customerName: Like(`%${keyword}%`) },
        { city: Like(`%${keyword}%`) },
        { country: Like(`%${keyword}%`) },
      ],
      take: 20,
    });
  }

  // Tìm kiếm đơn hàng
  async searchOrders(customerNumber?: number, startDate?: string, endDate?: string) {
    let query = this.orderRepository.createQueryBuilder("o");

    if (customerNumber) {
      query = query.where("o.customerNumber = :customerNumber", { customerNumber });
    }

    if (startDate) {
      query = query.andWhere("o.orderDate >= :startDate", { startDate });
    }

    if (endDate) {
      query = query.andWhere("o.orderDate <= :endDate", { endDate });
    }

    return await query.leftJoinAndSelect("o.customer", "c").take(50).getMany();
  }

  // Tìm kiếm sản phẩm
  async searchProducts(keyword: string) {
    return await this.productRepository.find({
      where: [
        { productName: Like(`%${keyword}%`) },
        { productLine: Like(`%${keyword}%`) },
      ],
      take: 20,
    });
  }

  // Tìm kiếm chi tiết đơn hàng
  async searchOrderDetails(orderNumber?: number, productCode?: string) {
    let query = this.orderDetailRepository.createQueryBuilder("od");

    if (orderNumber) {
      query = query.where("od.orderNumber = :orderNumber", { orderNumber });
    }

    if (productCode) {
      query = query.where("od.productCode = :productCode", { productCode });
    }

    return await query
      .leftJoinAndSelect("od.order", "o")
      .leftJoinAndSelect("od.product", "p")
      .take(50)
      .getMany();
  }

  // Tìm kiếm tổng hợp
  async globalSearch(keyword: string) {
    const customers = await this.searchCustomers(keyword);
    const products = await this.searchProducts(keyword);

    return {
      customers,
      products,
      total: customers.length + products.length,
    };
  }
}
