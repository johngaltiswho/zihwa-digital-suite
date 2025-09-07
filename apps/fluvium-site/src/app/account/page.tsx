import { Metadata } from "next"
import LoginTemplate from "@/modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Account - Fluvium",
  description: "Sign in to your Fluvium account to manage orders and profile.",
}

export default async function AccountPage() {
  return <LoginTemplate />
}