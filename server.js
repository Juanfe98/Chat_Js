const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const FormatMessage = require("./utils/messages");
const { usersJoin, getUser, leaveUser, getRoomUsers } = require("./utils/user");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const io = socketio(server);

//Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "CodeTime Bot";
//Run when a client connects
io.on("connection", (socket) => {
  console.log("New Connection");
  //!Ingreso a una Sala
  socket.on("joinRoom", (username, room) => {
    //Create a new user to the chat
    const user = usersJoin(socket.id, username, room);

    //Join de user to de specific room
    socket.join(user.room);

    //Welcome current User
    socket.emit(
      "message",
      FormatMessage(botName, `${user.username} Bienvenido a Este Chat`)
    );

    //BroadCast Message to all users except de one is connecting
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        FormatMessage(botName, `${user.username} Se Unio a la Sala`)
      );

    //!Mandamos los usuarios de esa sala al DOM
    io.to(user.room).emit("room_users", {
      room: user.room,
      users: getRoomUsers(user.room),
    });

    //When an User has disconnected
    //!we use to(user.room) to specify the socket only send the message to the users in that room
    socket.on("disconnect", () => {
      const user = leaveUser(socket.id);

      ///console.log(user);
      io.to(user.room).emit(
        "message",
        FormatMessage(botName, `${user.username} Abandonó la Sala`)
      );
    });
  });

  //Chat Message
  socket.on("chatMessage", (msg) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", FormatMessage(user.username, msg));
  });
});

server.listen(PORT, () => {
  console.log(`App Running on Port ${PORT}`);
});
