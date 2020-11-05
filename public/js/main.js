const socket = io();
const chatMessage = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const roomUsers = document.getElementById("users");

//Get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//Join the user to the room
socket.emit("joinRoom", username, room);

socket.on("room_users", ({ room, users }) => {
  outputRoom(room);
  outputRoomUsers(users);
});

socket.on("message", (message) => {
  outputMessage(message);

  //scroll down chat
  chatMessage.scrollTop = chatMessage.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get Message Text
  const msg = e.target.elements.msg.value;

  //Emit message to server
  socket.emit("chatMessage", msg);

  //Clear input buffer
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//Output Message to DOM
function outputMessage(msg) {
  //Create div element to put into the DOM
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${msg.username}  <span>${msg.time}</span></p>
   <p class="text">
     ${msg.message}
   </p>`;
  //Add the child to the .chat-messages div
  document.querySelector(".chat-messages").appendChild(div);
}

//Output Room to DOM
function outputRoom(room) {
  roomName.innerText = room;
}

//Output Users to DOM
function outputRoomUsers(users) {
  roomUsers.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}
