export default function databaseInteraction(db) {
    async function addWaiter(username, password) {
        await db.none("INSERT INTO waiters(username, password) VALUES ($1, $2)", [username, password]);
    }
    async function allWaiters() {
        return await db.any("SELECT * FROM waiters");
    }

    async function allDays() {
        return await db.any("SELECT * FROM all_days");
    }

    async function addDay(days,user) {
        const selectedDays = days;
        let authenticatedUser = user ;

        const insertQueries = selectedDays.map(async (item) => {
            const insertQuery = `
                    INSERT INTO days (username, weekday)
                    VALUES ($1, $2)
                    ON CONFLICT (username, weekday) DO NOTHING
                    RETURNING id, username, weekday;
                `;
            let result = await db.oneOrNone(insertQuery, [authenticatedUser, item]);

            if (result != null) {
                const insertQueriesCounter = selectedDays.map(async (item) => {
                    return await db.none("UPDATE all_days SET counter = all_days.counter + 1, status = CASE WHEN all_days.counter < 2  THEN 'insufficient' WHEN all_days.counter > 2 THEN 'surplus' ELSE 'sufficient' END WHERE weekday = $1", [item]);
                });

                await Promise.all(insertQueriesCounter);
            } else {
                // TODO : --> Ask if user want to update the day ?
                console.log("WOULD YOU LIKE TO UPDATE AVAILABILITY ??");
            }
            return result;
        });
        await Promise.all(insertQueries);
    }

    async function allSchedulingInfo(){
        return await db.any('SELECT * FROM days')
    }

    return {
        addWaiter,
        allWaiters,
        allDays,
        addDay,
        allSchedulingInfo
    };
}
