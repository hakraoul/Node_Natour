const dotenv = require('dotenv');

dotenv.config({ path: './config.env' }); //read the environment variable in config then will store it

const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
