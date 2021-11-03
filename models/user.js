const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");


var userSchema = new mongoose.Schema({
   email: {
       required: true,
       type: String,
       unique: true
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
       new: {type: Object, minimize: false},
       1: {type: Object, minimize: false},
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
}, {minimize: false});
   

userSchema.plugin(passportLocalMongoose); //adds on field for username & password that we don't see here

module.exports = mongoose.model("User", userSchema);