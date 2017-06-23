$(document).ready(function() {

  // function createInvitationList(data){
  //   console.log('invitation function works')
  //   if($('#invitations').length==0){
  //     var intivationDropDownScript = $('#DropDownScript').html();
  //     intivationDropDownScript = intivationDropDownScript.replace('{{name}}',data.user.name);
  //     intivationDropDownScript = intivationDropDownScript.replace('{{room}}',data.room);
  //
  //     if($('[data-room='+data.room+']').length==0){
  //         var anotherUserInvite = $('<li></li>').attr('data-userthatInvitedYouId', currentUserThatInivitedYouFrontEnd.localid).html(currentUserThatInivitedYouFrontEnd.name);
  //         $('#invitationList').append(anotherUserInvite)
  //     }
  //
  //     $('.toCompete').append(intivationDropDownScript);
  //   }
  // }
  //
  // function showUsersSelected(whichUserName,whichUserSID){
  //   if($('.separator').length==0){
  //     $('#promptMessage').append($('<div style="height: 10px; border-bottom:2px solid black;"></div>').addClass('separator'));
  //     $('#promptMessage').append($('<div style="margin-top: 10px;"></div>').html('Selected Users'));
  //   }
  //   var newUserSelected = $('<button style="margin-top: 10px;"></button>').html(whichUserName).data('selected', whichUserSID).addClass('selected');
  //   $('#promptMessage').append(newUserSelected);
  // }
  //
  // function checkWhichButton(event){
  //   if($(event.target).hasClass('close')){
  //     $('#promptMessage').empty();
  //     $('#activeUserBox').modal('hide');
  //     $('#activeUserBox').removeClass('chooseUserBox');
  //   }else if($(event.target).hasClass('invite')){
  //
  //   }else {
  //     var whichUserSID = $(event.target).data().sid;
  //     var whichUserName = $(event.target).html();
  //     $(event.target).remove()
  //     showUsersSelected(whichUserName,whichUserSID);
  //   }
  // }
  //
  // function showActiveUserBox(){
  //   $('#activeUserBox').modal('show');
  //   $('#activeUserBox').addClass('chooseUserBox');
  //   $('#promptMessageTitle').html('Choose someone to compete with');
  //   $('#promptMessage').html('');
  // }

  var userThatInvitedYouArray = [];
  var mathButtons=[
    '$\\theta$',
    '$\\cos$',
    '$\\sin$',
    '$\\pi$',
    '$\\alpha$',
    '$\\beta$',
    '$\\mu$',
    '$x^{n}$',
    '$\\binom{n}{r}$',
    '$\\frac{x}{y}$',
    '$\\sqrt{x}$',
    '$\\displaystyle\\sum_{r=1}^{n}$',
    '$\\int_0^1 f(x)\\,\\mathrm{d}x$',
    '$\\int f(x)\\,\\mathrm{d}x$',
    '$| x |$',
    '$\\frac{\\mathrm dy}{\\mathrm d x}$',
    '$\\frac{\\mathrm d}{\\mathrm d x}\\left( f(x) \\right)$',
    '$\\mathbb{R}$',
    '$\\mathbb{Z}$',
    '$\\forall$',
    '$\\in$'
  ]


  function postAnswerAjax(useUrl){
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


  function putSymbol(buttonPressed,num){
    var htmlElement;
    if(num==1){
      htmlElement = $('.row .col-sm-7 #inputQuestionWrapper #wmd-input');
    }else{
      htmlElement = $('.row .col-sm-7 #inputAnswerWrapper #Answer');
    }
    var toInsert = mathButtons[buttonPressed];
    console.log(toInsert)
    var current = htmlElement.val();
    console.log(current);
    var plusSymbol = current + ' ' + toInsert;
    htmlElement.val(plusSymbol);

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

  function postQuestionAjax(useUrl,useMethod) {

    var newQuestion = {};
    newQuestion.title = $('#Title').val();
    newQuestion.topic = $('#Topic').val();
    newQuestion.content = $('#inputQuestionWrapper #wmd-input').val();
    newQuestion.answer = $('#Answer').val();

    if(newQuestion.content!=='' && newQuestion.title!=='' && newQuestion.topic!==''){
      $.ajax({
        method: useMethod,
        url: useUrl,
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

  function postUserAnswerAjax(){
    var newAnswer = {};
    newAnswer.content = $('#Answer').val();
    var questionID = $('#questionPreview #getQuestionId').data();

    if(newAnswer.content!==''){
      $.ajax({
        method: 'POST',
        url: '/questionDetails/updateByUser/'+questionID.id,
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

  function deleteQuestionAjax(){
    var questionID = $('#questionPreview #getQuestionId').data();
      $.ajax({
        method: 'delete',
        url: '/questionDetails/updateByUser/'+questionID.id,
      }).done(function(data){
          if(data[0]==='Please Login'){
            promptLogin();
          }else{
            promptSuccess();
          }
        });
  }

  function deleteAnswerAjax(){
    var questionID = $('#questionPreview #getQuestionId').data();
      $.ajax({
        method: 'delete',
        url: '/questionDetails/answerUpdateByUser/'+questionID.id,
      }).done(function(data){
          if(data[0]==='Please Login'){
            promptLogin();
          }else{
            promptSuccess();
          }
        });
  }

  /*
  * Setup Event Listener
  */
  $('.row .col-sm-5 #mathSymbolWrapperQuestion').on('click', 'button', function(event){
    console.log('math button clilcked qn');
    var buttonPressed = $('#mathSymbolWrapperQuestion button').index(this);
    putSymbol(buttonPressed, 1);
  })
  $('.row .col-sm-5 #mathSymbolWrapperAnswer').on('click', 'button', function(event){
    var buttonPressed = $('#mathSymbolWrapperAnswer button').index(this);
    putSymbol(buttonPressed, 2);
  })

  $('body').on('click', '#submitAll', function(){
    postQuestionAjax('/Compose', 'POST');
  })
  $(document).on('click','.loginBox .close',function(){
    $('#editform').modal('hide');
    $('#editform').removeClass('loginBox');
  })
  $(document).on('click','.successBox .close',function(){
    $('#editform').modal('hide');
    $('#editform').removeClass('successBox');
  })
  $('body').on('click', '#submitAnswer', function(){
    //var questionId = $('#getQuestionId').data()
    postAnswerAjax();
  })
  $('body').on('click', '#updateQuestion', function(){
    var questionId = $('#getQuestionId').data()
    console.log(questionId)
    postQuestionAjax('/questionDetails/updateByUser/'+questionId.id, 'PUT')
  })
  $('body').on('click', '#postAnswer', function(){
    var questionId = $('#getQuestionId').data()
    postUserAnswerAjax();
  })
  $('body').on('click', '#updateAnswer', function(){
    var questionId = $('#getQuestionId').data()
    postAnswerAjax('/questionDetails/answerUpdateByUser/'+questionId.id);
  })
  $('body').on('click', '#deleteQuestion', function(){
    deleteQuestionAjax();
  })
  $('body').on('click', '#deleteAnswer', function(){
    deleteAnswerAjax();
  })



  // $('body').on('click', '#Proportions', function(e){
  //   //e.preventDefault();
  //   socket.emit('check connected user');
  //   showActiveUserBox();
  // })
  //
  // $(document).on('click','.chooseUserBox button',function(event){
  //   checkWhichButton(event);
  // })
  // $(document).on('click','.chooseUserBox a',function(event){
  //   console.log('invite works')
  //   socket.emit('invite user',$('.selected').data().selected);
  // })
  //
  // $(document).on('click','#invitationList button', function(event){
  //   socket.emit('user accepted invite',$(event.target).data());
  // })


  // socket = io.connect('/', {secure: true, transports: ['websocket']});
  //
  // socket.on('boardcastUser', function(neccessaryUserInfoFrontEnd){
  //   for(var i=0; i<neccessaryUserInfoFrontEnd.length; i++){
  //     if($('[data-sid='+neccessaryUserInfoFrontEnd[i].sid+']').length==0){
  //       var users = $('<button></button>').html(neccessaryUserInfoFrontEnd[i].name).attr('data-sid',neccessaryUserInfoFrontEnd[i].sid).data('sid',neccessaryUserInfoFrontEnd[i].sid);
  //       $('#promptMessage').append(users);
  //     }
  //   }
  // })
  //
  // socket.on('private invite to compete', function(data) {
  //   userThatInvitedYouArray.push(data.user);
  //   createInvitationList(data);
  // })

  // socket.on('user have accepted invite, join also',function(whoAcceptedYourInvite, id,room){
  //   $('#editform').modal('show');
  //   $('#editform').addClass('acceptBox');
  //   $(document).on('click','.acceptBox .accept', function(event){
  //     console.log('button clicked')
  //     socket.emit('user that sent invite goes into room', {
  //       id: id,
  //       room: room
  //     });
  //   })
  // })

});
