import { Request, Response } from "express";
import { SearchService } from "../services/SearchService";

const searchService = new SearchService();

export class SearchController {
  async searchCustomers(req: Request, res: Response) {
    try {
      const keyword = req.query.keyword as string;
      if (!keyword) {
        return res.status(400).json({ success: false, message: "Keyword is required" });
      }
      const data = await searchService.searchCustomers(keyword);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async searchProducts(req: Request, res: Response) {
    try {
      const keyword = req.query.keyword as string;
      if (!keyword) {
        return res.status(400).json({ success: false, message: "Keyword is required" });
      }
      const data = await searchService.searchProducts(keyword);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async searchOrders(req: Request, res: Response) {
    try {
      const customerNumber = req.query.customerNumber ? parseInt(req.query.customerNumber as string) : undefined;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const status = req.query.status as string;
      const productCode = req.query.productCode as string;

      const data = await searchService.searchOrders(customerNumber, startDate, endDate, status, productCode);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }

  async globalSearch(req: Request, res: Response) {
    try {
      const keyword = req.query.keyword as string;
      if (!keyword) {
        return res.status(400).json({ success: false, message: "Keyword is required" });
      }
      const data = await searchService.globalSearch(keyword);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: (error as Error).message });
    }
  }
}
