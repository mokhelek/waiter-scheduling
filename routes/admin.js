import express from "express";
var router = express.Router();

import db from "../model/db.js";

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect("/auth/login");
}

router.get("/:username", isAuthenticated, async (req, res) => {

    let authenticatedUser = req.session.user.username;
    let selectedDays = await db.any("SELECT * from days");

    let all_days = await db.any("SELECT * FROM all_days ORDER BY id ASC"); // Arr of days

    for (let i of selectedDays) {
        for (let j of all_days) {
            if (i.weekday == j.weekday) {
                let bookedUsers = await db.any("SELECT username FROM days WHERE weekday = $1", [i.weekday]);
                j.users = bookedUsers;
            }
        }
    }

    res.render("admin-dashboard", { all_days, authenticatedUser });
});



router.get("/reset/all", async (req, res) => {
    await db.none("DELETE FROM days");
    await db.none("UPDATE all_days SET counter = 0");
    await db.none("UPDATE all_days SET counter = 0, status = 'insufficient' ");

    res.redirect(`/admin/${req.session.user.username}`);
});

router.get("/waiter-list/all", async (req, res) => {
    let authenticatedUser = req.session.user.username;
    let waiters = await db.any("SELECT * FROM waiters");

    res.render("waiter-list", {waiters,authenticatedUser});
});

router.get("/registration/add-waiters", async (req, res) => {
    let authenticatedUser = req.session.user.username;
    res.render("admin-add-waiter", {authenticatedUser});
});


router.get("/remove/:id", isAuthenticated, async (req, res) => {
    await db.none('DELETE FROM waiters WHERE id = $1', req.params.id);

    res.redirect(`/admin/${req.session.user.username}`);
});


export default router ;