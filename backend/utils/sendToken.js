
const sendToken=(user,statusCode,res)=>{
    const jwtToken=user.generateJWTToken();

    const options={
        expire:new Date(
            Date.now()+(process.env.COOKIE_EXPIREIN *24*60*60*1000)
        )
    }

    return res.status(statusCode).cookie("token",jwtToken,options).json({
        success:true,
        user:user,
        token:jwtToken
    })

}

export default sendToken;