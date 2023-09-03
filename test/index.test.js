import assert from "assert";
import pgPromise from "pg-promise";
import 'dotenv/config';

import databaseInteraction from "../model/databaseLogic.js";

const connectionTest = process.env.DATABASE_URL_TEST;

const db = pgPromise()(connectionTest);
db.connect();


const databaseInstance = databaseInteraction(db);

describe("The basic database web app", function () {
    this.timeout(6000);

    beforeEach(async function () {
        await db.none("DELETE FROM days");
        await db.none("UPDATE all_days SET counter = 0");
        await db.none("UPDATE all_days SET counter = 0, status = 'insufficient' ");
    });

    it("Should add a waiter", async function () {
        // await databaseInstance.addRegistration(db, "CA258") ;

        // let regNums = await databaseInstance.getRegistrations(db,"ALL") ;

        assert.equal(1, 1);
    });


})