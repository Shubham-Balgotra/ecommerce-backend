const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: function () {
      return !this.fromGoogle;
    },
  },
  lastName: {
    type: String,
    required: function () {
      return !this.fromGoogle;
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.fromGoogle;
    },
  },
  fromGoogle: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["USER", "ADMIN", "CUSTOMER"], // Add CUSTOMER
    default: "USER",
  },
  mobile: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\+?\d{10,15}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  address: [{ type: mongoose.Schema.Types.ObjectId, ref: "address" }],
  paymentInformation: [
    {
      type: String,
    },
  ],
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ratings",
    },
  ],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reviews",
    },
  ],
});

const User = mongoose.model("users", userSchema);
module.exports = User;