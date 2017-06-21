const homeController = require('../controllers/home');
const uuidV4 = require('uuid/v4');

module.exports = (io) => {

  var unique = true;
  var historyAllUser = [];
  var neccessaryUserInfoFrontEnd = [];

  io.on('connection', (socket) => {
    console.log('line 11', socket.request.user.profile.name);
    socket.request.user.sid = socket.id
    console.log('New user connected');
    var currentUserFrontEnd = {
      localid: socket.request.user._id,
      name:socket.request.user.profile.name,
      picture: socket.request.user.profile.picture,
      sid: socket.id
    }

    neccessaryUserInfoFrontEnd.push(currentUserFrontEnd);

    if(typeof(historyAllUser[socket.request.user._id])=="undefined"){
      historyAllUser[socket.request.user._id]=socket.request.user;
    }


   //}
  //  console.log(connectedUser)
  //  console.log(neccessaryUserInfoFrontEnd);

  //  connectedUser = connectedUser.filter( (elem,index,arr)=>{
  //    return elem._id!=socket.request.user._id;
  //  })
    socket.on('newMessage', (data) => {
      console.log('New message',data);
      io.emit('broadcast message', data);
    });

    socket.on('check connected user', ()=>{
      console.log('js connected');
      io.emit('boardcastUser', neccessaryUserInfoFrontEnd);
    });

    socket.on('invite user',(data)=>{
      console.log('sending invite to selected user')
      io.to(data).emit('private invite to compete',currentUserFrontEnd);
    })

      if(typeof(historyAllUser[socket.request.user._id].room)!=="undefined"){
        console.log('line 47: user is inside room ',socket.request.user.profile.name)
        socket.join(historyAllUser[socket.request.user._id].room);
        io.sockets.in(historyAllUser[socket.request.user._id].room).emit('user ready to compete');
      }


    socket.on('user accepted invite', (data)=>{
      var roomName='competitionRoom'+uuidV4();
      console.log(roomName)
      socket.join(roomName);
      historyAllUser[socket.request.user._id].room = roomName;

      console.log(data)
      console.log('socket recepted user invite');
    })



    socket.on('disconnect', function(){
      console.log('user disconnected');
      // connectedUser = connectedUser.filter(function(element,index){
      //   return element._id !== socket.request.user._id;
      // });
      neccessaryUserInfoFrontEnd = neccessaryUserInfoFrontEnd.filter(function(element,index){
        return element.localid !== socket.request.user._id;
      })
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
  // [ { localid: 594553e179ad1c72d771340a,
  //   name: 'Geok Yan Pek',
  //   picture: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50',
  //   sid: 'toMMwxsxZOG5BMHYAAAA' } ]

}
