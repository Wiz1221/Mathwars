const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  createdBy: {
    id: String,
    name: String
  },
  answer: [{
    id:String,
    content: String
  }],
  answeredBy: [{
    id: String,
    name: String
  }]
},{timestamps: true
}
);

questionSchema.virtual('date').get(function(){
  return this._id.getTimestamp().getDay() + ' ' + this._id.getTimestamp().getMonth() + ' ' + this._id.getTimestamp().getYear();
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
