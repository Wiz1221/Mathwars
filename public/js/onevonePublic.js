$(document).ready(function() {
    console.log('onevone js file is working')
    socket = io.connect('/', {secure: true, transports: ['websocket']});
    socket.once('user ready to compete', function(){
      console.log('socket have wroked')
      $.ajax({
        method: 'POST',
        url: '/startCompetition',
        data: 'one'
      }).done(function(data){
          console.log('ajax is working')
          console.log(data)
        });
        $('.default').remove();
        var warDom = $('#WarDOM').html();
        warDom = warDom.replace('{{questionID}}','test');
        warDom = warDom.replace('{{question}}','let this be a question');
        $('#domToAppear').append(warDom);
    })
})
