const express = require('express')
const route = express.Router();
const Controller = require('./PunishmentController')

route.get('/',Controller.index);
route.post('/',Controller.store);
route.get('/session',Controller.session);
route.get('/employee/:id?',Controller.employee);
route.get('/:id',Controller.show);
route.put('/:id',Controller.update);
route.delete('/:id',Controller.destroy);
module.exports = route
