"use client"

import { useEffect, useState } from "react"

export default function StaffDashboard() {

  const [data,setData] = useState<any>(null)

  const user = { email: "tharun@crm.com" } // replace with session user

  useEffect(()=>{

    const loadData = async()=>{

      const res = await fetch(`/api/crm/staff/dashboard?staffId=${user.email}`)
      const json = await res.json()

      setData(json)
    }

    loadData()

  },[])

  if(!data) return <div>Loading...</div>

  return (

    <div className="p-8 space-y-8">

      <h1 className="text-2xl font-bold">Staff CRM Dashboard</h1>

      {/* ACTIVE FOLLOWUPS */}

      <div>
        <h2 className="text-xl font-semibold mb-4">
          My Active Followups
        </h2>

        {data.active.map((item:any)=>(
          <div
            key={item._id}
            className="border p-4 rounded mb-3"
          >

            Influencer ID: {item.influencer_id}

            <div className="mt-2">
              <button className="bg-green-600 text-white px-3 py-1 rounded">
                Mark Complete
              </button>
            </div>

          </div>
        ))}

      </div>


      {/* COMPLETED */}

      <div>

        <h2 className="text-xl font-semibold mb-4">
          Completed Followups
        </h2>

        {data.completed.map((item:any)=>(
          <div
            key={item._id}
            className="border p-4 rounded mb-3 bg-green-50"
          >
            Influencer ID: {item.influencer_id}
          </div>
        ))}

      </div>


      {/* REMINDERS */}

      <div>

        <h2 className="text-xl font-semibold mb-4">
          Reminders
        </h2>

        {data.reminders?.map((item:any)=>(
          <div
            key={item._id}
            className="border p-4 rounded mb-3 bg-yellow-50"
          >
            {item.message}
          </div>
        ))}

      </div>

    </div>
  )
}