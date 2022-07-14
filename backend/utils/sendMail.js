import nodemailer from "nodemailer";

const sendMail = async ({from,fromPassword,to,subject,message}) =>{
    const mail=nodemailer.createTransport({
        name:"gmail.com",
        host:"smtp.gmail.com",
        port:567,
        secure:true,
        service:process.env.MAIL_SERVICE,
        auth:{
            user:from,
            pass:fromPassword
        }
    })

    const options = {
        from:from,
        to:to,
        subject:subject,
        text:message
    };

    await mail.sendMail(options);
};

export default sendMail;