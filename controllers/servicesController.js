'use strict'

const Service = require('../models/service'),
	getServiceParams = body => {
		return {
			title: body.title,
			description: body.description,
			cost: body.cost
		}
	}

module.exports = {
	index: (req, res, next) => {
		Service.find()
			.then(services => {
				res.locals.services = services
				next()
			})
			.catch(error => {
				console.log(`Erro ao obter Serviços: ${error.message}`)
				next(error)
			})
	},

	indexView: (req, res) => {
		res.render('services/index')
	},

	new: (req, res) => {
		res.render('services/new')
	},

	create: (req, res, next) => {
		let serviceParams = getServiceParams(req.body)
		Service.create(serviceParams)
			.then(service => {
				res.locals.redirect = '/services'
				res.locals.service = service
				next()
			})
			.catch(error => {
				console.log(`Erro ao salvar Serviço: ${error.message}`)
				next(error)
			})
	},

	redirectView: (req, res, next) => {
		let redirectPath = res.locals.redirect
		if (redirectPath !== undefined) res.redirect(redirectPath)
		else next()
	},

	show: (req, res, next) => {
		let serviceId = req.params.id
		Service.findById(serviceId)
			.then(service => {
				res.locals.service = service
				next()
			})
			.catch(error => {
				console.log(`Erro ao obter Serviço com ID: ${error.message}`)
				next(error)
			})
	},

	showView: (req, res) => {
		res.render('services/show')
	},

	edit: (req, res, next) => {
		let serviceId = req.params.id
		Service.findById(serviceId)
			.then(service => {
				res.render('services/edit', {
					service: service
				})
			})
			.catch(error => {
				console.log(`Erro ao obter Serviço com ID: ${error.message}`)
				next(error)
			})
	},

	update: (req, res, next) => {
		let serviceId = req.params.id,
			serviceParams = getServiceParams(req.body)
		Service.findByIdAndUpdate(serviceId, {
			$set: serviceParams
		})
			.then(service => {
				res.locals.redirect = `/services/${serviceId}`
				res.locals.service = service
				next()
			})
			.catch(error => {
				console.log(`Erro ao atualizar Serviço com ID: ${error.message}`)
				next(error)
			})
	},

	delete: (req, res, next) => {
		let serviceId = req.params.id
		Service.findByIdAndRemove(serviceId)
			.then(() => {
				res.locals.redirect = '/services'
				next()
			})
			.catch(error => {
				console.log(`Erro ao deletar Serviço com ID: ${error.message}`)
				next()
			})
	}
}
