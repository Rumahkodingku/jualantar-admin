import { trackEvent } from "~/lib/analytics"

export const authEvents = {
    loginSubmitted() {
        trackEvent("login_submitted")
    },
    loginSuccess() {
        trackEvent("login_success")
    },
    loginFailed() {
        trackEvent("login_failed")
    },
    forgotPasswordClicked() {
        trackEvent("forgot_password_clicked")
    },
    forgotPasswordSubmitted() {
        trackEvent("forgot_password_submitted")
    },
    forgotPasswordSuccess() {
        trackEvent("forgot_password_success")
    },
    resetPasswordSuccess() {
        trackEvent("reset_password_success")
    },
}
