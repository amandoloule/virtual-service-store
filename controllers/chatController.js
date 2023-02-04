'use strict'

const Message = require('../models/message')
const User = require('../models/user')

module.exports = io => {
	io.on('connection', client => {
		User.find({ accountType: 'comum' })
			.then(users => {
				client.emit('load-all-users', users)
			})
			.then(() => {
				Message.find({})
					.sort({
						createdAt: -1
					})
					.limit(10)
					.then(messages => {
						client.emit('load-all-messages', messages.reverse())
					})
			})
		
		client.on('load-all-messages-again', () => {
			Message.find({})
				.sort({
					createdAt: -1
				})
				.limit(10)
				.then(messages => {
					client.emit('load-all-messages', messages.reverse())
				})
		})
		
		// console.log('new connection')

		client.on('disconnect', () => {
			// console.log('user disconnected')
		})

		client.on('message', (data) => {
			let messageAttributes = {
					content: data.content,
					userName: data.userName,
					user: data.userId,
					userTo: data.userTo
				},
				m = Message(messageAttributes)
			m.save()
				.then(() => {
					io.emit('message', messageAttributes)
				})
				.catch(error => console.log(`error: ${error.message}`))
		})
	})
}
