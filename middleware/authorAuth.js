const jwt = require('jsonwebtoken')

exports.author = (req, res, next)=>{
	let token = req.headers['authorization'];
	if(!token){
	    return res.status(401).send({
	      message:"Please login to continue"
	    })
	} else {
		// invalid token - synchronous
		let jwt_secret = process.env.JWT_SECRET;
		try {
		  let decoded = jwt.verify(token, jwt_secret);
		  if(decoded) {
		  	req.author = decoded.data;
		  } else {
		  	  return res.status(401).send({
	           message:"Please login to continue."
	          });
		  }
		} catch (err) {
	        // err
	        if(err.expiredAt && err.expiredAt < new Date()){
	          return res.status(401).send({
	            message:"Session expired."
	          })
	        } else {
	          return res.status(401).send({
	           	message:"Please login to continue."
	          })
	        }

		}
		next();
	}	
}