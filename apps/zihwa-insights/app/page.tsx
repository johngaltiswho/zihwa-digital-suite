import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Home() {
  const { userId } = await auth()
  
  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Zihwa Insights
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Streamline your compliance management with our comprehensive platform for deadlines, documents, and employee tracking.
        </p>
        <div className="space-x-4">
          <Link 
            href="/sign-in"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/sign-up"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}
