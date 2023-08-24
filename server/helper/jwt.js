const jwt = require('jsonwebtoken');

exports.generateJWT=(data)=>{
  const token = jwt.sign(
    {data},
    process.env.SECRET_KEY,
    {
        expiresIn:'2d'
    }
  )
  return token;
}