const bcrypt = require('bcrypt');

const saltRounds = 10; // Number of salt rounds
const plainTextPassword = 'sijojosek';

bcrypt.hash(plainTextPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('Hashed password:', hash);
  }
});
