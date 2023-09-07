import assert from "assert";
import pgPromise from "pg-promise";
import "dotenv/config";

import databaseInteraction from "../model/databaseLogic.js";

const connectionTest = process.env.DATABASE_URL_TEST;

const db = pgPromise()(connectionTest);
db.connect();

const databaseInstance = databaseInteraction(db);

describe("The basic database web app", function () {
    this.timeout(10000);

    beforeEach(async function () {
        await db.none("DELETE FROM days");
        await db.none("UPDATE all_days SET counter = 0");
        await db.none("UPDATE all_days SET counter = 0, status = 'insufficient' ");
        await db.none("DELETE FROM waiters");
    });

    it("Should add a waiter", async function () {
        await databaseInstance.addWaiter("Kat", "1234");
        let allWaiters = await databaseInstance.allWaiters();
        assert.equal(1, allWaiters.length);
    });
    it("Should add a multiple waiters", async function () {
        await databaseInstance.addWaiter("Kat", "1234");
        await databaseInstance.addWaiter("Mpho", "1234");
        await databaseInstance.addWaiter("Tom", "1234");
        let allWaiters = await databaseInstance.allWaiters();
        assert.equal(3, allWaiters.length);
    });
    it("It should return data for all days", async function () {
        let allDays = await databaseInstance.allDays();
        assert.equal(7, allDays.length);
    });
    it("It should add availability day", async function () {
        let user = "Kat"
        let days = ['Monday'];
        await databaseInstance.addDay(days,user);
        let allScheduledDays = await databaseInstance.allSchedulingInfo();
        assert.equal(1, allScheduledDays.length);
    });
    it("It should add multiple availability days", async function () {
        let user = "Kat"
        let days = ['Monday','Friday'];
        await databaseInstance.addDay(days,user);
        let allScheduledDays = await databaseInstance.allSchedulingInfo();
        assert.equal(2, allScheduledDays.length);
    });
    it("It should add multiple availability days", async function () {
        let user = "Kat"
        let days = ['Monday','Friday'];
        await databaseInstance.addDay(days,user);
        let allScheduledDays = await databaseInstance.allSchedulingInfo();
        assert.equal(2, allScheduledDays.length);
    });

    after(() => {
        db.$pool.end;
      });
});
