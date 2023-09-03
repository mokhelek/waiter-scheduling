import pgPromise from "pg-promise";
import 'dotenv/config';

const connection = process.env.DATABASE_URL;

const db = pgPromise()(connection);
db.connect();

export default db ;