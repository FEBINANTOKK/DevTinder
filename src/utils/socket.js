// const Socket = require("socket.io");
// const crypto = require("crypto");

// const getScretRoomId = (UserId, targetUserId) => {
//   return crypto
//     .createHash("sha256")
//     .update([UserId, targetUserId].sort().join("_"))
//     .digest("hex");
// };
// const initializeSocket = (server) => {
//   const io = Socket(server, {
//     cors: {
//       origin: "http://localhost:5173",
//       // methods:["GET","POST"]
//     },
//   });

//   io.on("connection", (socket) => {
//     socket.on("joinChat", ({ firstName, UserId, targetUserId }) => {
//       const roomId = getScretRoomId(UserId, targetUserId);
//       console.log(firstName + " Joinning room : " + roomId);

//       socket.join(roomId);
//     });
//     socket.on(
//       "sendMessage",
//       ({ firstName, userId: UserId, targetUserId, text }) => {
//         const roomId = getScretRoomId(UserId, targetUserId);
//         console.log(firstName + "   " + text.text);

//         io.to(roomId).emit("receiveMessage", {
//           firstName,
//           text,
//         });
//       },
//     );
//     socket.on("disconnect", (data) => {});
//   });
// };

// module.exports = initializeSocket;

const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
  console.log([userId, targetUserId]);

  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + " joined Room : " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        // Save messages to the database
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(firstName + " " + text);

          // TODO: Check if userId & targetUserId are friends

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();
          io.to(roomId).emit("messageReceived", { firstName, lastName, text });
        } catch (err) {
          console.log(err);
        }
      },
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
