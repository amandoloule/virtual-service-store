'use strict'

/* const Subscriber = require("../models/subscriber");

exports.getAllSubscribers = (req, res) => {
  Subscriber.find({})
    .exec()
    .then((subscribers) => {
      res.render("subscribers", {
        subscribers: subscribers
      });
    })
    .catch((error) => {
      console.log(error.message);
      return [];
    })
    .then(() => {
      console.log("promise complete");
    });
};

exports.getSubscriptionPage = (req, res) => {
  res.render("contact");
};

exports.saveSubscriber = (req, res) => {
  let newSubscriber = new Subscriber({
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode
  });

  newSubscriber.save()
    .then(() => {
      res.render("thanks");
    })
    .catch(error => {
      res.send(error);
    });
}; */
const Subscriber = require('../models/subscriber'),
	getSubscriberParams = body => {
		return {
			name: body.name,
			email: body.email,
			zipCode: parseInt(body.zipCode)
		}
	}

module.exports = {
	index: (req, res, next) => {
		Subscriber.find()
			.then(subscribers => {
				res.locals.subscribers = subscribers
				next()
			})
			.catch(error => {
				console.log(`Erro ao obter Inscritos: ${error.message}`)
				next(error)
			})
	},

	indexView: (req, res) => {
		res.render('subscribers/index')
	},

	new: (req, res) => {
		res.render('subscribers/new')
	},

	create: (req, res, next) => {
		let subscriberParams = getSubscriberParams(req.body)
		Subscriber.create(subscriberParams)
			.then(subscriber => {
				res.locals.redirect = '/subscribers'
				res.locals.subscriber = subscriber
				next()
			})
			.catch(error => {
				console.log(`Erro ao salvar Inscrito: ${error.message}`)
				next(error)
			})
	},

	redirectView: (req, res, next) => {
		let redirectPath = res.locals.redirect
		if (redirectPath !== undefined) res.redirect(redirectPath)
		else next()
	},

	show: (req, res, next) => {
		let subscriberId = req.params.id
		Subscriber.findById(subscriberId)
			.then(subscriber => {
				res.locals.subscriber = subscriber
				next()
			})
			.catch(error => {
				console.log(`Erro ao obter Inscrito com ID: ${error.message}`)
				next(error)
			})
	},

	showView: (req, res) => {
		res.render('subscribers/show')
	},

	edit: (req, res, next) => {
		let subscriberId = req.params.id
		Subscriber.findById(subscriberId)
			.then(subscriber => {
				res.render('subscribers/edit', {
					subscriber: subscriber
				})
			})
			.catch(error => {
				console.log(`Erro ao obter Inscrito com ID: ${error.message}`)
				next(error)
			})
	},

	update: (req, res, next) => {
		let subscriberId = req.params.id,
			subscriberParams = getSubscriberParams(req.body)
		Subscriber.findByIdAndUpdate(subscriberId, {
			$set: subscriberParams
		})
			.then(subscriber => {
				res.locals.redirect = `/subscribers/${subscriberId}`
				res.locals.subscriber = subscriber
				next()
			})
			.catch(error => {
				console.log(`Erro ao atualizar Inscrito com ID: ${error.message}`)
				next(error)
			})
	},

	delete: (req, res, next) => {
		let subscriberId = req.params.id
		Subscriber.findByIdAndRemove(subscriberId)
			.then(() => {
				res.locals.redirect = '/subscribers'
				next()
			})
			.catch(error => {
				console.log(`Erro ao atualizar Inscrito com ID: ${error.message}`)
				next()
			})
	}
}
