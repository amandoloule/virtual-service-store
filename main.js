"use strict"

const express = require("express"),
      homeController = require("./controllers/homeController"),
      errorController = require("./controllers/errorController"),
      usersController = require("./controllers/usersController"),
      servicesController = require("./controllers/servicesController"),
      subscribersController = require("./controllers/subscribersController"),
      layouts = require("express-ejs-layouts"),
      mongoose = require("mongoose"),
      methodOverride = require("method-override")

const app = express(),
      router = express.Router()

//mongoose.Promise = global.Promise

mongoose.connect(
  "mongodb://localhost:27017/loulesoft",
  { useNewUrlParser: true }
)

app.set("port", process.env.PORT || 3000)
app.set("view engine", "ejs")

router.use(
  express.urlencoded({
    extended: false
  })
)
router.use(express.json())
router.use(layouts)
router.use(express.static("public"))
router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
)

// app.get("/", (req, res) => {
//   res.send("Bem-vindo à LouleSoft")
// })

router.get("/", homeController.index)
router.get("/users", usersController.index, usersController.indexView)
router.get("/users/new", usersController.new)
router.post("/users/create", usersController.create, usersController.redirectView)
router.get("/users/:id/edit", usersController.edit)
router.put("/users/:id/update", usersController.update, usersController.redirectView)
router.get("/users/:id", usersController.show, usersController.showView)
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView)
//app.get("/services", homeController.showServices)
router.get("/services", servicesController.index, servicesController.indexView)
router.get("/services/new", servicesController.new)
router.post("/services/create", servicesController.create, servicesController.redirectView)
router.get("/services/:id/edit", servicesController.edit)
router.put("/services/:id/update", servicesController.update, servicesController.redirectView)
router.get("/services/:id", servicesController.show, servicesController.showView)
router.delete("/services/:id/delete", servicesController.delete, servicesController.redirectView)
// app.get("/subscribers", subscribersController.getAllSubscribers)
// app.get("/contact", subscribersController.getSubscriptionPage)
// app.post("/subscribe", subscribersController.saveSubscriber)
router.get("/subscribers", subscribersController.index, subscribersController.indexView)
router.get("/subscribers/new", subscribersController.new)
router.post("/subscribers/create", subscribersController.create, subscribersController.redirectView)
router.get("/subscribers/:id/edit", subscribersController.edit)
router.put("/subscribers/:id/update", subscribersController.update, subscribersController.redirectView)
router.get("/subscribers/:id", subscribersController.show, subscribersController.showView)
router.delete("/subscribers/:id/delete", subscribersController.delete, subscribersController.redirectView)
//app.post("contact", homeController.postedSignUpForm)

router.use(errorController.pageNotFoundError)
router.use(errorController.internalServerError)

app.use("/", router)

app.listen(app.get("port"), () => {
  console.log(
    `Server running at http://localhost:${app.get("port")}`
  )
})
