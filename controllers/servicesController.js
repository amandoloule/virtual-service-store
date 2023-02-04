'use strict'

const Service = require('../models/service'),
	User = require('../models/user'),
	httpStatus = require('http-status-codes'),
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
		let newService = new Service(getServiceParams(req.body))
		/* Service.create(serviceParams)
			.then(service => {
				res.locals.redirect = '/services'
				res.locals.service = service
				next()
			})
			.catch(error => {
				console.log(`Erro ao salvar Serviço: ${error.message}`)
				next(error)
			}) */
		newService.save((e, savedService) => {
			if (e) {
				req.flash('error', `Falha ao criar o serviço porque: ${e.message}`)
				res.locals.redirect = '/services/new'
				next()
			} else {
				req.flash('success', `Serviço ${savedService.title} criado!`)
				res.locals.redirect = '/services'
				next()
			}
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
	},

	respondJSON: (req, res) => {
		res.json({
			status: httpStatus.StatusCodes.OK,
			data: res.locals
		})
	},

	// eslint-disable-next-line no-unused-vars
	errorJSON: (error, req, res, next) => {
		let errorObject
		if (error) {
			errorObject = {
				status: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR,
				message: error.message
			}
		} else {
			errorObject = {
				status: httpStatus.StatusCodes.OK,
				message: 'Erro Desconhecido.'
			}
		}
		res.json(errorObject)
	},

	filterUserServices: (req, res, next) => {
		let currentUser = res.locals.currentUser
		if (currentUser) {
			let mappedServices = res.locals.services.map((service) => {
				let userJoined = currentUser.services.some((userService) => {
					return userService.equals(service._id)
				})
				return Object.assign(service.toObject(), {joined: userJoined})
			})
			res.locals.services = mappedServices
			next()
		} else {
			next()
		}
	},

	join: (req, res, next) => {
		let serviceId = req.params.id,
			currentUser = req.user
		
		if (currentUser) {
			User.findByIdAndUpdate(currentUser, {
				$addToSet: {
					services: serviceId
				}
			})
				.then(() => {
					res.locals.success = true
					next()
				})
				.catch(error => {
					next(error)
				})
		} else {
			next(new Error('O usuário deve estar logado.'))
		}
	}
}
