const bracketsController = require('../controllers/brackets.js');

module.exports = (app) => {
    app.post('/submit', bracketsController.create);
};