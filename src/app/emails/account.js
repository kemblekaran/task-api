const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEamil = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.APPLICATION_EMAIL_ADDRESS,
        subject: 'Thanks for joining!',
        text: `Welcome to the Task Manager App ${name}. Let me know how you get along with the app.`
    })
    console.log('welcome email sent to', email)
}

const sendCancellationEamil = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.APPLICATION_EMAIL_ADDRESS,
        subject: `Hold on ${name}.`,
        text: `I would love to hear the reason of leaving the app.Let me know what you don't like about the app.`
    })
    console.log('cancellation email sent to', name)
}

module.exports = {
    sendWelcomeEamil, sendCancellationEamil
}
