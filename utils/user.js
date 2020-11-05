const users = [];

function usersJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

function getUser(id) {
  return users.find((user) => {
    return user.id == id;
  });
}

function leaveUser(id) {
  const index = users.findIndex((user) => {
    return user.id === id;
  });

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}
module.exports = {
  usersJoin,
  getUser,
  leaveUser,
  getRoomUsers,
};
