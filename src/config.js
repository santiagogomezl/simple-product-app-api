module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'developmment',
    // CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'https://localhost/',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dunder_mifflin@localhost/simple-product',
    // API_BASE_URL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api"

}