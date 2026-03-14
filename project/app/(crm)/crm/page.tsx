"use client"

import { useEffect, useState } from "react"

export default function DashboardPage() {

  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/crm/dashboard")
      .then(res => res.json())
      .then((d) => {
        setData(d)
        setLoading(false)
      })
  }, [])
  const [completeData, setCompleteData] = useState<any>(null)
  const loadInfluencers = async () => {


    const res = await fetch(`/api/crm/influencers/complete/get`)
    const json = await res.json()

    setCompleteData(json)

  }

  useEffect(() => {
    loadInfluencers()
  }, [])
  if (loading) {
    return (
      <div className="text-center text-lg">
        Loading CRM Dashboard...
      </div>
    )
  }

  return (
    <div className="space-y-10">

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold">
          InfluConnect CRM Dashboard
        </h1>
        <p className="text-gray-500">
          Overview of influencer database & CRM activity
        </p>
      </div>


      {/* MAIN STATS */}

      <div className="grid grid-cols-4 gap-6">

        <StatCard
          title="Raw Influencers"
          value={data.stats?.totalInfluencers}
        />
        <StatCard
          title="Complete Influencers"
          value={completeData?.influencers?.length || 0}
        />

        <StatCard
          title="CRM Influencers"
          value={data.stats?.crmInfluencerCount}
        />

        <StatCard
          title="Pending Reminders"
          value={data.stats?.pendingReminders}
        />

        <StatCard
          title="Total Staff"
          value={data.stats?.totalStaff}
        />

      </div>


      {/* CONTACT DATA HEALTH */}
      {/* PROFILE COMPLETION */}

     
      <div className="grid grid-cols-4 gap-6">

        <StatCard
          title="No Phone Numbers"
          value={data.stats?.noPhone}
        />

        <StatCard
          title="No Emails"
          value={data.stats?.noEmail}
        />
   <StatCard
          title="Instagram Influencers"
          value={data.platforms?.instagram}
        />

        <StatCard
          title="YouTube Influencers"
          value={data.platforms?.youtube}
        />
      </div>


      {/* PLATFORM STATS */}

  
 <div className="bg-white shadow rounded-xl p-6">

        <h2 className="text-xl font-bold mb-4">
          Profile Completion
        </h2>

        <div className="space-y-4">

          {/* Average Completion */}

          <div>

            <div className="flex justify-between text-sm mb-1">
              <span>Average Completion</span>
              <span className="font-semibold">
                {Math.round(data.stats?.avgProfileCompletion || 0)}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">

              <div
                className="bg-green-500 h-3 rounded-full"
                style={{
                  width: `${Math.round(
                    data.stats?.avgProfileCompletion || 0
                  )}%`
                }}
              />

            </div>

          </div>


          {/* Completed Profiles */}

          <div className="flex justify-between border-b pb-2">

            <span>Completed Profiles</span>

            <span className="font-semibold text-green-600">
              {completeData.influencers?.length || 0}
            </span>

          </div>


          {/* Incomplete Profiles */}

          <div className="flex justify-between">

            <span>Incomplete Profiles</span>

            <span className="font-semibold text-red-600">
              {data.stats?.incompleteProfiles || 0}
            </span>

          </div>

        </div>

      </div>

      {/* LOCATION ANALYTICS */}

      <div className="bg-white shadow rounded-xl p-6">

        <h2 className="text-xl font-bold mb-4">
          Top Influencer Locations
        </h2>

        <div className="space-y-2">

          {data.locationStats?.length > 0 ? (
            data.locationStats.map((loc: any) => (
              <div
                key={loc._id}
                className="flex justify-between border-b py-2"
              >
                <span>{loc._id || "Unknown"}</span>
                <span className="font-semibold">{loc.count}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No location data</p>
          )}

        </div>

      </div>


      {/* RECENT INFLUENCERS */}

      <div className="bg-white shadow rounded-xl p-6">

        <h2 className="text-xl font-bold mb-4">
          Recent Influencers
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2">Name</th>
                <th>Category</th>
                <th>Location</th>
              </tr>
            </thead>

            <tbody>

              {data.recentInfluencers?.map((inf: any) => (
                <tr key={inf._id} className="border-b hover:bg-gray-50">

                  <td className="py-3 font-medium">
                    {inf.influencerName || "Unknown"}
                  </td>

                  <td>
                    {Array.isArray(inf.category)
                      ? inf.category.join(", ")
                      : inf.category || "-"}
                  </td>

                  <td>
                    {inf.location || "-"}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}



/* ---------- STAT CARD ---------- */

function StatCard({
  title,
  value
}: {
  title: string
  value: number
}) {

  return (

    <div className="bg-white shadow rounded-xl p-6">

      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {value ?? 0}
      </h2>

    </div>

  )

}