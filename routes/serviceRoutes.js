'use strict'

const router = require('express').Router(),
	servicesController = require('../controllers/servicesController')

//app.get("/services", homeController.showServices)
router.get('/', servicesController.index, servicesController.indexView)
router.get('/new', servicesController.new)
router.post('/create', servicesController.create, servicesController.redirectView)
router.get('/:id/edit', servicesController.edit)
router.put('/:id/update', servicesController.update, servicesController.redirectView)
router.get('/:id', servicesController.show, servicesController.showView)
router.delete('/:id/delete', servicesController.delete, servicesController.redirectView)

module.exports = router
