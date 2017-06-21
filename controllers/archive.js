const Question = require('../models/questionDB');
const User = require('../models/User');

exports.getArchive = (req, res)=>{
  Question.find({}, function(err,questions){
    console.log(questions)
      res.render('pages/archive',{
        title: 'View Questions',
        questions
      });
  });
}

exports.getUserArchive = (req, res) => {
  Question.find({'createdBy.id':req.user.id}, function(err,questionByUser){
    Question.find({'answer':{$elemMatch:{'answeredBy.id':req.user.id}}}, function(err,answerByUser){
        res.render('pages/userArchive',{
          title: 'View Questions',
          questionByUser,
          answerByUser
        });
      });
    });
}

exports.getQuestionDetails = (req, res) => {
  Question.find({'_id':req.params.id}, function(err,questions){
    res.render('extension/questionDetails',{
      title: 'Questions Details',
      questions
    });
  });
}

exports.getQuestionDetailsToUpdate = (req, res) => {
  Question.find({'_id':req.params.id}, function(err,questions){
    res.render('extension/questionUpdateByUser',{
      title: 'Questions Details',
      questions
    });
  });
}

exports.updateAnswer = (req, res) => {
  if(!req.user){
    res.send(['Please Login']);
  }else{
      Question.findOneAndUpdate({'_id':req.params.id} , {
        '$push':{'answer': {
          content: req.body.content,
          answeredBy:{
            id: req.user.id,
            name: req.user.profile.name
          }
        }}
      }, {'new':true}
      , function(err,question){
      if(err){console.log(err); return;}
    })
    res.send(['successful update']);
  }
}
