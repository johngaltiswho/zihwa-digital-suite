import { login, requestPasswordReset } from "@/lib/medusa-lib/data/customer"
import { LOGIN_VIEW } from "@/modules/account/templates/login-template"
import ErrorMessage from "@/modules/checkout/components/error-message"
import { SubmitButton } from "@/modules/checkout/components/submit-button"
import Input from "@/modules/common/components/input"
import { useActionState, useState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  return (
    <div
      className="w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h2 className="text-2xl font-semibold text-white uppercase mb-4">Welcome back</h2>
      <p className="text-center text-gray-400 mb-6">
        Sign in to access an enhanced shopping experience.
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold border-0 shadow-lg shadow-cyan-500/25">
          Sign in
        </SubmitButton>
      </form>
      
      {/* Forgot Password Link */}
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => setShowForgotPassword(!showForgotPassword)}
          className="text-cyan-400 hover:text-cyan-300 text-sm underline transition-colors"
        >
          Forgot your password?
        </button>
      </div>

      {showForgotPassword && (
        <ForgotPasswordForm onClose={() => setShowForgotPassword(false)} />
      )}

      <span className="text-center text-gray-400 text-sm mt-6">
        Not a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
          data-testid="register-button"
        >
          Join us
        </button>
        .
      </span>
    </div>
  )
}

// Forgot Password Form Component
const ForgotPasswordForm = ({ onClose }: { onClose: () => void }) => {
  const [message, formAction] = useActionState(requestPasswordReset, null)

  return (
    <div className="mt-6 p-6 bg-gray-800/50 rounded-lg border border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">Reset Password</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-300"
        >
          ✕
        </button>
      </div>
      <p className="text-gray-400 text-sm mb-4">
        Enter your email address and we'll send you instructions to reset your password.
      </p>
      <form action={formAction}>
        <Input
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
        {message && (
          <div className="mt-3 p-3 bg-gray-700/50 rounded text-sm text-gray-300">
            {message}
          </div>
        )}
        <SubmitButton className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold border-0">
          Send Reset Instructions
        </SubmitButton>
      </form>
    </div>
  )
}

export default Login
