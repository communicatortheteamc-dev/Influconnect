"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function StaffDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const user = { email: "tharun@crm.com" } // replace with session user

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`/api/crm/staff/dashboard?staffId=${user.email}`)
        const json = await res.json()
        console.log("STAFF DASHBOARD DATA:", json)
        setData(json)
      } catch (error) {
        console.error("Failed to load dashboard", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleCardClick = (influencerId: string) => {
    if (!influencerId) return
    router.push(`/crm/influencers/${influencerId}`)
  }

  const handleSetReminder = (e: React.MouseEvent, influencerId: string) => {
    e.stopPropagation()
    if (!influencerId) return
    router.push(`/crm/reminders?influencerId=${influencerId}`)
  }

  const handleMarkComplete = async (e: React.MouseEvent, followupId: string) => {
    e.stopPropagation()

    try {
      const res = await fetch("/api/crm/followup/complete", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: followupId,
          staffId: user.email,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        alert(result?.message || "Failed to mark complete")
        return
      }

      setData((prev: any) => {
        if (!prev) return prev

        const completedItem = prev.active.find((item: any) => item._id === followupId)
        if (!completedItem) return prev

        return {
          ...prev,
          active: prev.active.filter((item: any) => item._id !== followupId),
          completed: [
            {
              ...completedItem,
              status: "completed",
              completedAt: new Date().toISOString(),
            },
            ...(prev.completed || []),
          ],
        }
      })
    } catch (error) {
      console.error(error)
      alert("Something went wrong while marking followup complete")
    }
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (!data) return <div className="p-8">No data found</div>

const renderInfluencerCard = (item: any, completed = false) => {
  const inf = item.influencer || null
  const influencerId =
    item.influencer_id?.toString?.() ||
    inf?._id?.toString?.() ||
    ""

  const totalFollowers =
    inf?.platforms?.reduce(
      (sum: number, p: any) => sum + (p.followers || 0),
      0
    ) || 0

  return (
    <div
      key={item._id}
      onClick={() => influencerId && handleCardClick(influencerId)}
      className={`bg-white border rounded-xl p-4 flex items-center justify-between gap-4 hover:shadow-md transition ${
        influencerId ? "cursor-pointer" : "cursor-default"
      } ${completed ? "bg-green-50" : ""}`}
    >
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4 flex-1">
        {/* Avatar */}
        <img
          src={inf?.influencerImage || "/avatar.png"}
          alt=""
          className="w-14 h-14 rounded-full object-cover border"
        />

        {/* Details */}
        <div className="flex-1">
          {/* Name */}
          <h3 className="font-semibold text-lg text-gray-900">
            {inf?.influencerName || "Unknown Influencer"}
          </h3>

          {/* Category badges */}
          <div className="flex flex-wrap gap-2 mt-1">
            {inf?.category?.map((cat: string, i: number) => (
              <span
                key={i}
                className="text-xs bg-gray-100 px-2 py-1 rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Meta info */}
          <div className="text-sm text-gray-500 mt-1">
            {inf?.location || "No location"} •{" "}
            {totalFollowers.toLocaleString()} followers
          </div>

          {/* Completion */}
          {typeof inf?.completionPercent === "number" && (
            <div className="mt-2">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {inf.completionPercent}% Complete
              </span>
            </div>
          )}

          {/* Missing fields */}
          {inf?.missingFields?.length > 0 && (
            <div className="text-xs text-red-500 mt-1">
              Missing: {inf.missingFields.join(", ")}
            </div>
          )}

          {/* Followup note */}
          {item.notes && (
            <div className="text-xs text-gray-600 mt-1">
              Note: {item.notes}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT ACTIONS */}
      {!completed && (
        <div className="flex flex-col gap-2 min-w-[140px]">
          <button
            onClick={(e) => handleSetReminder(e, influencerId)}
            disabled={!influencerId}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm disabled:bg-gray-300"
          >
            Reminder
          </button>
        
          <button
            onClick={(e) => handleRemoveFollowup(e, item._id)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
          >
            Remove
          </button>
        </div>
      )}

      {/* COMPLETED BADGE */}
      {completed && (
        <div className="text-green-700 text-sm font-semibold">
          ✓ Completed
        </div>
      )}
    </div>
  )
}
const handleRemoveFollowup = async (
  e: React.MouseEvent,
  followupId: string
) => {
  e.stopPropagation()

  const confirmDelete = confirm("Remove this followup?")
  if (!confirmDelete) return

  try {
    const res = await fetch("/api/crm/my-followups/remove", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: followupId,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data?.error || "Failed to remove followup")
      return
    }

    // update UI
    setData((prev: any) => {
      if (!prev) return prev

      return {
        ...prev,
        active: prev.active.filter((item: any) => item._id !== followupId),
        completed: prev.completed.filter((item: any) => item._id !== followupId),
      }
    })
  } catch (error) {
    console.error(error)
    alert("Something went wrong")
  }
}
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Staff CRM Dashboard</h1>

      {/* ACTIVE FOLLOWUPS */}
      <div>
        <h2 className="text-xl font-semibold mb-4">My Active Followups</h2>

        {data.active?.length ? (
          data.active.map((item: any) => renderInfluencerCard(item, false))
        ) : (
          <div className="border rounded-xl p-4 text-gray-500 bg-gray-50">
            No active followups
          </div>
        )}
      </div>

      {/* COMPLETED */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Completed Followups</h2>

        {data.completed?.length ? (
          data.completed.map((item: any) => renderInfluencerCard(item, true))
        ) : (
          <div className="border rounded-xl p-4 text-gray-500 bg-gray-50">
            No completed followups
          </div>
        )}
      </div>

      {/* REMINDERS */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Reminders</h2>

        {data.reminders?.length ? (
          data.reminders.map((item: any) => (
            <div
              key={item._id}
              className="border p-4 rounded-xl mb-3 bg-yellow-50"
            >
              <p className="font-medium text-gray-900">{item.message}</p>

              {item.reminderDate && (
                <p className="text-sm text-gray-600 mt-1">
                  Reminder Date: {new Date(item.reminderDate).toLocaleString()}
                </p>
              )}

              {item.influencer_id && (
                <button
                  onClick={() =>
                    router.push(`/crm/influencers/${item.influencer_id}`)
                  }
                  className="mt-3 text-sm bg-black text-white px-3 py-2 rounded-lg"
                >
                  Open Influencer
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="border rounded-xl p-4 text-gray-500 bg-gray-50">
            No reminders
          </div>
        )}
      </div>

      {data?.debug && (
        <div className="border rounded-xl p-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-3">Debug</h2>
          <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(data.debug, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}