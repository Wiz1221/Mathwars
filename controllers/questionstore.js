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
  newQuestion.question = req.body.question;
  newQuestion.createdBy = {
    id: req.user.id,
    name: req.user.profile.name
  };
  newQuestion.answer = [];
  newQuestion.answeredBy = [];
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
