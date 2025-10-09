const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.DB_CONNECTION);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { dbConnect };
