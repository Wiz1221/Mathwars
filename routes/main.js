var postingController = require('../controllers/questionstore');
var archiveController = require('../controllers/archive');
var onevoneController = require('../controllers/onevone');

module.exports = function(app){
  app.get('/Compose', postingController.getPost);
  app.post('/Compose', postingController.storePost);
  app.get('/viewQuestions', archiveController.getArchive);
  // app.get('/1v1', onevoneController.getOneVOne);

}
