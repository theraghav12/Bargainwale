import mongoose from "mongoose";
import Mail from "../models/mail.js"; 

const connectBackupDB = async () => {
  try {
    const backupConnection = mongoose.createConnection(
      process.env.BACKUP_MONGO_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to backup MongoDB.");
    return backupConnection;
  } catch (err) {
    console.error("Error connecting to backup MongoDB:", err);
    throw err; 
  }
};

const backupData = async () => {
  try {
    const newData = await Mail.find({ backedUp: false });

    if (newData.length > 0) {
      console.log(`${newData.length} new documents found to back up.`);

      const backupConnection = await connectBackupDB();

      const BackupMail = backupConnection.model("Mail", Mail.schema);

      for (let item of newData) {
        const backupItem = new BackupMail(item.toObject());
        backupItem._id = undefined; 
        await backupItem.save();
      }

      console.log("Backup completed successfully.");

      await Mail.updateMany(
        { _id: { $in: newData.map((item) => item._id) } },
        { $set: { backedUp: true } }
      );
      console.log("Backed-up documents marked as 'backedUp: true'.");
    } else {
      console.log("No new data to back up.");
    }
  } catch (err) {
    console.error("Error during backup:", err);
  } finally {
    mongoose.connection.close();
  }
};

export default backupData;
