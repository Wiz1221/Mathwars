var postingController = require('../controllers/questionstore');
var archiveController = require('../controllers/archive');

module.exports = function(app,io){
  app.get('/Compose', postingController.getPost);
  app.post('/Compose', postingController.storePost);

  app.get('/viewQuestions', archiveController.getArchive);
  app.get('/user-question', archiveController.getUserArchive);
  app.get('/questionDetails/:id', archiveController.getQuestionDetails);
  app.put('/questionDetails/:id', archiveController.postAnswer);

  app.get('/questionDetails/updateByUser/:id', archiveController.getQuestionDetailsToUpdate);
  app.put('/questionDetails/updateByUser/:id', archiveController.updateQuestion);
  app.post('/questionDetails/updateByUser/:id', archiveController.postUserAnswer);
  app.delete('/questionDetails/updateByUser/:id', archiveController.removeQuestion);

  app.get('/questionDetails/answerUpdateByUser/:id', archiveController.getToUpdateMyAnswer);
  app.put('/questionDetails/answerUpdateByUser/:id', archiveController.updateAnswer);
  app.delete('/questionDetails/answerUpdateByUser/:id', archiveController.removeAnswer);

}
