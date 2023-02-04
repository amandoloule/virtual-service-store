'use strict'

// var services = [
//   {
//     title: "Site Institucional",
//     cost: 1000
//   },
//   {
//     title: "Loja Virtual",
//     cost: 2000
//   },
//   {
//     title: "App",
//     cost: 2000
//   }
// ];
//
// exports.showIndex = (req, res) => {
//   res.render("index");
// };
// exports.showServices = (req, res) => {
//   res.render("services", {
//     offeredServices: services
//   });
// };
// exports.showSignUp = (req, res) => {
//   res.render("contact");
// };
// exports.postedSignUpForm = (req, res) => {
//   res.render("thanks");
// };

module.exports = {
	index: (req, res) => {
		res.render('index')
	},

	chat: (req, res) => {
		res.render('chat')
	}
}
