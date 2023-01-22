"use strict"

/* const mongoose = require("mongoose"),
      subscriberSchema = mongoose.Schema({
        name: String,
        email: String,
        zipCode: Number
      }); */

const mongoose = require("mongoose"),
      { Schema } = mongoose,
      subscriberSchema = new Schema({
        name: {
          type: String,
          required: true
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
        services: [{type: Schema.Types.ObjectId, ref: "Service"}]
      }, {
        timestamps: true
      })

subscriberSchema.methods.getInfo = function() {
  return `Nome: ${this.name} E-mail: ${this.email} CEP: ${this.zipCode}`
}

module.exports = mongoose.model("Subscriber", subscriberSchema)
