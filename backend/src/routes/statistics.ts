import { Router } from "express";
import { StatisticsController } from "../controllers/StatisticsController";

const router = Router();
const statisticsController = new StatisticsController();

router.get("/by-customer", (req, res) => statisticsController.getStatisticsByCustomer(req, res));
router.get("/by-time", (req, res) => statisticsController.getStatisticsByTime(req, res));
router.get("/by-product", (req, res) => statisticsController.getStatisticsByProduct(req, res));
router.get("/pivot", (req, res) => statisticsController.getPivotStatistics(req, res));
router.get("/top-customers", (req, res) => statisticsController.getTopCustomers(req, res));
router.get("/top-products", (req, res) => statisticsController.getTopProducts(req, res));

export default router;
