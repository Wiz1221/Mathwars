module.exports = (io) => {

  var unique = true;
  var connectedUser = [];

  io.on('connection', (socket) => {

   console.log('New user connected');
   connectedUser.forEach((elem,index,arr)=>{
     if(elem._id==socket.request.user){
        unique=false;
        return;
     }
   })

  //  for(var i=0; i<connectedUser.length;i++){
  //    if(connectedUser[i]._id==socket.request.user){
  //      return unique=false;
  //    }
  //  }
  if(unique==true){
     connectedUser.push(socket.request.user);
   }


  //  connectedUser = connectedUser.filter( (elem,index,arr)=>{
  //    return elem._id!=socket.request.user._id;
  //  })
    socket.on('newMessage', (data) => {
      console.log('New message',data);
      io.emit('broadcast message', data);
    });

    socket.on('check connected user', ()=>{
      console.log('js connected');
      io.emit('boardcastUser', connectedUser);
    });

    // socket.on('user selected',(data)=>{
    //   console.log(data);
    // })

    //
    // socket.on('newUser', (data) => {
    //   console.log('New User',data);
    //   io.emit('broadcast location', data);
    // });

    socket.on('disconnect', function(){
      console.log('user disconnected');
      connectedUser = connectedUser.filter(function(element,index){
        return element._id == socket.request.user._id;
      });
    })



  });

  // [ '594553e179ad1c72d771340a': { _id: 594553e179ad1c72d771340a,
  //     updatedAt: 2017-06-17T16:08:01.535Z,
  //     createdAt: 2017-06-17T16:08:01.535Z,
  //     google: '104614446570336285861',
  //     email: 'geokyan89@gmail.com',
  //     __v: 0,
  //     profile:
  //      { picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50',
  //        gender: 'female',
  //        name: 'Geok Yan Pek' },
  //     tokens: [ [Object] ] } ]

}
