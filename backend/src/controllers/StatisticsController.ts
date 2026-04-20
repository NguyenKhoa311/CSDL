import { Request, Response } from "express";
import { StatisticsService } from "../services/StatisticsService";

const statisticsService = new StatisticsService();

export class StatisticsController {
  async getStatisticsByCustomer(req: Request, res: Response) {
    try {
      const data = await statisticsService.getStatisticsByCustomer();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async getStatisticsByTime(req: Request, res: Response) {
    try {
      const data = await statisticsService.getStatisticsByTime();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async getStatisticsByProduct(req: Request, res: Response) {
    try {
      const data = await statisticsService.getStatisticsByProduct();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async getPivotStatistics(req: Request, res: Response) {
    try {
      const data = await statisticsService.getPivotStatistics();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async getTopCustomers(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const data = await statisticsService.getTopCustomers(limit);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async getTopProducts(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const data = await statisticsService.getTopProducts(limit);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }
}
