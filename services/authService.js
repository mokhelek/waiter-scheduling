import bcrypt from "bcrypt";

export default function authService(db) {
    async function userLogin(req, res) {
        const { username, password } = req.body;

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
    }

    async function userRegistration(req, res) {
        const { username, password } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.none("INSERT INTO waiters(username, password) VALUES($1, $2)", [username, hashedPassword]);
            res.redirect(`/admin/${req.session.user.username}`);
        } catch (error) {
            console.log(error)
            res.redirect(`/waiters/${username}`);
        }
    }


    async function userLogout(req, res){
        req.session.destroy(() => {
            res.redirect("/auth/login");
        });
    }

    return {
        userLogin,
        userRegistration,
        userLogout
    };
}
