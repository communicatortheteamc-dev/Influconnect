"use client"

import { useEffect, useState } from "react"

export default function Sidebar(){

  const [user,setUser] = useState<any>(null)

  useEffect(() => {
  fetch("/api/crm/me", {
    credentials: "include"
  })
    .then(res => res.json())
    .then(data => setUser(data.user))
}, [])

  return(

    <div className="h-screen w-64 bg-[#0f172a] text-white flex flex-col justify-between">

      {/* TOP */}

      <div>

        <div className="p-6 text-xl font-bold border-b border-slate-700">
          InfluConnect CRM
        </div>

        <nav className="p-4 space-y-2">

          <a href="/crm" className="block p-3 rounded hover:bg-slate-800">
            Dashboard
          </a>

          <a href="/crm/influencers" className="block p-3 rounded hover:bg-slate-800">
            Influencers
          </a>
           <a href="/crm/complete" className="block p-3 rounded hover:bg-slate-800">
            Complete Profiles
          </a>

          <a href="/crm/reminders" className="block p-3 rounded hover:bg-slate-800">
            Reminders
          </a>

          <a href="/crm/staff" className="block p-3 rounded hover:bg-slate-800">
            Staff
          </a>
          <a href="/crm/campaign" className="block p-3 rounded hover:bg-slate-800">
            Campaign
          </a>

        </nav>

      </div>


      {/* BOTTOM USER PROFILE */}

      <div className="border-t border-slate-700 p-4">

        {user ? (

          <div>

            <p className="font-semibold">
              {user.name}
            </p>

            <p className="text-sm text-gray-400">
              {user.email}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Role: {user.role}
            </p>

          </div>

        ) : (

          <p className="text-gray-400">
            Not logged in
          </p>

        )}
 <div className="p-4 border-t border-gray-800">
                <button
                    onClick={async () => {
                        await fetch("/api/crm/auth/logout", { method: "POST" })
                        window.location.href = "/crm/login"
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 p-2 rounded"
                >
                    Logout
                </button>
            </div>
      </div>

    </div>

  )

}