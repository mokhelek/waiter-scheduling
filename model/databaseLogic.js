export default function databaseInteraction(db) {
    async function addWaiter(username, password) {
        await db.none("INSERT INTO waiters(username, password) VALUES ($1, $2)", [username, password]);
    }
    async function allWaiters() {
        return await db.manyOrNone("SELECT * FROM waiters");
    }

    async function allDays() {
        return await db.manyOrNone("SELECT * FROM all_days");
    }

    async function addDay(days,user) {
        const selectedValues = days ;
        let authenticatedUser = user ;

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
    }

    async function allSchedulingInfo(){
        return await db.manyOrNone('SELECT * FROM days')
    }

    return {
        addWaiter,
        allWaiters,
        allDays,
        addDay,
        allSchedulingInfo
    };
}
