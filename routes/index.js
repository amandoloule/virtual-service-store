'use strict'

const router = require('express').Router(),
	homeRoutes = require('./homeRoutes'),
	userRoutes = require('./userRoutes'),
	subscriberRoutes = require('./subscriberRoutes'),
	serviceRoutes = require('./serviceRoutes'),
	errorRoutes = require('./errorRoutes'),
	apiRoutes = require('./apiRoutes')

router.use('/users', userRoutes)
router.use('/services', serviceRoutes)
router.use('/subscribers', subscriberRoutes)
router.use('/api', apiRoutes)
router.use('/', homeRoutes)
router.use('/', errorRoutes)

module.exports = router
