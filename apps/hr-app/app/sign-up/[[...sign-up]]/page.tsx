import { redirect } from 'next/navigation'

export default function SignUpPage() {
  redirect('/sign-in?view=sign_up')
}
