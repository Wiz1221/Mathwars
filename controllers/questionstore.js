const Question = require('../models/questionDB');
const User = require('../models/User');
const uuidV4 = require('uuid/v4');

exports.getPost = (req, res)=>{
  res.render('pages/postquestions',{
    title: 'Compose'
  })
}

exports.storePost = (req, res, next) => {
  if(!req.user){
    res.send(['Please Login']);
  }else{
    const newQuestion = new Question();
    newQuestion.question = {
      title: req.body.title,
      topic: req.body.topic,
      content: req.body.content
    }
    newQuestion.createdBy = {
      id: req.user.id,
      name: req.user.profile.name
    };
    if(req.body.answer!==''){
      newQuestion.answer = [];
      newQuestion.answer.push({
        content:req.body.answer,
        answeredBy: {
          id: req.user.id,
          name: req.user.profile.name
        }
      })
    }else{
      newQuestion.answer = '';
      newQuestion.answeredBy = [];
    }
    newQuestion.save(
      function(err){
        if(err){
          console.log(err);
        }
      //   return done(null, newQuestion, req.flash('loginMessage', 'Logged in successfully'));
    });
    res.json(newQuestion);
}
}
