const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'jaime@goldmediatech.com',
    subject: 'Thanks for joining in!',
    text: `Welcome to the app ${name}. Let me know how you get along eith the app.`
  }) 
}

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'jaime@goldmediatech.com',
    subject: 'Thanks for joining in!',
    text: `Goodbye ${name}. I hope to see you back sometime soon.`
  }) 
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}