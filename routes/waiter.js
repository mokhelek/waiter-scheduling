import express from "express";
var router = express.Router();

import db from "../model/db.js";
import waiterService from "../services/waiterService.js";


let waiterServiceInstance = waiterService(db);

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect("/auth/login");
}

router.get("/:username", isAuthenticated, waiterServiceInstance.waiterHome );
router.post("/:username",waiterServiceInstance.addDays);
router.get("/remove/:id", isAuthenticated, waiterServiceInstance.updateDays);

export default router;


