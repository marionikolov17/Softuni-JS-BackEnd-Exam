const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required!"],
        minLength: 10,
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        minLength: 4
    }
}, {
    virtuals: {
        rePassword: {}
    }
});

userSchema.pre("save", async function (next) {
    if (this.password !== this.rePassword) {
        throw new Error("Passwords must match!");
    }

    const hashedPassword = await bcrypt.hash(this.password, 10);

    this.password = hashedPassword;

    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;