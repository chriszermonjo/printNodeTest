module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  database: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || "your_database",
    user: process.env.DB_USER || "your_username",
    password: process.env.DB_PASSWORD || "your_password",
  },
  printNode: {
    apiKey: process.env.PRINTNODE_API_KEY || "your_printnode_api_key",
  },
};
