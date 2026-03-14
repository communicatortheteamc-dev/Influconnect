"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
    Instagram,
    Youtube,
    Facebook,
    Twitter,
    Globe,
    Scan
} from "lucide-react"
const categories = [
    "Fashion & Lifestyle",
    "Beauty",
    "Fitness & Health",
    "Travel",
    "Food",
    "Technology",
    "Gaming",
    "Education",
    "Finance",
    "Business",
    "Entertainment",
    "Comedy",
    "Motivation",
    "Photography",
    "Parenting",
    "Spiritual"
]

const platforms = [
    "instagram",
    "youtube",
    "facebook",
    "twitter"
]

export default function InfluencersPage() {

    const [data, setData] = useState<any>(null)

    const [filters, setFilters] = useState({
        search: "",
        category: "",
        platform: "",
        location: "",
        followers: "",
        language: ""
    })

    const [page, setPage] = useState(1)

    const loadInfluencers = async () => {

        const params = new URLSearchParams({
            ...filters,
            page: String(page)
        })

        const res = await fetch(`/api/crm/influencers/complete/get?${params}`)
        const json = await res.json()

        setData(json)

    }

    useEffect(() => {
        loadInfluencers()
    }, [filters, page])

    const resetFilters = () => {
        setFilters({
            search: "",
            category: "",
            platform: "",
            location: "",
            followers: "",
            language: ""
        })
        setPage(1)
    }

    return (

        <div className="space-y-6">

            <h1 className="text-3xl font-bold">
                Influencers
            </h1>


            {/* FILTERS */}

            <div className="bg-white p-6 rounded-xl shadow grid grid-cols-6 gap-4">

                <input
                    placeholder="Search influencer"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="border rounded p-2"
                />


                <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="border rounded p-2"
                >
                    <option value="">All Categories</option>

                    {categories.map((cat) => (
                        <option key={cat}>{cat}</option>
                    ))}

                </select>


                <select
                    value={filters.platform}
                    onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
                    className="border rounded p-2"
                >

                    <option value="">All Platforms</option>

                    {platforms.map((p) => (
                        <option key={p}>{p}</option>
                    ))}

                </select>


                <input
                    placeholder="Location"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="border rounded p-2"
                />


                <select
                    value={filters.followers}
                    onChange={(e) => setFilters({ ...filters, followers: e.target.value })}
                    className="border rounded p-2"
                >

                    <option value="">Followers</option>
                    <option value="10000">10K+</option>
                    <option value="50000">50K+</option>
                    <option value="100000">100K+</option>
                    <option value="500000">500K+</option>
                    <option value="1000000">1M+</option>

                </select>
                <select
                    value={filters.language}
                    onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                    className="border p-2 rounded"
                >
                    <option value="">Language</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Kannada">Kannada</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Marathi">Marathi</option>
                </select>

                <button
                    onClick={resetFilters}
                    className="bg-gray-200 hover:bg-gray-300 rounded px-4"
                >
                    Reset
                </button>

            </div>



            {/* TABLE */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="space-y-3">

                    {data?.influencers?.map((inf: any) => {

                        return (

                            <div
                                key={inf._id}
                                className="bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between hover:shadow-md transition"
                            >

                                {/* LEFT */}

                                <div className="flex items-center gap-4">

                                    <Image
                                        src={inf.influencerImage || "/avatar.png"}
                                        width={50}
                                        height={50}
                                        alt=""
                                        className="rounded-full"
                                    />

                                    <div>

                                        <p className="font-semibold text-lg">
                                            {inf.influencerName}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {inf.category?.join(", ")} • {inf.location || "Unknown"}
                                        </p>

                                        {/* PLATFORMS */}

                                        <div className="flex gap-3 mt-2">

                                            {inf.platforms?.map((p: any) => {

                                                const platform = p.name?.toLowerCase()

                                                let Icon = Globe

                                                if (platform === "instagram") Icon = Instagram
                                                if (platform === "youtube") Icon = Youtube
                                                if (platform === "facebook") Icon = Facebook
                                                if (platform === "twitter" || platform === "x") Icon = Twitter
                                                if (platform === "snapchat") Icon = Scan

                                                return (

                                                    <div
                                                        key={p.name}
                                                        className="flex items-center gap-1 text-sm bg-gray-100 px-2 py-1 rounded-md"
                                                    >

                                                        <Icon size={16} />

                                                        <span>
                                                            {p.followers >= 1000000
                                                                ? (p.followers / 1000000).toFixed(1) + "M"
                                                                : (p.followers / 1000).toFixed(0) + "K"}
                                                        </span>

                                                    </div>

                                                )

                                            })}

                                        </div>

                                    </div>

                                </div>


                                {/* ACTION */}
                                <div className="flex gap-2">
                                    {/* <Link
    href={`/crm/influencers/${inf._id}?edit=true`}
    className="bg-black text-white px-4 py-2 rounded-lg text-sm"
  >
    Edit
  </Link> */}
                                    <Link
                                        href={`/crm/complete/${inf._id}`}
                                        className="bg-black text-white px-4 py-2 rounded-lg text-sm"
                                    >
                                        View
                                    </Link>
                                </div>


                            </div>

                        )

                    })}

                </div>

            </div>



            {/* PAGINATION */}

            <div className="flex justify-between items-center">

                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="border px-4 py-2 rounded disabled:opacity-40"
                >
                    Previous
                </button>


                <span>
                    Page {data?.page} / {data?.pages}
                </span>


                <button
                    disabled={page === data?.pages}
                    onClick={() => setPage(page + 1)}
                    className="border px-4 py-2 rounded disabled:opacity-40"
                >
                    Next
                </button>

            </div>


        </div>

    )

}