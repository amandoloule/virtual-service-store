"use strict"

const mongoose = require("mongoose"),
      { Schema } = mongoose,
      serviceSchema = new Schema({
        title: {
          type: String,
          required: true,
          unique: true
        },
        description: {
          type: String,
          required: true
        },
        cost: {
          type: Number,
          default: 0,
          min: [0, "Um serviço não pode ter um valor negativo"]
        }
      }, {
        timestamps: true
      })

module.exports = mongoose.model("Service", serviceSchema)
