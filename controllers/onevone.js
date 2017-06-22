const Question = require('../models/questionDB');
const User = require('../models/User');
var noOfQuestion = 2;

function chooseRandomQuestion(length){
  var array = [];
  while (array.length<=noOfQuestion){
    var questionNumber = Math.Floor(Math.Random()*length);
    if(array.indexOf(questionNumber) > -1){continue;}
    array.push(questionNumber);
  }
  return array;
}

exports.getOneVOne = (req, res)=>{
  Question.find({}, function(err,questions){
        res.render('pages/onevone',{
          title: '1v1 Competition',
          questions
        });
  });
}

exports.renderCompetitionPage = (req, res)=>{
  res.render('extension/startCompetition',{
    title: 'It\'s War!',
  });
}

exports.getCompetitionQuestions = (req, res)=>{
  Question.find({}, function(err,questions){
    var questionToSend = [];
    var questionOrder = chooseRandomQuestion(questions.length);
    questionOrder.forEach(function(elem,index,arr){
      questionToSend.push(questions[elem]);
    })
    res.send(questionToSend);
  });
}
