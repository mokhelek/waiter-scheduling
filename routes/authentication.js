import express from "express";
var router = express.Router();

import db from "../model/db.js";
import bcrypt from 'bcrypt';

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const waiter = await db.oneOrNone("SELECT * FROM waiters WHERE username = $1", username);
        const admin = await db.oneOrNone("SELECT * FROM admin WHERE username = $1", username);

        if (waiter) {
            const passwordMatch = await bcrypt.compare(password, waiter.password);

            if (passwordMatch) {
                req.session.user = waiter;
                res.redirect(`/waiters/${username}`);
            } else {
                res.redirect("/auth/login");
            }
        } else if (admin) {
            const passwordMatch = await bcrypt.compare(password, admin.password);
            if (passwordMatch) {
                req.session.user = admin;
                res.redirect(`/admin/${username}`);
            } else {
                res.redirect("/auth/login");
            }
        } else {
            res.redirect("/auth/login");
        }
    } catch (error) {
        res.redirect("/auth/login");
        console.log("I HAVE AN ERROR ****");
    }
});


router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.none("INSERT INTO waiters(username, password) VALUES($1, $2)", [username, hashedPassword]);
        res.redirect("/login/user");
    } catch (error) {
        console.log(error);
        res.redirect("/register");
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login/user");
    });
});

export default router ;