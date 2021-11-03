var mongoose = require("mongoose");

var userDataSchema = new mongoose.Schema({
    author: {
        id: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
        username: String
     },
   language: String,
   firstRound: {
        type: Boolean,
        default: true
    },
    session: {
        type: Number,
        default: 0
    },
    words: {
       new: Object,
       1: Object,
       2: Object,
       3: Object,
       4: Object,
       5: Object,
       6: Object,
       7: Object,
       8: Object,
       9: Object,
       10: Object,
       retired: Object
   }
});

module.exports = mongoose.model("UserData", userDataSchema);