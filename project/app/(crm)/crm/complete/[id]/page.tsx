"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function InfluencerProfile() {
    const { id } = useParams()

    const categories = [
        "Fashion & Lifestyle", "Beauty & Makeup", "Fitness & Health", "Food & Cooking",
        "Travel", "Technology", "Gaming", "Education", "Finance & Investment",
        "Business & Entrepreneurship", "Entertainment", "Music", "Photography",
        "Parenting", "Motivation & Self Growth", "Comedy"
    ]

    const languages = [
        "English", "Hindi", "Telugu", "Tamil", "Kannada", "Malayalam",
        "Marathi", "Bengali", "Gujarati", "Punjabi", "Urdu"
    ]

    const defaultPlatforms = [
        { name: "instagram", profileName: "", followers: "", profileLink: "" },
        { name: "youtube", profileName: "", followers: "", profileLink: "" },
        { name: "facebook", profileName: "", followers: "", profileLink: "" },
        { name: "twitter", profileName: "", followers: "", profileLink: "" },
        { name: "snapchat", profileName: "", followers: "", profileLink: "" },
        { name: "threads", profileName: "", followers: "", profileLink: "" }
    ]

    const [form, setForm] = useState<any>(null)
    const [editing, setEditing] = useState(false)

    const mergePlatforms = (existing: any[]) => {
        return defaultPlatforms.map(p => {
            const found = existing?.find((e: any) => e.name.toLowerCase() === p.name.toLowerCase())
            return found ? { ...p, ...found } : p
        })
    }

    useEffect(() => {
        if (!id) return

        fetch(`/api/crm/influencers/complete/${id}`)
            .then((res) => res.json())
            .then((res) => {
                console.log("API Response:", res)

                const influencer =
                    res?.influencer ||
                    res?.influencers?.find((item: any) => item._id === id) ||
                    null

                if (!influencer) {
                    console.error("Influencer not found")
                    return
                }

                const updatedInfluencer = {
                    ...influencer,
                    platforms: mergePlatforms(influencer?.platforms || []),
                    category: influencer.category || [],
                    languages: influencer.languages || [],
                    phone: influencer.phone || "",
                    email: influencer.email || "",
                }

                setForm(updatedInfluencer)
            })
            .catch((err) => {
                console.error("Error fetching influencer:", err)
            })
    }, [id])


    const updateField = (field: string, value: any) => {
        setForm({ ...form, [field]: value })
    }

    const updatePlatform = (index: number, field: string, value: any) => {
        const updated = [...form.platforms]
        updated[index][field] = value
        setForm({ ...form, platforms: updated })
    }

    const handleArrayToggle = (field: string, value: string) => {
        const currentValues = form[field] || []
        const updated = currentValues.includes(value)
            ? currentValues.filter((v: string) => v !== value)
            : [...currentValues, value]
        updateField(field, updated)
    }

    const saveProfile = async () => {
        await fetch(`/api/crm/influencers/complete/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        })
        alert("Profile updated in existing collection")
        setEditing(false)
    }

    const markAsComplete = async () => {
        const confirmMove = confirm("Move this influencer to 'Full Profiles' collection?")
        if (!confirmMove) return

        const res = await fetch(`/api/crm/influencers/complete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, originalId: id })
        })

        if (res.ok) {
            alert("Success! Profile stored in full_profiles.")
        } else {
            alert("Failed to move profile.")
        }
    }
    const formatValue = (val: any) => {
    if (!val) return "None"

    // array values
    if (Array.isArray(val)) {

      // platforms array
      if (typeof val[0] === "object") {
        return val
          .map((p: any) => `${p.name} (${p.profileName || "no username"})`)
          .join(", ")
      }

      return val.join(", ")
    }

    // object values
    if (typeof val === "object") {
      return Object.values(val).join(", ")
    }

    return val
  }
  const [specificEditHistory, setSpecificEditHistory] = useState<any>(null)
  useEffect(() => {
    fetch(`/api/crm/influencers/${id}`)
      .then(res => res.json())
      .then(res => {
        const influencer = res.influencer
       
        setSpecificEditHistory(influencer.editHistory || []) // Store edit history separately
      })
  }, [id])
const [showHistoryModal, setShowHistoryModal] = useState(false)
    if (!form) return <div className="p-10 text-center">Loading...</div>

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">

            {/* HEADER SECTION */}
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{form.influencerName || "New Influencer"}</h1>
                    <span className={`text-xs px-2 py-1 rounded ${editing ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {editing ? "Editing Mode" : "View Mode"}
                    </span>
                </div>
                {/* <div className="flex gap-3">
          {!editing ? (
            <button onClick={() => setEditing(true)} className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium">
              Edit Details
            </button>
          ) : (
            <button onClick={saveProfile} className="bg-green-600 text-white px-5 py-2 rounded-lg font-medium">
              Save Changes
            </button>
          )}
        </div> */}
            </div>

            <div className="grid grid-cols-12 gap-6">

                {/* LEFT COLUMN: FORM DETAILS */}
                <div className="col-span-12 lg:col-span-8 space-y-6">

                    {/* MAIN INFO FORM */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">Influencer Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 md:col-span-1">
                                <label className="text-sm font-semibold text-gray-600">Full Name</label>
                                <input
                                    value={form.influencerName}
                                    disabled={!editing}
                                    onChange={(e) => updateField("influencerName", e.target.value)}
                                    className="w-full mt-1 border p-2 rounded-md disabled:bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="text-sm font-semibold text-gray-600">Location</label>
                                <input
                                    value={form.location || ""}
                                    disabled={!editing}
                                    onChange={(e) => updateField("location", e.target.value)}
                                    className="w-full mt-1 border p-2 rounded-md disabled:bg-gray-50"
                                />
                            </div>

                            {/* CONTACT FIELDS */}
                            <div className="col-span-2 md:col-span-1">
                                <label className="text-sm font-semibold text-gray-600">Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="+91 00000 00000"
                                    value={form.phone || ""}
                                    disabled={!editing}
                                    onChange={(e) => updateField("phone", e.target.value)}
                                    className="w-full mt-1 border p-2 rounded-md disabled:bg-gray-50"
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="text-sm font-semibold text-gray-600">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="example@mail.com"
                                    value={form.email || ""}
                                    disabled={!editing}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    className="w-full mt-1 border p-2 rounded-md disabled:bg-gray-50"
                                />
                            </div>
                            {/* BUDGET */}
                            <div className="col-span-2 md:col-span-1">
                                <label className="text-sm font-semibold text-gray-600">
                                    Campaign Budget
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter budget"
                                    value={form.budget || ""}
                                    disabled={!editing}
                                    onChange={(e) => updateField("budget", e.target.value)}
                                    className="w-full mt-1 border p-2 rounded-md disabled:bg-gray-50"
                                />
                            </div>

                            {/* NEGOTIABLE BUDGET */}
                            <div className="col-span-2 md:col-span-1">
                                <label className="text-sm font-semibold text-gray-600">
                                    Negotiable Budget
                                </label>
                                <input
                                    type="number"
                                    placeholder="Enter negotiable budget"
                                    value={form.negotiableBudget || ""}
                                    disabled={!editing}
                                    onChange={(e) => updateField("negotiableBudget", e.target.value)}
                                    className="w-full mt-1 border p-2 rounded-md disabled:bg-gray-50"
                                />
                            </div>
                            {/* CATEGORIES */}
                            <div className="col-span-2">
                                <label className="text-sm font-semibold text-gray-600 block mb-2">Categories</label>
                                <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[45px] bg-white">
                                    {editing ? (
                                        categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => handleArrayToggle("category", cat)}
                                                className={`px-3 py-1 rounded-full text-xs border ${form.category.includes(cat) ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))
                                    ) : (
                                        form.category.map((cat: string) => (
                                            <span key={cat} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">{cat}</span>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* LANGUAGES */}
                            <div className="col-span-2">
                                <label className="text-sm font-semibold text-gray-600 block mb-2">Languages</label>
                                <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[45px] bg-white">
                                    {editing ? (
                                        languages.map(lang => (
                                            <button
                                                key={lang}
                                                onClick={() => handleArrayToggle("languages", lang)}
                                                className={`px-3 py-1 rounded-full text-xs border ${form.languages.includes(lang) ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {lang}
                                            </button>
                                        ))
                                    ) : (
                                        form.languages.map((lang: string) => (
                                            <span key={lang} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">{lang}</span>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SOCIAL MEDIA TABLE */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border overflow-x-auto">
                        <h2 className="text-lg font-semibold mb-4 text-gray-700">Social Media Presence</h2>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-gray-400 border-b">
                                    <th className="pb-2 font-medium">Platform</th>
                                    <th className="pb-2 font-medium">Username</th>
                                    <th className="pb-2 font-medium">Followers</th>
                                    <th className="pb-2 font-medium">Link</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {form.platforms.map((p: any, index: number) => (
                                    <tr key={p.name} className="group">
                                        <td className="py-3 font-bold capitalize text-gray-700">{p.name}</td>
                                        <td className="py-3">
                                            <input
                                                value={p.profileName}
                                                disabled={!editing}
                                                placeholder="Not set"
                                                onChange={(e) => updatePlatform(index, "profileName", e.target.value)}
                                                className="bg-transparent border-none focus:ring-0 w-full disabled:text-gray-500"
                                            />
                                        </td>
                                        <td className="py-3">
                                            <input
                                                value={p.followers}
                                                disabled={!editing}
                                                placeholder="0"
                                                onChange={(e) => updatePlatform(index, "followers", e.target.value)}
                                                className="bg-transparent border-none focus:ring-0 w-full disabled:text-gray-500"
                                            />
                                        </td>
                                        <td className="py-3">
                                            <input
                                                value={p.profileLink}
                                                disabled={!editing}
                                                placeholder="URL"
                                                onChange={(e) => updatePlatform(index, "profileLink", e.target.value)}
                                                className="bg-transparent border-none focus:ring-0 w-full text-blue-500 disabled:text-blue-400"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* RIGHT COLUMN: STAFF ACTIONS & REMINDERS */}
                <div className="col-span-12 lg:col-span-4 space-y-6">

                    {/* COMPLETION BUTTON */}
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-xl shadow-lg text-white">
                        <h3 className="text-lg font-bold mb-2">Verification Desk</h3>

                        <button
                            onClick={markAsComplete}
                            className="w-full bg-white text-blue-700 font-bold py-3 rounded-lg hover:bg-blue-50 transition active:scale-95"
                            disabled
                        >
                            Verified Profile
                        </button>
                    </div>

                    {/* REMINDER SECTION */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Staff Reminders</h3>
                        <ul className="space-y-4">
                            <li className="flex flex-col">
                                <span className="text-[10px] uppercase font-black text-gray-400">Primary Contact</span>
                                <span className="text-sm font-medium text-gray-700">{form.phone || "No Phone"}</span>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-[10px] uppercase font-black text-gray-400">Email Status</span>
                                <span className="text-sm font-medium text-gray-700">{form.email || "No Email"}</span>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-[10px] uppercase font-black text-gray-400">Profile Completeness</span>
                                <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1">
                                    <div className="bg-green-500 h-1.5 rounded-full w-[75%]"></div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="mt-8 border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Edit History</h2>

              <button
                onClick={() => setShowHistoryModal(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                Expand View
              </button>
            </div>

            {specificEditHistory && specificEditHistory.length > 0 ? (
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {specificEditHistory
                  .slice()
                  .reverse()
                  .map((log: any, index: number) => (
                    <div
                      key={index}
                      className="border-l-2 border-blue-500 pl-4 py-3"
                    >
                      {/* User */}
                      <p className="font-medium text-sm">
                        {log.editedBy || "Unknown User"}
                      </p>

                      {/* Action */}
                      <p className="text-gray-600 text-sm">
                        {log.action === "verify"
                          ? "Verified & stored profile"
                          : "Edited profile"}
                      </p>

                      {/* Field Changes */}
                      {log.changes &&
                        Object.entries(log.changes).map(([field, value]: any, i: number) => {

                          const oldValue = formatValue(value.old)
                          const newValue = formatValue(value.new)

                          return (
                            <p key={i} className="text-xs mt-1">
                              <span className="font-medium capitalize">
                                {field}
                              </span>
                              :{" "}
                              <span className="text-red-500">
                                {oldValue}
                              </span>{" "}
                              →{" "}
                              <span className="text-green-600">
                                {newValue}
                              </span>
                            </p>
                          )
                        })}

                      {/* Date */}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(log.date).toLocaleString()}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No history available</p>
            )}
          </div>
{showHistoryModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

              <div className="bg-white w-[800px] max-h-[80vh] rounded-xl shadow-xl p-6 overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Full Edit History</h2>

                  <button
                    onClick={() => setShowHistoryModal(false)}
                    className="text-gray-500 hover:text-black"
                  >
                    ✕
                  </button>
                </div>

                {/* Scrollable History */}
                <div className="overflow-y-auto max-h-[65vh] space-y-4 pr-2">

                  {specificEditHistory
                    ?.slice()
                    .reverse()
                    .map((log: any, index: number) => (

                      <div
                        key={index}
                        className="border-l-2 border-blue-500 pl-4 py-3"
                      >

                        <p className="font-medium text-sm">
                          {log.editedBy || "Unknown User"}
                        </p>

                        <p className="text-gray-600 text-sm">
                          {log.action === "verify"
                            ? "Verified & stored profile"
                            : "Edited profile"}
                        </p>

                        {log.changes &&
                          Object.entries(log.changes).map(
                            ([field, value]: any, i: number) => {

                              const formatValue = (val: any) => {
                                if (!val) return "None"

                                if (Array.isArray(val)) {
                                  if (typeof val[0] === "object") {
                                    return val
                                      .map(
                                        (p: any) =>
                                          `${p.name} (${p.profileName || "no username"})`
                                      )
                                      .join(", ")
                                  }
                                  return val.join(", ")
                                }

                                if (typeof val === "object") {
                                  return Object.values(val).join(", ")
                                }

                                return val
                              }

                              return (
                                <p key={i} className="text-sm mt-1">
                                  <span className="font-medium capitalize">
                                    {field}
                                  </span>
                                  :{" "}
                                  <span className="text-red-500">
                                    {formatValue(value.old)}
                                  </span>{" "}
                                  →{" "}
                                  <span className="text-green-600">
                                    {formatValue(value.new)}
                                  </span>
                                </p>
                              )
                            }
                          )}

                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(log.date).toLocaleString()}
                        </p>

                      </div>

                    ))}

                </div>

              </div>

            </div>
          )}
                </div>
            </div>
        </div>
    )
}