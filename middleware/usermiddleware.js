import JWT from 'jsonwebtoken'

export const authorizeUser = async(req, res, next)=>{
    try {
        const token = req.headers["authorization"].split(" ")[1];
        JWT.verify(token, process.env.JWT_SECRET,(err, decode)=>{
          if (err) {
            return  res.status(401).send({
                success:false,
                message:"unauthrized user",
                err
            })
          } else {
            req.body.id = decode.id
            next()
          }
        })
        
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"error in user Api",
            error
        })
    }
}