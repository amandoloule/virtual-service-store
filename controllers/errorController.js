'use strict'

const httpStatus = require('http-status-codes')

module.exports = {
	pageNotFoundError: (req, res) => {
		let errorCode = httpStatus.StatusCodes.NOT_FOUND
		res.status(errorCode)
		res.render('error')
	},
	
	internalServerError: (error, req, res, next) => {
		let errorCode = httpStatus.StatusCodes.INTERNAL_SERVER_ERROR
		console.log(`ERROR occurred: ${error.stack}`)
		res.status(errorCode)
		res.send(`${errorCode} | Desculpa, nossa aplicação está tirando uma sonequinha...`)
	}
}
