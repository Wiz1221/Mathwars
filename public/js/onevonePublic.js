$(document).ready(function() {

    var questions;
    var winOrLose = [{
      class:'winBox',
      title: 'You have Won!',
      message: 'You have Won!, press leave button to exit Competition'
    },{
      class:'loseBox',
      title: 'You have lost!',
      message: 'You have lost!, press leave button to exit Competition'
    }]

    console.log('onevone js file is working')
    socket = io.connect('/', {secure: true, transports: ['websocket']});

    socket.on('user ready to compete', function(){
      console.log('socket have wroked')
      $('.default').html('');
      $('.default').html('waiting for the other user');

    })

    socket.on('start first question', function(room){
       var roomNumber = room;
      $.ajax({
        method: 'POST',
        url: '/startCompetition',
        data: 'one'
      }).done(function(data){
        console.log(data);
        questions = data;
        warDom = warDom.replace('{{questionID}}','question1');
        warDom = warDom.replace('{{question}}',questions[0].question.content);
      });
        $(document).on('click','#submitFinalAns',function(){
          if($('#Answer').val()==questions[0].answer[0].content){
            if($('.wrongAnsPrompt').length>0){
              $('.wrongAnsPrompt').remove();
            }
            socket.in(roomNumber).emit('question 1 correct');
          }else{
            $('form').prepend($('<p></p>').html('Wrong Answer').addClass('wrongAnsPrompt'))
          }
        })
    });

    socket.on('boardcast question 1 correct', function(){
      $('#broadcastMessage').html('Your opponent have answered question 1 correctly!');
    })

    socket.on('start question 2', function(){
      $('#domToAppear').empty();
      warDom = warDom.replace('{{questionID}}','question2');
      warDom = warDom.replace('{{question}}',questions[1].question.content);
      $('#domToAppear').append(warDom);
      $(document).on('click','#submitFinalAns',function(){
        if($('#Answer').val()==questions[1].answer.content){
          if($('.wrongAnsPrompt').length>0){
            $('.wrongAnsPrompt').remove();
          }
          socket.in(roomNumber).emit('question 2 correct');
        }else{
          $('form').prepend($('<p></p>').html('Wrong Answer').addClass('wrongAnsPrompt'))
        }
      })
    })

    function promptBox(num){
      $('#editform').modal('show');
      $('#editform').addClass(winOrLose[num].class);
      $('#promptMessageTitle').html(winOrLose[num].title);
      $('#promptMessage').html(winOrLose[num].message);
    }

    socket.on('win',function(){
      promptBox(0);
    })

    socket.on('lose',function(){
      promptBox(1);
    })

    $(document).on('click','#editform .close',function(){
      socket.emit('leave room');
    })

    socket.on('redirect', function(){
      window.location.href = '/1v1';
    })


})
