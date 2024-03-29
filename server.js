const app = require('./app');
const Database = require('./config/Database');

const port = process.env.PORT || 3000;

new Database();

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
});

