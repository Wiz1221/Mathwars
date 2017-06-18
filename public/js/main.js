$(document).ready(function() {

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
  }

  function postQuestionAjax() {

    var newQuestion = {};
    newQuestion.question = $('#inputQuestionWrapper #wmd-input').val();

    if(newQuestion.question!==''){
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
    }
        // // Setup template
        // var tpl = $('#productRowTpl').html();
        // tpl = tpl.replace('{{Id}}', candy.id);
        // tpl = tpl.replace('{{Name}}', candy.name);
        // tpl = tpl.replace('{{Color}}', candy.color);
        // tpl = tpl.replace('{{Price}}', candy.price);
        //
        // // Hide
        // $('#editform').modal('hide');
        //
        // $('[data-id=' + candy.id + ']').fadeOut(function(){
        //   $('[data-id=' + candy.id + ']').replaceWith(tpl);
        //   $('[data-id=' + candy.id + ']').fadeIn();
        // });

    });
  }

  $('body').on('click', '#submitQuestion', function(){
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

});
