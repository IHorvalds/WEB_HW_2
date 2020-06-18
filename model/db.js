const db = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

db.connect(
    process.env.DB_CREDS, 
    {useNewUrlParser: true},
    () => {console.log("Successfully connected to Mongo")}
);