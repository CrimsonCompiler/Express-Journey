const usersList = [
  {
    userId: require("crypto").randomBytes(5).toString("hex"),
    name: "Tousif Tasrik",
    email: "tousif2567@gmail.com",
    password: require("crypto").randomBytes(24).toString("hex"),
    role: "user",
  },
  {
    userId: require("crypto").randomBytes(5).toString("hex"),
    name: "Anika Binta Azad",
    email: "anika123@gmail.com",
    password: require("crypto").randomBytes(24).toString("hex"),
    role: "admin",
  },
];

module.exports = usersList;
