import express from "express";
import db from "../model/db.js";
import authService from "../services/authService.js";


const authServiceInstance = authService(db);
var router = express.Router();


router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/login",authServiceInstance.userLogin );
router.post("/register", authServiceInstance.userRegistration );
router.get("/logout", authServiceInstance.userLogout );

export default router ;