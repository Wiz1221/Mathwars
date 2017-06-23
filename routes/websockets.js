const homeController = require('../controllers/home');
const uuidV4 = require('uuid/v4');

var unique = true;
var historyAllUser = [];
var neccessaryUserInfoFrontEnd = [];
var connectedUser = [];

module.exports = (io) => {

  io.on('connection', (socket) => {

    socket.request.user.sid = socket.id
    var currentUserFrontEnd = {
      localid: socket.request.user._id,
      name:socket.request.user.profile.name,
      picture: socket.request.user.profile.picture,
      sid: socket.id
    }

    neccessaryUserInfoFrontEnd.push(currentUserFrontEnd);

    if(typeof(historyAllUser[socket.request.user._id])=="undefined"){
      historyAllUser[socket.request.user._id] = socket.request.user;
    }

    connectedUser[socket.request.user._id] = socket.request.user;
    connectedUser[socket.request.user._id].socketID = socket.id;

    connectedUser[socket.request.user._id].save((err) => {
      if (err) return err
    })

    socket.on('check connected user', ()=>{
      console.log('js connected');
      io.emit('boardcastUser', neccessaryUserInfoFrontEnd);
    });

    socket.on('invite user',(data)=>{
      console.log('sending invite to selected user')
      var roomName='competitionRoom'+uuidV4();
      socket.join(roomName);
      // historyAllUser[socket.request.user._id].room = roomName;
      io.sockets.in(roomName).emit('user ready to compete');
      io.to(data).emit('private invite to compete',{
        user: currentUserFrontEnd,
        room: roomName
      });
    })

      // if(typeof(historyAllUser[socket.request.user._id].room)!=="undefined"){
      //   socket.join(historyAllUser[socket.request.user._id].room);
      //   io.sockets.in(historyAllUser[socket.request.user._id].room).emit('start first question',historyAllUser[socket.request.user._id].room);
      //   //io.sockets.in(historyAllUser[socket.request.user._id].room).emit('user ready to compete');
      // }


    socket.on('user accepted invite', (data)=>{
      console.log('user accepted invite');
      console.log(data);
      //historyAllUser[socket.request.user._id].room = historyAllUser[data.userthatinvitedyouid].room;
      socket.join(data.room);
      io.sockets.in(data.room).emit('start first question',data.room);
    })

    socket.on('question 1 correct', ()=>{
        console.log('line 75 question 1 correct');
        io.sockets.in(room).boardcast.emit('boardcast question 1 correct',socket.request.user.profile.name);
        socket.emit('start question 2');
    });

    socket.on('question 2 correct', ()=>{
        console.log('line 75 question 2 correct');
        io.sockets.in(room).boardcast.emit('lose');
        socket.emit('win');
    });

    socket.on('leave room', ()=>{
      delete historyAllUser[socket.request.user._id].room;
      socket.emit('redirect');
    })


    socket.on('disconnect', function(){
      console.log('user disconnected', socket.request.user.profile.name);
      connectedUser = connectedUser.filter(function(element,index){
        return element._id !== socket.request.user._id;
      });
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
