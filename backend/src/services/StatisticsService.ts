import { AppDataSource } from "../config/database";
import { Customer } from "../entities/Customer";
import { Order } from "../entities/Order";
import { Product } from "../entities/Product";
import { OrderDetail } from "../entities/OrderDetail";

export class StatisticsService {
  private customerRepository = AppDataSource.getRepository(Customer);
  private orderRepository = AppDataSource.getRepository(Order);
  private productRepository = AppDataSource.getRepository(Product);
  private orderDetailRepository = AppDataSource.getRepository(OrderDetail);

  // Thống kê theo khách hàng
  async getStatisticsByCustomer() {
    const result = await this.orderDetailRepository
      .createQueryBuilder("od")
      .select("c.customerNumber", "customerNumber")
      .addSelect("c.customerName", "customerName")
      .addSelect("COUNT(DISTINCT o.orderNumber)", "orderCount")
      .addSelect("SUM(od.quantityOrdered * od.priceEach)", "totalAmount")
      .addSelect("SUM(od.quantityOrdered)", "totalQuantity")
      .innerJoin("od.order", "o")
      .innerJoin("o.customer", "c")
      .groupBy("c.customerNumber")
      .addGroupBy("c.customerName")
      .orderBy("totalAmount", "DESC")
      .getRawMany();
    return result;
  }

  // Thống kê theo thời gian (từng tháng)
  async getStatisticsByTime() {
    const result = await this.orderRepository
      .createQueryBuilder("o")
      .select("YEAR(o.orderDate)", "year")
      .addSelect("MONTH(o.orderDate)", "month")
      .addSelect("COUNT(DISTINCT o.orderNumber)", "orderCount")
      .addSelect("SUM(od.quantityOrdered * od.priceEach)", "totalAmount")
      .leftJoin("o.details", "od")
      .groupBy("YEAR(o.orderDate)")
      .addGroupBy("MONTH(o.orderDate)")
      .orderBy("YEAR(o.orderDate)", "DESC")
      .addOrderBy("MONTH(o.orderDate)", "DESC")
      .getRawMany();
    return result;
  }

  // Thống kê theo mặt hàng/sản phẩm
  async getStatisticsByProduct() {
    const result = await this.orderDetailRepository
      .createQueryBuilder("od")
      .select("p.productCode", "productCode")
      .addSelect("p.productName", "productName")
      .addSelect("p.productLine", "productLine")
      .addSelect("COUNT(DISTINCT o.orderNumber)", "orderCount")
      .addSelect("SUM(od.quantityOrdered)", "totalQuantity")
      .addSelect("SUM(od.quantityOrdered * od.priceEach)", "totalAmount")
      .addSelect("AVG(od.priceEach)", "avgPrice")
      .innerJoin("od.product", "p")
      .innerJoin("od.order", "o")
      .groupBy("p.productCode")
      .addGroupBy("p.productName")
      .addGroupBy("p.productLine")
      .orderBy("totalAmount", "DESC")
      .getRawMany();
    return result;
  }

  // Thống kê theo sản phẩm và khách hàng (pivot)
  async getPivotStatistics() {
    const result = await this.orderDetailRepository
      .createQueryBuilder("od")
      .select("c.customerName", "customerName")
      .addSelect("p.productLine", "productLine")
      .addSelect("SUM(od.quantityOrdered * od.priceEach)", "totalAmount")
      .innerJoin("od.order", "o")
      .innerJoin("o.customer", "c")
      .innerJoin("od.product", "p")
      .groupBy("c.customerName")
      .addGroupBy("p.productLine")
      .orderBy("c.customerName", "ASC")
      .addOrderBy("p.productLine", "ASC")
      .getRawMany();
    return result;
  }

  // Lấy danh sách khách hàng với tổng doanh thu
  async getTopCustomers(limit: number = 10) {
    const result = await this.orderDetailRepository
      .createQueryBuilder("od")
      .select("c.customerNumber", "customerNumber")
      .addSelect("c.customerName", "customerName")
      .addSelect("c.country", "country")
      .addSelect("SUM(od.quantityOrdered * od.priceEach)", "totalAmount")
      .innerJoin("od.order", "o")
      .innerJoin("o.customer", "c")
      .groupBy("c.customerNumber")
      .addGroupBy("c.customerName")
      .addGroupBy("c.country")
      .orderBy("totalAmount", "DESC")
      .limit(limit)
      .getRawMany();
    return result;
  }

  // Lấy danh sách sản phẩm bán chạy nhất
  async getTopProducts(limit: number = 10) {
    const result = await this.orderDetailRepository
      .createQueryBuilder("od")
      .select("p.productCode", "productCode")
      .addSelect("p.productName", "productName")
      .addSelect("SUM(od.quantityOrdered)", "totalQuantity")
      .addSelect("SUM(od.quantityOrdered * od.priceEach)", "totalAmount")
      .innerJoin("od.product", "p")
      .groupBy("p.productCode")
      .addGroupBy("p.productName")
      .orderBy("totalQuantity", "DESC")
      .limit(limit)
      .getRawMany();
    return result;
  }
}
