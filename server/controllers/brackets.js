const Bracket = require('../models').Bracket;

module.exports = {
    create(req, res) {
        return Bracket
            .create({
                predictions: JSON.parse(req.body.predictions),
                name: req.body.name,
                email: req.body.email
            })
            .then(bracket => res.status(201).send(bracket))
            .catch(error => res.status(400).send(error));
    },
    list(req, res) {
        return Todo
            .all()
            .then(todos => res.status(200).send(todos))
            .catch(error => res.status(400).send(error));
    },
};