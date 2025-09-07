"use client"

import { useActionState } from "react"
import Input from "@/modules/common/components/input"
import { LOGIN_VIEW } from "@/modules/account/templates/login-template"
import ErrorMessage from "@/modules/checkout/components/error-message"
import { SubmitButton } from "@/modules/checkout/components/submit-button"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { signup } from "@/lib/medusa-lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div
      className="w-full flex flex-col items-center"
      data-testid="register-page"
    >
      <h2 className="text-2xl font-semibold text-white uppercase mb-4">
        Become a Fluvium Member
      </h2>
      <p className="text-center text-gray-400 mb-6">
        Create your Fluvium Member profile, and get access to an enhanced
        shopping experience.
      </p>
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-4">
          <Input
            label="First name"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label="Last name"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label="Password"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="register-error" />
        <span className="text-center text-gray-400 text-sm mt-6">
          By creating an account, you agree to Fluvium&apos;s{" "}
          <LocalizedClientLink
            href="/privacy-policy"
            className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
          >
            Privacy Policy
          </LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink
            href="/terms-of-service"
            className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
          >
            Terms of Service
          </LocalizedClientLink>
          .
        </span>
        <SubmitButton className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold border-0 shadow-lg shadow-cyan-500/25" data-testid="register-button">
          Join
        </SubmitButton>
      </form>
      <span className="text-center text-gray-400 text-sm mt-6">
        Already a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
        >
          Sign in
        </button>
        .
      </span>
    </div>
  )
}

export default Register
