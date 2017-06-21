var postingController = require('../controllers/questionstore');
var archiveController = require('../controllers/archive');
var onevoneController = require('../controllers/onevone');

module.exports = function(app,io){
  app.get('/Compose', postingController.getPost);
  app.post('/Compose', postingController.storePost);
  app.get('/viewQuestions', archiveController.getArchive);
  app.get('/user-question', archiveController.getUserArchive);
  app.get('/questionDetails/:id', archiveController.getQuestionDetails);
  app.put('/questionDetails/:id', archiveController.updateAnswer);
  app.get('/questionDetails/updateByUser/:id', archiveController.getQuestionDetailsToUpdate);
  app.get('/1v1', onevoneController.getOneVOne);
  app.get('/startCompetition', onevoneController.renderCompetitionPage);
  app.post('/startCompetition', onevoneController.getCompetitionQuestions);

}
