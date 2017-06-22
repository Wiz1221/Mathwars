$(document).ready(function() {

  var userThatInvitedYouArray = [];

  function createInvitationList(currentUserThatInivitedYouFrontEnd){
    console.log('invitation function works')
    if($('#invitations').length==0){
      var intivationDropDownScript = $('#DropDownScript').html();
      intivationDropDownScript = intivationDropDownScript.replace('{{name}}',userThatInvitedYouArray[0].name);
      intivationDropDownScript = intivationDropDownScript.replace('{{userIDThatInvitedYou}}',userThatInvitedYouArray[0].localid);

      if($('[data-userthatInvitedYouId='+currentUserThatInivitedYouFrontEnd.localid+']').length==0){
          var anotherUserInvite = $('<li></li>').attr('data-userthatInvitedYouId', currentUserThatInivitedYouFrontEnd.localid).html(currentUserThatInivitedYouFrontEnd.name);
          $('#invitationList').append(anotherUserInvite)
      }

      $('.toCompete').append(intivationDropDownScript);
    }
  }

  function showUsersSelected(whichUserName,whichUserSID){
    if($('.separator').length==0){
      $('#promptMessage').append($('<div style="height: 10px; border-bottom:2px solid black;"></div>').addClass('separator'));
      $('#promptMessage').append($('<div style="margin-top: 10px;"></div>').html('Selected Users'));
    }
    var newUserSelected = $('<button style="margin-top: 10px;"></button>').html(whichUserName).data('selected', whichUserSID).addClass('selected');
    $('#promptMessage').append(newUserSelected);
  }

  function checkWhichButton(event){
    if($(event.target).hasClass('close')){
      $('#promptMessage').empty();
      $('#activeUserBox').modal('hide');
      $('#activeUserBox').removeClass('chooseUserBox');
    }else if($(event.target).hasClass('invite')){
      socket.emit('invite user',$('.selected').data().selected);
    }else {
      var whichUserSID = $(event.target).data().sid;
      var whichUserName = $(event.target).html();
      $(event.target).remove()
      showUsersSelected(whichUserName,whichUserSID);
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
    //e.preventDefault();
    socket.emit('check connected user');
    showActiveUserBox();
  })

  $(document).on('click','.chooseUserBox button',function(event){
    checkWhichButton(event);
  })

  $(document).on('click','#invitationList a', function(event){
    socket.emit('user accepted invite',$(event.target).data());
  })


  socket = io.connect('/', {secure: true, transports: ['websocket']});

  socket.on('boardcastUser', function(neccessaryUserInfoFrontEnd){
    for(var i=0; i<neccessaryUserInfoFrontEnd.length; i++){
      if($('[data-sid='+neccessaryUserInfoFrontEnd[i].sid+']').length==0){
        var users = $('<button></button>').html(neccessaryUserInfoFrontEnd[i].name).attr('data-sid',neccessaryUserInfoFrontEnd[i].sid).data('sid',neccessaryUserInfoFrontEnd[i].sid);
        $('#promptMessage').append(users);
      }
    }
  })

  socket.on('private invite to compete', function(currentUserThatInivitedYouFrontEnd) {
    userThatInvitedYouArray.push(currentUserThatInivitedYouFrontEnd);
    createInvitationList(currentUserThatInivitedYouFrontEnd);
  })

  socket.on('user have accepted invite, join also',function(whoAcceptedYourInvite, id,room){
    $('#editform').modal('show');
    $('#editform').addClass('acceptBox');
    $(document).on('click','.acceptBox .accept', function(event){

      socket.emit('user that sent invite goes into room', {
        id: id,
        room: room
      });
    })
  })

});
