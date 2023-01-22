"use strict"

const mongoose = require("mongoose"),
      { Schema } = mongoose,
      Subscriber = require("./subscriber"),
      userSchema = new Schema({
        name: {
          first: {
            type: String,
            trim: true
          },
          last: {
            type: String,
            trim: true
          }
        },
        email: {
          type: String,
          required: true,
          lowercase: true,
          unique: true
        },
        zipCode: {
          type: Number,
          min: [10000000, "CEP muito curto"],
          max: 99999999
        },
        password: {
          type: String,
          required: true
        },
        services: [
          {
            type: Schema.Types.ObjectId,
            ref: "Service"
          }
        ],
        subscribedAccount: {
          type: Schema.Types.ObjectId,
          ref: "Subscriber"
        }
      }, {
        timestamps: true
      })

userSchema.virtual("fullName").get(function() {
  return `${this.name.first} ${this.name.last}`
})

userSchema.pre("save", function(next) {
  let user = this
  if (user.subscribedAccount === undefined) {
    Subscriber.findOne({
      email: user.email
    })
    .then(subscriber => {
      user.subscribedAccount = subscriber
      next()
    })
    .catch(error => {
      console.log(`Erro em conectar ao inscrito: ${error.message}`)
      next(error)
    })
  } else {
    next()
  }
})

module.exports = mongoose.model("User", userSchema)
