"use client"

import { useState } from "react"

import Register from "@/modules/account/components/register"
import Login from "@/modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-white mb-4">
            Welcome to <span className="neon-glow">Fluvium</span>
          </h1>
          <p className="text-gray-400">Access your account to manage orders and profile</p>
        </div>
        <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 p-8">
          {currentView === "sign-in" ? (
            <Login setCurrentView={setCurrentView} />
          ) : (
            <Register setCurrentView={setCurrentView} />
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginTemplate
