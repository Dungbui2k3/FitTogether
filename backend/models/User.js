const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    FullName: String,
    Email: String,
    Password: String,
    Phone: String,
    Address: String,
    RoleID: mongoose.Schema.Types.ObjectId, // tham chiếu tới Role
});

module.exports = mongoose.model("User", userSchema);
