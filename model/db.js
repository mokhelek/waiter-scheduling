import pgPromise from "pg-promise";
import 'dotenv/config'

const connection = "postgres://rdyfbplq:L8I1AN8ShHRtPH9HQDsC_22UvksL_VSV@hansken.db.elephantsql.com/rdyfbplq"

const db = pgPromise()(connection);
db.connect();

export default db ;