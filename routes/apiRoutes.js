'use strict'

const router = require('express').Router(),
	servicesController = require('../controllers/servicesController')

router.get('/services', servicesController.index, servicesController.filterUserServices, servicesController.respondJSON)
router.get('/services/:id/join', servicesController.join, servicesController.respondJSON)
router.use(servicesController.errorJSON)

module.exports = router
