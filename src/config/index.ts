const DATABASE_NAME = process.env.DATABASE_NAME || "vaultio";
const HOSTNAME = process.env.DB_HOSTNAME || "localhost";
const PASSWORD = process.env.DB_PASSWORD || "";
// Supports: mysql and postgres
const DIALECT = process.env.DB_DIALECT || "mysql";
const USERNAME = process.env.DB_USERNAME || "root";
const SECRET = process.env.SECRET || "secret";

export { DATABASE_NAME, HOSTNAME, PASSWORD, DIALECT, USERNAME, SECRET };
