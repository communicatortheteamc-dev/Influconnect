"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CampaignPage() {

  const router = useRouter()

  const [campaigns,setCampaigns] = useState<any>(null)
  const [showModal,setShowModal] = useState(false)

  const [name,setName] = useState("")
  const [client,setClient] = useState("")

  const user = { email: "tharun@crm.com" }

  const loadCampaigns = async () => {
    const res = await fetch("/api/crm/campaign/list")
    const data = await res.json()
    setCampaigns(data)
  }

  useEffect(()=>{
    loadCampaigns()
  },[])

  const createCampaign = async () => {

    await fetch("/api/crm/campaign/create",{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        name,
        client_name:client,
        staff:user.email
      })
    })

    setShowModal(false)
    setName("")
    setClient("")
    loadCampaigns()
  }

  const openCampaign = (id:any) => {
    router.push(`/crm/campaign/${id}`)
  }

  return (

    <div className="p-8">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-2xl font-bold">
          Campaign Manager
        </h1>

        <button
          onClick={()=>setShowModal(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create Campaign
        </button>

      </div>


      {/* CAMPAIGN STATS */}

      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-white shadow rounded-xl p-6">
          <p className="text-gray-500 text-sm">Running Campaigns</p>
          <p className="text-2xl font-bold">
            {campaigns?.running?.length || 0}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <p className="text-gray-500 text-sm">Completed</p>
          <p className="text-2xl font-bold">
            {campaigns?.completed?.length || 0}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <p className="text-gray-500 text-sm">Total Campaigns</p>
          <p className="text-2xl font-bold">
            {(campaigns?.running?.length || 0) + (campaigns?.completed?.length || 0)}
          </p>
        </div>

      </div>


      {/* RUNNING CAMPAIGNS */}

      <h2 className="text-xl font-semibold mb-4">
        Running Campaigns
      </h2>

      <div className="grid grid-cols-3 gap-5 mb-10">

        {campaigns?.running?.map((c:any)=>(

          <div
            key={c._id}
            onClick={()=>openCampaign(c._id)}
            className="bg-white shadow rounded-xl p-5 cursor-pointer hover:shadow-lg transition"
          >

            <h3 className="font-semibold text-lg">{c.name}</h3>

            <p className="text-gray-500 text-sm mt-1">
              Client: {c.client_name}
            </p>

            <p className="text-xs mt-2 text-green-600">
              Running
            </p>

          </div>

        ))}

      </div>


      {/* COMPLETED CAMPAIGNS */}

      <h2 className="text-xl font-semibold mb-4">
        Completed Campaigns
      </h2>

      <div className="grid grid-cols-3 gap-5">

        {campaigns?.completed?.map((c:any)=>(

          <div
            key={c._id}
            onClick={()=>openCampaign(c._id)}
            className="bg-white shadow rounded-xl p-5 cursor-pointer hover:shadow-lg transition"
          >

            <h3 className="font-semibold text-lg">{c.name}</h3>

            <p className="text-gray-500 text-sm mt-1">
              Client: {c.client_name}
            </p>

            <p className="text-xs mt-2 text-gray-400">
              Completed
            </p>

          </div>

        ))}

      </div>


      {/* CREATE CAMPAIGN MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-8 w-[400px]">

            <h2 className="text-xl font-semibold mb-6">
              Create Campaign
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Campaign Name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                className="w-full border p-3 rounded"
              />

              <input
                type="text"
                placeholder="Client Name"
                value={client}
                onChange={(e)=>setClient(e.target.value)}
                className="w-full border p-3 rounded"
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={()=>setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={createCampaign}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Create
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  )
}