const app = require('./app');
// const Database = require('./config/Database');

const port = process.env.PORT || 3000;

// const db = new Database().initDB();

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
});

// module.exports = db;
