const jwt = require("jsonwebtoken");
const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.c, {
    expiresIn: "30min", 
  });
};


function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]; 
  const token = authHeader && authHeader.split(" ")[1]; 

  if (token == null) return res.sendStatus(401); 
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    
    if (err) return res.sendStatus(403); // Si le jeton n'est pas valide
    req.user = user; // L'utilisateur est désormais disponible dans req.user
    next(); 
  });
}
module.exports = {
  generateAccessToken,
  authenticateToken,
};
