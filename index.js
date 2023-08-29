import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";


import flash from "express-flash";
import session from "express-session";

let app = express();
app.use(
    session({
        secret: "<add a secret string here>",
        resave: false,
        saveUninitialized: true,
    })
);


app.use(flash());
app.use(express.static("public"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect("/auth/login");
}

app.get("/", isAuthenticated, (req, res) => {
    res.redirect(`/waiters/${req.session.user.username}`);
});

import waiterRouter from "./routes/waiter.js";
import adminRouter from "./routes/admin.js";
import authRouter from "./routes/authentication.js";

app.use('/waiters', waiterRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);





let PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("App starting on port", PORT);
});
