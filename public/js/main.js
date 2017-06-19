$(document).ready(function() {

  function postAnswerAjax(){
    var newAnswer = {};
    newAnswer.content = $('#Answer').val();
    var questionID = $('#questionPreview #getQuestionId').data();

    if(newAnswer.content!==''){
      $.ajax({
        method: 'PUT',
        url: '/questionDetails/'+questionID.id,
        data: newAnswer
      }).done(function(data){
          $('#Answer').val('');
          if(data[0]==='Please Login'){
            promptLogin();
          }else{
            promptSuccess();
          }
        });
    }
  }

  function putSymbol(event){
    console.log($(event.target));
    var questionInput = $('#inputQuestionWrapper #wmd-input');
    var buttonPressed = $(event.target);
    var current = questionInput.val();
    var plusSymbol = current + ' ' + buttonPressed.html();
    questionInput.val(plusSymbol);
  }

  function promptSuccess(){
    $('#editform').modal('show');
    $('#editform').addClass('successBox');
  }

  function promptLogin(){
    $('#editform').modal('show');
    $('#editform').addClass('loginBox');
    $('#promptMessageTitle').html('Error');
    $('#promptMessage').html('Please Login in order to post questions');
  }

  function resetModal(){
     $('#inputQuestionWrapper #wmd-input').val('');
     $('#Title').val('');
     $('#Topic').val('');
     $('#Answer').val('');
  }

  function postQuestionAjax() {

    var newQuestion = {};
    newQuestion.title = $('#Title').val();
    newQuestion.topic = $('#Topic').val();
    newQuestion.content = $('#inputQuestionWrapper #wmd-input').val();
    newQuestion.answer = $('#Answer').val();

    if(newQuestion.content!=='' && newQuestion.title!=='' && newQuestion.topic!==''){
      $.ajax({
        method: 'POST',
        url: '/Compose',
        data: newQuestion
      }).done(function(data){
          resetModal();
          if(data[0]==='Please Login'){
            promptLogin();
          }else{
            promptSuccess();
          }
        });
    }
  }

  /*
  * Setup Event Listener
  */
  $('.row .col-sm-5 #mathSymbolWrapper').on('click', 'button', function(event){
    console.log('math button clilcked');
    putSymbol(event);
  })

  $('body').on('click', '#submitAll', function(){
    postQuestionAjax();
  })
  $('.loginBox').on('click','.close',function(){
    $('#editform').modal('hide');
    $('#editform').removeClass('loginBox');
  })
  $('.successBox').on('click','.close',function(){
    $('#editform').modal('hide');
    $('#editform').removeClass('successBox');
  })
  $('body').on('click', '#submitAnswer', function(){
    postAnswerAjax();
  })
  // $('#questionPreview').on('click', 'button', function(event){
  //   questionDetailsAjax(event);
  // })

});
