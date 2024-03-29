export default function waiterService(db) {
    async function waiterHome(req, res) {
        let days = await db.any("SELECT * FROM days WHERE username = $1", [req.session.user.username]);
        let all_days = await db.any("SELECT * FROM all_days ORDER BY id ASC");
        let authenticatedUser = req.session.user.username;
        // req.flash("info","jsjhsa hdsjag ")
        res.render("home", { days, all_days, authenticatedUser });
    }

    async function addDays(req, res) {
        const selectedValues = JSON.parse(req.body.body);
        let authenticatedUser = req.session.user.username;

        const insertQuery = `
                INSERT INTO days (username, weekday)
                VALUES ($1, $2)
                ON CONFLICT (username, weekday) DO NOTHING
                RETURNING id, username, weekday;
            `;

        let validDays = [];
        for (let i of selectedValues) {
            let result = await db.oneOrNone(insertQuery, [authenticatedUser, i]);
            validDays.push(result);
        }

        for (let i of validDays) {
            if (i != null) {
                await db.none("UPDATE all_days SET counter = all_days.counter + 1, status = CASE WHEN all_days.counter < 2  THEN 'insufficient' WHEN all_days.counter > 2 THEN 'surplus' ELSE 'sufficient' END WHERE weekday = $1", [i.weekday]);
            }
        }

        // Set a success flash message
        req.flash("success", "Days added successfully");
        res.redirect("/"); // Redirect to a route where you can render the flash message
    }

    async function updateDays(req, res) {
        let day = await db.oneOrNone("SELECT weekday from days WHERE id = $1", req.params.id);
        await db.none("DELETE FROM days WHERE id = $1", req.params.id);
        await db.none("UPDATE all_days SET counter = all_days.counter - 1, status = CASE WHEN all_days.counter < 2  THEN 'insufficient' WHEN all_days.counter > 2 THEN 'surplus' ELSE 'sufficient' END WHERE weekday = $1", [day.weekday]);
        await db.none("UPDATE all_days SET status = CASE WHEN all_days.counter < 3  THEN 'insufficient' WHEN all_days.counter > 3 THEN 'surplus' ELSE 'sufficient' END WHERE weekday = $1", [day.weekday]);

        res.redirect("/");
    }

    return {
        waiterHome,
        addDays,
        updateDays,
    };
}
