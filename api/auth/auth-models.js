const db = require("../../data/dbConfig");

module.exports = {
  getUserByUsername,
  addUser,
  getUserById,
};

function getUserById(id) {
  return db("users").where({ id }).first();
}

function getUserByUsername(username) {
  return (
    db("users")
      .where({ username })
      // .select("username")
      .first()
  );
}

function addUser(body) {
  return db("users")
    .insert(body)
    .then((id) => {
      return getUserById(id);
    });
}
