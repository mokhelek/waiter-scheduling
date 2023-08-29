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
    // todo: -> Days booked by the current logged-in waiter.
    let days = await db.any("SELECT * FROM days WHERE username = $1", [req.session.user.username]);
    let all_days = await db.any("SELECT * FROM all_days");
    let authenticatedUser = req.session.user.username
    res.render("home", { days, all_days, authenticatedUser});
});

router.post("/:username", async (req, res) => {
    const selectedValues = JSON.parse(req.body.body) ;
    let authenticatedUser = req.session.user.username;

    let days = await db.any("SELECT * FROM days WHERE username = $1", [req.session.user.username]);

    const insertQueries = selectedValues.map((item) => {
        return db.none("INSERT INTO days(username, weekday) VALUES($1, $2)", [authenticatedUser, item]);
    });
    Promise.all(insertQueries);

    const insertQueriesCounter = selectedValues.map((item) => {
        return db.none("UPDATE all_days SET counter = all_days.counter + 1 WHERE weekday = $1", [item]);
    });
    Promise.all(insertQueriesCounter);
    res.redirect("/")
}); 




export default router ;