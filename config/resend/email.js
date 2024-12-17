const {emails} = require("./config");
const emailVerificationTemplate = require("./emailVerificationTemplate");
const welcomEmailTemplate = require("./welcomEmailTemplate");

const sendVerificationEmail = async (email, verificationEmail) => {
    try {
        const { data, error } = await emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: ["oujdimraymane@gmail.com"],
            // to: [email],
            subject: "Verify Your Email Address Now",
            html: emailVerificationTemplate.replace("{verificationToken}",verificationEmail),
        });
        if (error) throw error
    }catch (e) {
        console.log("Error In Verification email: ",e)
        throw new Error("Error In Verification email")
    }
}

const sendWelcomeEmail = async (email, name) => {
    try {
        const { data, error } = await emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: ["oujdimraymane@gmail.com"],
            // to: [email],
            subject: "Welcom to Brikool",
            html: welcomEmailTemplate.replace("{userName}",name),
        });
    }catch (e) {
        console.log("Welcom Email",e)
    }
}

const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        const { data, error } = await emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: ["oujdimraymane@gmail.com"],
            // to: [email],
            subject: "Reset Your Password",
            html: `Click <a href="${resetURL}">here</a> to reset your password`,
        });
    } catch (error) {
        console.log("error sending password reset email", error);
    }
};

const sendResetSuccessEmail = async (email) => {
    try {
        const { data, error } = await emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: ["oujdimraymane@gmail.com"],
            // to: [email],
            subject: "Password Reset Was Successful",
            html: `Your password was reset successfully`,
        });
    } catch (error) {
        console.log("error sending password reset successful email", error);
    }
}

module.exports = {sendVerificationEmail,sendWelcomeEmail,sendPasswordResetEmail,sendResetSuccessEmail}