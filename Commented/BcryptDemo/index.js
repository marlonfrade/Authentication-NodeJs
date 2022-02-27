const bcrypt = require("bcrypt");

// In authentication, to improve the security of the password of user, we need two steps,
// First we need to hash the password, the we need to generate a password salt to get the password more difficulty to discover
// const hashPsw = async (pw) => {
//   // The number we pass as param to the genSalt function is called saltRounds as the docs, and the recommended to use is 12
//   const salt = await bcrypt.genSalt(12);
//   //   ***REMEMBER*** The bigger the saltRound, more timer to be hashed when execute this function
//   //   First we generate a salt, the we need to hash this number
//   const hash = await bcrypt.hash(pw, salt);
//   console.log(salt);
//   console.log(hash);
// };

// Another method to hash and to salt a password
const hashPsw = async (pw) => {
  const hash = await bcrypt.hash(pw, 12);
  console.log(hash);
};

// How to Verify a password stored on a database as same as the logic to login the user.
const login = async (pw, hashedPw) => {
  // The execution below will return with true or false
  const result = await bcrypt.compare(pw, hashedPw);
  if (result) {
    console.log("LOGIN SUCCESS");
  } else {
    console.log("INCORRECT");
  }
};

// hashPsw("monkey");
// This function return to us this hash psw, we will compare it using the function login
// $2b$12$/tCV0DYSA.Yfr0pLMnh1Iugnooff520KXiw6YEAmIxiouOoObCDvC
// login("monkey", "$2b$12$/tCV0DYSA.Yfr0pLMnh1Iugnooff520KXiw6YEAmIxiouOoObCDvC");

// The other login try using the another method to hash the password
login("monkey", "$2b$12$rjbCOuQtEAfwWHsI.PFbweOhvg4aGmMnyVcgHNEImXwaFcxtYOW2a");

// So in this case we fake a login compare to logged a user using the password monkey
// You can test it by changing some words of the login function param, or by changing the password variable itself
