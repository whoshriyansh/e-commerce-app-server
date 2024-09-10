import mongoose from "mongoose";

const ConfigDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log(`MongoDB is sucessfully Connected`);
    })
    .catch((err) => {
      console.log(`Erron while connecting to Database : ${err}`);
    });
};

export default ConfigDB;
