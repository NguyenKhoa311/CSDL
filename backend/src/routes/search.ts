import { Router } from "express";
import { SearchController } from "../controllers/SearchController";

const router = Router();
const searchController = new SearchController();

router.get("/customers", (req, res) => searchController.searchCustomers(req, res));
router.get("/products", (req, res) => searchController.searchProducts(req, res));
router.get("/orders", (req, res) => searchController.searchOrders(req, res));
router.get("/global", (req, res) => searchController.globalSearch(req, res));

export default router;
