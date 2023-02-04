'use strict'

const mongoose = require('mongoose'),
	{ Schema } = mongoose,
	messageSchema = new Schema({
		content: {
			type: String,
			required: true
		},
		userName: {
			type: String,
			required: true
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		userTo: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	}, { timestamps: true })

module.exports = mongoose.model('Message', messageSchema)
