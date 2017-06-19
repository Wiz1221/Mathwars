const Question = require('../models/questionDB');
const User = require('../models/User');

exports.getOneVOne = (req, res)=>{
  Question.find({}, function(err,questions){
        res.render('pages/onevone',{
          title: '1v1 Competition',
          questions
        });
  });
}
