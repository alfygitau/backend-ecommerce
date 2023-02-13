const mongoose = require("mongoose");
const connectDb = async () => {
  try {
    let conn = await mongoose.connect(process.env.mongoUri);
    console.log(`Connection to mongo Db successful`.red);
    console.log("host", conn.connection.host.blue.bold)
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = connectDb;
