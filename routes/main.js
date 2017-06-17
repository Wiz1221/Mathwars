var postingController = require('../controllers/postquestions');
var archieveController = require('../controllers/archive');
var onevoneController = require('../controllers/onevone');

module.exports = function(app){
  app.get('/PostQuestions', postingController.getPost);
  // app.get('/Archive', archieveController.getArchive);
  // app.get('/1v1', onevoneController.getOneVOne);

}
