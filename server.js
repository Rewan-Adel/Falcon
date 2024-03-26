const app = require('./app');
const db = require('./config/db');
const port = process.env.PORT || 3000;

db.then(()=>{
    console.log("DB Sync....")
}).catch((err)=>{
    console.log('Error database message: ', err.message);
    return 'Unable to connect to the database';
})
;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
