'use strict'

const User = require('../models/user'),
	passport = require('passport'),
	getUserParams = body => {
		return {
			name: {
				first: body.first,
				last: body.last
			},
			email: body.email,
			password: body.password,
			//zipCode: body.zipCode,
			accountType: body.accountType != null ? body.accountType : 'comum'  
		}
	}

module.exports = {
	index: (req, res, next) => {
		User.find()
			.then(users => {
				res.locals.users = users
				next()
			})
			.catch(error => {
				console.log(`Erro ao obter usuários: ${error.message}`)
				next(error)
			})
	},

	indexView: (req, res) => {
		res.render('users/index')
	},

	new: (req, res) => {
		res.render('users/new')
	},

	create: (req, res, next) => {
		if (req.skip) return next()

		let newUser = new User(getUserParams(req.body))

		/* User.create(userParams)
			.then(user => {
				res.locals.redirect = '/users'
				res.locals.user = user
				next()
			})
			.catch(error => {
				console.log(`Erro ao salvar usuário: ${error.message}`)
				next(error)
			}) */
		User.register(newUser, req.body.password, (e, user) => {
			if (user) {
				req.flash('success', `Conta de ${user.fullName} criada!`)
				res.locals.redirect = '/'
				next()
			} else {
				req.flash('error', `Falha ao criar a conta porque: ${e.message}`)
				res.locals.redirect = '/users/new'
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
		let userId = req.params.id
		User.findById(userId)
			.then(user => {
				res.locals.user = user
				next()
			})
			.catch(error => {
				console.log(`Erro ao obter usuário com ID: ${error.message}`)
				next(error)
			})
	},

	showView: (req, res) => {
		res.render('users/show')
	},

	edit: (req, res, next) => {
		let userId = req.params.id
		User.findById(userId)
			.then(user => {
				res.render('users/edit', {
					user: user
				})
			})
			.catch(error => {
				console.log(`Erro ao obter usuário com ID: ${error.message}`)
				next(error)
			})
	},

	update: (req, res, next) => {
		if (req.skip) return next()

		let userId = req.params.id,
			userParams = getUserParams(req.body)
		delete userParams.password
		User.findByIdAndUpdate(userId, {
			$set: userParams
		})
			.then(user => {
				res.locals.redirect = `/users/${userId}`
				res.locals.user = user
				next()
			})
			.catch(error => {
				console.log(`Erro ao atualizar usuário com ID: ${error.message}`)
				next(error)
			})
	},

	delete: (req, res, next) => {
		let userId = req.params.id
		User.findByIdAndRemove(userId)
			.then(() => {
				res.locals.redirect = '/users'
				next()
			})
			.catch(error => {
				console.log(`Erro ao deletar usuário com ID: ${error.message}`)
				next()
			})
	},

	login: (req, res) => {
		res.render('users/login')
	},

	authenticate: passport.authenticate('local', {
		failureRedirect: '/users/login',
		failureFlash: ' Houve uma falha no login. ',
		successRedirect: '/',
		successFlash: 'Você está logado!'
	}),
	/* authenticate: passport.authenticate('local', {
		failureRedirect: '/users/login',
		failureFlash: 'Houve uma falha no login.' }),
	function(req, res, next) {
		req.flash('success', 'Você está logado!')
		res.locals.redirect = '/'
		next()
	}, */

	validate: (req, res, next) => {
		let userId = req.params.id
		if (userId == null) {
			req
				.check('first', 'O campo Nome não pode estar em branco')
				.notEmpty()
			req
				.check('last', 'O campo Sobrenome não pode estar em branco')
				.notEmpty()
			req
				.sanitizeBody('email')
				.normalizeEmail({
					all_lowercase: true
				})
				.trim()
			req.check('email', 'E-mail é inválido').isEmail()
			/* req
				.check('zipCode', 'CEP é inválido')
				.notEmpty()
				.isInt()
				.isLength({
					min: 8,
					max: 8
				})
				.equals(req.body.zipCode) */
			req.check('password', 'O campo Senha não pode estar em branco').notEmpty()
		} else {
			req
				.check('first', 'O campo Nome não pode estar em branco')
				.notEmpty()
			req
				.check('last', 'O campo Sobrenome não pode estar em branco')
				.notEmpty()
			req
				.sanitizeBody('email')
				.normalizeEmail({
					all_lowercase: true
				})
				.trim()
			req.check('email', 'E-mail é inválido').isEmail()
		}
		
		req.getValidationResult().then((error) => {
			if (!error.isEmpty()) {
				let messages = error.array().map(e => e.msg)
				req.skip = true
				req.flash('error', messages.join(' e '))
				res.locals.redirect = userId == null ? '/users/new' : `/users/${userId}/edit`
				next()
			} else {
				next()
			}
		})
	},

	validateLogin: (req, res, next) => {
		req
			.sanitizeBody('email')
			.normalizeEmail({
				all_lowercase: true
			})
			.trim()
		req.check('email', ' E-mail é inválido ').isEmail()
		req.check('password', ' O campo Senha não pode estar em branco ').notEmpty()

		req.getValidationResult().then((error) => {
			if (!error.isEmpty()) {
				let messages = error.array().map(e => e.msg)
				req.skip = true
				req.flash('error', messages.join(' e '))
				res.locals.redirect = '/users/login'
				next()
			} else {
				next()
			}
		})
	},

	logout: (req, res, next) => {
		req.logout(function(err) {
			if (err) { return next(err) }
			req.flash('success', 'Você não está mais logado!')
			res.locals.redirect = '/'
			next()
		})
	}
}
