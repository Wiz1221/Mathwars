$(document).ready(function() {

  var mathButtons=[
    '\\theta',
    '\\cos',
    '\\sin',
    '\\pi',
    '\\alpha',
    '\\beta',
    '\\mu',
    '\\mathbb{R}',
    '\\mathbb{Z}',
    '\\forall',
    '\\in',
    'x^{n}',
    '| x |',
    '\\binom{n}{r}',
    '\\frac{x}{y}',
    '\\sqrt{x}',
    '\\displaystyle\\sum_{r=1}^{n}',
    '\\int_0^1 f(x)\\,\\mathrm{d}x',
    '\\int f(x)\\,\\mathrm{d}x',
    '\\frac{\\mathrm dy}{\\mathrm d x}',
    '\\frac{\\mathrm d}{\\mathrm d x}\\left( f(x) \\right)',
  ]

  var preview = $('.row .col-sm-7 #inputQuestionWrapper #preview');
  var previewAnswer = $('.row .col-sm-7 #inputAnswerWrapper #preview');

  var QUEUE = MathJax.Hub.queue;
  var mathQuestion = null;
  var mathAnswer = null;
  QUEUE.Push(function () {
    mathQuestion = MathJax.Hub.getAllJax("preview")[0];
  });
  QUEUE.Push(function () {
    mathAnswer = MathJax.Hub.getAllJax("previewAnswer")[0];
  });

  function putSymbol(buttonPressed,num){
    // var htmlElement = $('.row .col-sm-7 #inputQuestionWrapper #wmd-input');
    // currentPreview = preview.html()
    if(num==1){
      htmlElement = $('.row .col-sm-7 #inputQuestionWrapper #wmd-input');
    }else{
      htmlElement = $('.row .col-sm-7 #inputAnswerWrapper #Answer');
    }
    var toInsert = mathButtons[buttonPressed];
    var current = htmlElement.val();
    var plusSymbol = current + toInsert;
    htmlElement.val(plusSymbol);
    if(num==1){
      QUEUE.Push(
          ["resetEquationNumbers",MathJax.InputJax.TeX],
          ["Text",mathQuestion,"\\displaystyle{"+ plusSymbol +"}"],
      );
    }else{
      QUEUE.Push(
          ["resetEquationNumbers",MathJax.InputJax.TeX],
          ["Text",mathAnswer,"\\displaystyle{"+ plusSymbol +"}"],
      );
    }
    // preview.html(currentPreview + toInsert);
  }

  function promptSuccess(message){
    var promptMessage = $('#promptMessage')
    $('#editform').modal('show');
    $('#editform').addClass('successBox');
    if(message){
      promptMessage.html(message)
    }
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

  function addingMathJaxSyntax(content){
    let startMath = content.indexOf("\\")
    if(startMath>-1){
      return content.slice(0,startMath) + "${" + content.slice(startMath) + "}$";
    }
    return content;
  }

  function postQuestionAjax(useUrl,useMethod) {

    var newQuestion = {};
    newQuestion.title = $('#Title').val();
    newQuestion.topic = $('#Topic').val();
    newQuestion.content = $('#inputQuestionWrapper #wmd-input').val();

    if(newQuestion.content!=='' && newQuestion.title!=='' && newQuestion.topic!==''){
      newQuestion.content = addingMathJaxSyntax(newQuestion.content)
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

  function postAnswerAjax(useUrl, method){
    var newAnswer = {};
    newAnswer.content = $('#Answer').val();
    var questionID = $('#getQuestionId').data();

    if(newAnswer.content!==''){
      newAnswer.content = addingMathJaxSyntax(newAnswer.content)
      $.ajax({
        method: method,
        url: useUrl+questionID.id,
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

  // function postUserAnswerAjax(){
  //   var newAnswer = {};
  //   newAnswer.content = $('#Answer').val();
  //   var questionID = $('#questionPreview #getQuestionId').data();
  //
  //   if(newAnswer.content!==''){
  //     newAnswer.content = addingMathJaxSyntax(newAnswer.content)
  //     $.ajax({
  //       method: 'POST',
  //       url: '/questionDetails/updateByUser/'+questionID.id,
  //       data: newAnswer
  //     }).done(function(data){
  //         $('#Answer').val('');
  //         if(data[0]==='Please Login'){
  //           promptLogin();
  //         }else{
  //           promptSuccess();
  //         }
  //       });
  //   }
  // }

  function deleteQuestionAjax(){
    var questionID = $('#questionPreview #getQuestionId').data();
      $.ajax({
        method: 'delete',
        url: '/questionDetails/updateByUser/'+questionID.id,
      }).done(function(data){
          if(data[0]==='Please Login'){
            promptLogin();
          }else{
            promptSuccess("Delete Successful");
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
            promptSuccess("Delete Successful");
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

  // $(document).on('change','textarea',function(event){
  //   console.log("change function")
  //   console.log(event.target.val)
  //   var preview = $('.row .col-sm-7 #inputQuestionWrapper #preview');
  // })

  $(document).on('keyup','textarea', function(event){
    if(event.target.id=="wmd-input"){
      QUEUE.Push(
          ["resetEquationNumbers",MathJax.InputJax.TeX],
          ["Text",mathQuestion,"\\displaystyle{"+event.target.value+"}"],
      );
    }else{
      QUEUE.Push(
          ["resetEquationNumbers",MathJax.InputJax.TeX],
          ["Text",mathAnswer,"\\displaystyle{"+event.target.value+"}"],
      );
    }
  })

  $(document).on('click','.loginBox .close',function(){
    $('#editform').modal('hide');
    $('#editform').removeClass('loginBox');
  })
  $(document).on('click','.successBox .close',function(){
    $('#editform').modal('hide');
    $('#editform').removeClass('successBox');
  })

  $('body').on('click', '#submitAll', function(){
    postQuestionAjax('/Compose', 'POST');
  })
  $('body').on('click', '#updateQuestion', function(){
    var questionId = $('#getQuestionId').data()
    console.log(questionId)
    postQuestionAjax('/questionDetails/updateByUser/'+questionId.id, 'PUT')
  })

  $('body').on('click', '#submitAnswer', function(){
    //var questionId = $('#getQuestionId').data()
    postAnswerAjax('/questionDetails/','PUT');
  })
  $('body').on('click', '#postAnswer', function(){
    // var questionId = $('#getQuestionId').data()
    postAnswerAjax('/questionDetails/updateByUser/','POST');
  })
  $('body').on('click', '#updateAnswer', function(){
    // var questionId = $('#getQuestionId').data()
    postAnswerAjax('/questionDetails/answerUpdateByUser/', 'PUT');
  })
  $('body').on('click', '#deleteQuestion', function(){
    deleteQuestionAjax();
  })
  $('body').on('click', '#deleteAnswer', function(){
    deleteAnswerAjax();
  })

});


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

  // var userThatInvitedYouArray = [];
  // var mathButtons=[
  //   '\\theta',
  //   '$\\cos$',
  //   '$\\sin$',
  //   '$\\pi$',
  //   '$\\alpha$',
  //   '$\\beta$',
  //   '$\\mu$',
  //   '$\\mathbb{R}$',
  //   '$\\mathbb{Z}$',
  //   '$\\forall$',
  //   '$\\in$',
  //   '$x^{n}$',
  //   '$| x |$',
  //   '$\\binom{n}{r}$',
  //   '$\\frac{x}{y}$',
  //   '$\\sqrt{x}$',
  //   '$\\displaystyle\\sum_{r=1}^{n}$',
  //   '$\\int_0^1 f(x)\\,\\mathrm{d}x$',
  //   '$\\int f(x)\\,\\mathrm{d}x$',
  //   '$\\frac{\\mathrm dy}{\\mathrm d x}$',
  //   '$\\frac{\\mathrm d}{\\mathrm d x}\\left( f(x) \\right)$',
  // ]




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
