const Question = require('../models/questionDB');
const User = require('../models/User');

exports.getArchiveTitle = (req, res)=>{

}

exports.getArchive = (req, res)=>{
Question.find({}, function(err,questions){
  console.log(questions[4].date);
      res.render('pages/archive',{
        title: 'View Questions',
        questions
      });
  });
}
