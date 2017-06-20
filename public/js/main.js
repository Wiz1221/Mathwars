$(document).ready(function() {

  function showUsersSelected(whichUserName,whichUserArrayPosition){
    if($('.separator').length==0){
      $('#promptMessage').append($('<div style="height: 10px; border-bottom:2px solid black;"></div>').addClass('separator'));
      $('#promptMessage').append($('<div style="margin-top: 10px;"></div>').html('Selected Users'));
    }
    var newUserSelected = $('<button style="margin-top: 10px;"></button>').html(whichUserName).data('selected', whichUserArrayPosition);
    $('#promptMessage').append(newUserSelected);
  }

  function checkWhichButton(event){
    if($(event.target).hasClass('close')){
      $('#promptMessage').empty();
      $('#activeUserBox').modal('hide');
      $('#activeUserBox').removeClass('chooseUserBox');
    }else if($(event.target).hasClass('invite')){

    }else {
      var whichUserArrayPosition = $(event.target).data().id;
      var whichUserName = $(event.target).html();
      socket.emit('user selected', $(event.target).data().id);
      $(event.target).remove()
      showUsersSelected(whichUserName,whichUserArrayPosition);
    }
  }

  function showActiveUserBox(){
    $('#activeUserBox').modal('show');
    $('#activeUserBox').addClass('chooseUserBox');
    $('#promptMessageTitle').html('Choose someone to compete with');
    $('#promptMessage').html('');
  }

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
  $('body').on('click', '#Proportions', function(e){
    e.preventDefault();
    socket.emit('check connected user');
    showActiveUserBox();
  })

  $(document).on('click','.chooseUserBox button',function(event){
    checkWhichButton(event);
  })

  socket = io.connect('/', {secure: true, transports: ['websocket']});

  socket.on('boardcastUser', function(connectedUser){
    console.log(connectedUser);
    for(var i=0; i<connectedUser.length; i++){
      var users = $('<button></button>').html(connectedUser[i].profile.name).data('id',i);
      $('#promptMessage').append(users);
    }
  })






  socket.on('broadcast message', function (data) {
    console.log(data);

    var msg = $('<div>').text(data);
    $('#chat').append(msg);
  });

  $('#chat button').on('click', function(e){
      e.preventDefault();
      var message = $('#chat input').val();
      socket.emit('newMessage', message);
      $('#chat input').val('');
  });

});
