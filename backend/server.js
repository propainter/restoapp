const app = require('./app');
const Db = require('./models/Db');

const PlaceTests = require('./test/place-test');
const UserTests = require('./test/user-test');


const PORT = process.env.PORT || 5000;

Db.connect()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Listening on port: ${PORT}`);
    });

  })
  .catch(err => {
    console.log(err);
  });



async function runDataCreation() {
    await UserTests.createUsers(app);
    await PlaceTests.createPlace(app);
}
// UN-COMMENT BLOW TO RUN ONLY IF YOU WANT TO CREATE SAMPLE DATA
//runDataCreation();


