"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import {
    Facebook,
    Globe,
    Instagram,
    Scan,
    Twitter,
    Youtube
} from "lucide-react"
import * as XLSX from "xlsx"
import { useRef } from "react"
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

const mergeCampaignStatus = (
    influencers: any[],
    campaignLinks: any[],
    campaigns: any[]
) => {

    return influencers.map((inf) => {

        const links = campaignLinks.filter(
            (item) =>
                item.influencerId?.toString() === inf._id?.toString()
        )

        const matchedCampaigns = links
            .map(link =>
                campaigns.find(
                    c => c._id?.toString() === link.campaignId?.toString()
                )
            )
            .filter(Boolean)

        return {
            ...inf,
            campaignNames: matchedCampaigns.map((c: any) => c.name)
        }

    })

}
export default function CampaignDetails() {
    const params = useParams()
    const campaignId = params.id
    const router = useRouter()
    const [tab, setTab] = useState("available")
    const [influencers, setInfluencers] = useState<any[]>([])
    const [addedInfluencers, setAddedInfluencers] = useState<any[]>([])
    const [campaignLinks, setCampaignLinks] = useState<any[]>([])
    const [campaigns, setCampaigns] = useState<any[]>([])
    const [user, setUser] = useState<any>(null)

    const [filters, setFilters] = useState({
        search: "",
        category: "",
        platform: "",
        location: "",
        followers: "",
        language: ""
    })
    const fieldLabels: Record<string, string> = {
        city: "City",
        contactNumber: "Contact Number",
        status: "Status",
        doingOrDrop: "Doing / Drop",
        pageLink: "Page Link",
        rating: "Rating",
        activityLink: "Activity Link",
        quotedBudget: "Quoted Budget",
        clientPercent: "Client %",
        influBudget: "Influ Budget",
        budget: "Budget",
        paymentStatus: "Payment Status",
        dateOfPayment: "Date of Payment",
        amountPaid: "Amount Paid",
        reach: "Reach",
        likes: "Likes",
        shares: "Shares",
        remarks: "Remarks",
        influencer: "Influencer",
        campaignRow: "Campaign Row"
    }
    const saveTimeouts = useRef<{ [key: string]: any }>({})
    const autoSaveRow = (row: any) => {
        const id = row._id

        if (saveTimeouts.current[id]) {
            clearTimeout(saveTimeouts.current[id])
        }

        saveTimeouts.current[id] = setTimeout(() => {
            saveRow(row)
        }, 800) // delay (ms)
    }
    const getActionStyles = (action: string) => {
        switch (action) {
            case "add":
                return {
                    dot: "bg-green-500",
                    badge: "bg-green-100 text-green-700",
                    label: "Added"
                }
            case "edit":
                return {
                    dot: "bg-blue-500",
                    badge: "bg-blue-100 text-blue-700",
                    label: "Edited"
                }
            case "replace":
                return {
                    dot: "bg-yellow-500",
                    badge: "bg-yellow-100 text-yellow-800",
                    label: "Replaced"
                }
            case "remove":
                return {
                    dot: "bg-red-500",
                    badge: "bg-red-100 text-red-700",
                    label: "Removed"
                }
            case "restore":
                return {
                    dot: "bg-purple-500",
                    badge: "bg-purple-100 text-purple-700",
                    label: "Restored"
                }
            default:
                return {
                    dot: "bg-gray-400",
                    badge: "bg-gray-100 text-gray-700",
                    label: action || "Action"
                }
        }
    }
    const [page, setPage] = useState(1)

    const [showHistoryModal, setShowHistoryModal] = useState(false)
    const [campaignHistory, setCampaignHistory] = useState<any[]>([])
    const formatHistoryValue = (value: any) => {
        if (value === null || value === undefined || value === "") return "—"

        if (typeof value === "object") {
            if (Array.isArray(value)) return value.join(", ")
            if (value.$oid) return value.$oid
            return JSON.stringify(value)
        }

        return String(value)
    }
    const [historyLoading, setHistoryLoading] = useState(false)
    const loadCampaignHistory = async () => {
        try {

            const res = await fetch(`/api/crm/campaign/${campaignId}/history`)




            setHistoryLoading(true)

            const data = await res.json()
            setCampaignHistory(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error("Failed to load campaign history:", error)
            setCampaignHistory([])
        } finally {
            setHistoryLoading(false)
        }
    }

    const normalizeInfluencers = (items: any[]) => {
        return items.map((inf: any) => ({
            ...inf,
            category: Array.isArray(inf.category)
                ? inf.category
                : inf.category
                    ? [inf.category]
                    : [],
            languages: Array.isArray(inf.languages)
                ? inf.languages
                : inf.languages
                    ? [inf.languages]
                    : [],
            platforms: Array.isArray(inf.platforms) ? inf.platforms : [],
            phone: inf.phone || "",
            email: inf.email || "",
            budget: inf.budget || ""
        }))
    }

    // const loadAddedInfluencers = async () => {
    //     try {
    //         const res = await fetch(`/api/crm/campaign/${campaignId}/influencers`)
    //         const data = await res.json()
    //         setAddedInfluencers(Array.isArray(data) ? data : [])
    //     } catch (error) {
    //         console.error("Failed to load added influencers:", error)
    //     }
    // }
    const loadAddedInfluencers = async () => {
        try {
            const res = await fetch(`/api/crm/campaign/${campaignId}/influencers`)
            const data = await res.json()

            const normalized = (Array.isArray(data) ? data : []).map((row: any) => {
                const profile = row.profile || {}

                const quotedBudget = row.quotedBudget || profile?.budget || ""
                const influBudget = row.influBudget || profile?.negotiableBudget || ""
                const percent = Number(row.clientPercent || 0)

                const calculatedBudget =
                    quotedBudget && percent
                        ? (Math.round((Number(quotedBudget) * percent) / 100) + Number(quotedBudget))
                        : row.budget || ""

                return {
                    ...row,
                    quotedBudget,
                    influBudget,
                    budget: calculatedBudget
                }
            })

            setAddedInfluencers(normalized)
        } catch (error) {
            console.error("Failed to load added influencers:", error)
        }
    }
    const [campaign, setCampaign] = useState<any>(null)
    useEffect(() => {
        if (!campaignId) return

        const loadCampaign = async () => {
            const res = await fetch(`/api/crm/campaign/${campaignId}`)
            const data = await res.json()

            if (res.ok) {
                setCampaign(data.campaign)
            }
        }

        loadCampaign()
    }, [campaignId])
    const loadInfluencers = async () => {
        try {
            const query = new URLSearchParams({
                ...filters,
                page: String(page)
            })

            const [infRes, linksRes, campRes] = await Promise.all([
                fetch(`/api/crm/influencers/complete/get?${query.toString()}`),
                fetch("/api/crm/campaign-links"),
                fetch("/api/crm/campaign/list")
            ])

            const infData = await infRes.json()
            const linksData = await linksRes.json()
            const campData = await campRes.json()

            const allCampaigns = [
                ...(campData?.running || []),
                ...(campData?.completed || [])
            ]

            const normalizedInfluencers = normalizeInfluencers(
                infData?.influencers || []
            )

            const mergedInfluencers = mergeCampaignStatus(
                normalizedInfluencers,
                Array.isArray(linksData) ? linksData : [],
                allCampaigns
            )

            setInfluencers(mergedInfluencers)
            setCampaignLinks(Array.isArray(linksData) ? linksData : [])
            setCampaigns(allCampaigns)
        } catch (error) {
            console.error("Failed to load influencers:", error)
        }
    }

    useEffect(() => {
        fetch("/api/crm/me", {
            credentials: "include"
        })
            .then((res) => res.json())
            .then((data) => setUser(data.user))
            .catch((error) => console.error("Failed to load user:", error))
    }, [])

    useEffect(() => {
        loadInfluencers()
    }, [filters, page])

    useEffect(() => {
        loadAddedInfluencers()
    }, [campaignId])

    const addToCampaign = async (id: any) => {
        try {
            const res = await fetch("/api/crm/campaign/add-influencer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    campaignId,
                    influencerId: id,
                    staff: user?.email || null
                })
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data?.message || "Failed to add influencer")
                return
            }

            alert("Influencer added to campaign")
            await Promise.all([loadAddedInfluencers(), loadInfluencers()])
        } catch (error) {
            console.error("Failed to add influencer:", error)
            alert("Failed to add influencer")
        }
    }

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

    const statusOptions = [
        "shooting",
        "shoot done",
        "under editing",
        "video sent",
        "modifications",
        "sent for approval",
        "uploaded"
    ]

    const ratingOptions = [
        "nano",
        "micro",
        "macro",
        "celebrity",
        "mega"
    ]

    const paymentStatusOptions = [
        "paid",
        "unpaid"
    ]

    const exportFieldOptions = [
        { key: "sno", label: "Sno" },
        { key: "city", label: "City" },
        { key: "influencer", label: "Influencer" },
        { key: "followers", label: "Followers" },
        { key: "contactNumber", label: "Contact Number" },
        { key: "status", label: "Status" },
        { key: "doingOrDrop", label: "DOING / DROP" },
        { key: "pageLink", label: "Page Link" },
        { key: "rating", label: "Rating" },
        { key: "activityLink", label: "Activity link" },
        { key: "quotedBudget", label: "Quoted Budget" },
        { key: "clientPercent", label: "Client %" },
        { key: "influBudget", label: "Influ Budget" },
        { key: "budget", label: "Budget" },
        { key: "paymentStatus", label: "Payment Status" },
        { key: "dateOfPayment", label: "Date of Payment" },
        { key: "amountPaid", label: "Amount Paid" },
        { key: "reach", label: "Reach" },
        { key: "likes", label: "Likes" },
        { key: "shares", label: "Shares" },
        { key: "remarks", label: "Remarks" }
    ]

    const [showTimelineModal, setShowTimelineModal] = useState(false)
    const [timelineTarget, setTimelineTarget] = useState<any>(null)

    const [selectedRows, setSelectedRows] = useState<string[]>([])
    const [showReplaceModal, setShowReplaceModal] = useState(false)
    const [replaceTarget, setReplaceTarget] = useState<any>(null)
    const [replaceSearch, setReplaceSearch] = useState("")
    const [exportFields, setExportFields] = useState<string[]>(exportFieldOptions.map((f) => f.key))
    const [showExportModal, setShowExportModal] = useState(false)



    const getProfileFromRow = (row: any) => {
        return row.profile || {}
    }

    const formatFollowers = (num: number | string) => {
        const value = Number(num)
        if (!value || Number.isNaN(value)) return "0"
        if (value >= 1000000) return (value / 1000000).toFixed(1) + "M"
        if (value >= 1000) return (value / 1000).toFixed(0) + "K"
        return String(value)
    }

    const getTotalFollowers = (platforms: any[] = []) => {
        const total = platforms.reduce(
            (sum, p) => sum + (Number(p.followers) || 0),
            0
        )

        if (total >= 1000000) return (total / 1000000).toFixed(1) + "M"
        if (total >= 1000) return (total / 1000).toFixed(0) + "K"
        return String(total)
    }
    const getinstaTotalFollowers = (platforms: any) => {
        // const total = platforms.reduce(
        //     (sum, p) => sum + (Number(p.followers) || 0),
        //     0
        // )

        if (Number(platforms) >= 1000000) return (Number(platforms) / 1000000).toFixed(1) + "M"
        if (Number(platforms) >= 1000) return (Number(platforms) / 1000).toFixed(0) + "K"
        return String(Number(platforms) || 0)
    }
    // const updateRow = (id: string, field: string, value: any) => {
    //     setAddedInfluencers((prev: any[]) =>
    //         prev.map((row) =>
    //             row._id?.toString() === id?.toString()
    //                 ? { ...row, [field]: value }
    //                 : row
    //         )
    //     )
    // }
    const updateRow = (id: string, field: string, value: any) => {
        console.log(`Updating row ${id}: setting ${field} to`, value) // Debug log to check the update parameters
        setAddedInfluencers((prev: any[]) => {
            const updated = prev.map((row) =>
                row._id?.toString() === id?.toString()
                    ? { ...row, [field]: value }
                    : row
            )

            const updatedRow = updated.find(
                (row) => row._id?.toString() === id?.toString()
            )
            console.log("Updated Row:", updatedRow) // Debug log to check the updated row
            if (updatedRow) {
                console.log("Scheduling auto-save for row:", id) // Debug log to confirm auto-save scheduling
                autoSaveRow(updatedRow)
            }

            return updated
        })
    }
    const toggleRowSelection = (id: string) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        )
    }

    const toggleSelectAll = () => {
        const allIds = addedInfluencers.map((row: any) => row._id?.toString())
        const allSelected = allIds.every((id: string) => selectedRows.includes(id))
        setSelectedRows(allSelected ? [] : allIds)
    }

    const saveRow = async (row: any) => {
        const profile = row.profile || {}

        const res = await fetch("/api/crm/campaign/update-influencer-row", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: row._id,
                staff: user?.email || null,
                influencerName: row.influencerName ?? profile?.influencerName ?? "",
                instagram_follwers: row.instagram_followers ?? profile?.platforms?.find((p: any) => p.name === "instagram")?.followers ?? "",
                city: row.city ?? profile?.location ?? "",
                contactNumber: row.contactNumber ?? profile?.phone ?? "",
                status: row.status || "",
                doingOrDrop: row.doingOrDrop || "",
                pageLink: row.pageLink || "",
                rating: row.rating || "",
                activityLink: row.activityLink || "",
                quotedBudget: row.quotedBudget || profile?.budget || "",
                influBudget: row.influBudget || profile?.negotiableBudget || "",
                clientPercent: row.clientPercent || "",
                budget: row.budget || "",
                paymentStatus: row.paymentStatus || "",
                dateOfPayment: row.dateOfPayment || "",
                amountPaid: row.amountPaid || "",
                reach: row.reach || "",
                likes: row.likes || "",
                shares: row.shares || "",
                remarks: row.remarks || ""
            })
        })

        const data = await res.json()

        if (!res.ok) {
            alert(data.message || "Failed to save")
            return
        }

        // alert("Saved successfully")
    }

    // const removeRow = async (row: any) => {
    //     const ok = confirm("Remove this influencer from campaign?")
    //     if (!ok) return

    //     const res = await fetch("/api/crm/campaign/remove-influencer", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({ id: row._id })
    //     })

    //     const data = await res.json()

    //     if (!res.ok) {
    //         alert(data.message || "Failed to remove")
    //         return
    //     }

    //     setAddedInfluencers((prev: any[]) =>
    //         prev.filter((item) => item._id?.toString() !== row._id?.toString())
    //     )
    // }
    const removeRow = async (row: any) => {
        const ok = confirm("Remove this influencer from campaign?")
        if (!ok) return

        const res = await fetch("/api/crm/campaign/remove-influencer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: row._id, staff: user?.email || null })
        })

        const data = await res.json()

        if (!res.ok) {
            alert(data.message || "Failed to remove")
            return
        }

        await loadAddedInfluencers()
    }
    const removeSelected = async () => {
        if (!selectedRows.length) {
            alert("Select at least one row")
            return
        }

        const ok = confirm("Remove selected influencers from campaign?")
        if (!ok) return

        await Promise.all(
            selectedRows.map((id) =>
                fetch("/api/crm/campaign/remove-influencer", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, staff: user?.email || null })
                })
            )
        )

        setAddedInfluencers((prev: any[]) =>
            prev.filter((item) => !selectedRows.includes(item._id?.toString()))
        )
        setSelectedRows([])
    }

    const openReplaceModal = (row: any) => {
        setReplaceTarget(row)
        setReplaceSearch("")
        setShowReplaceModal(true)
    }

    const replaceInfluencer = async (newInfluencerId: string) => {
        if (!replaceTarget) return

        const res = await fetch("/api/crm/campaign/replace-influencer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                campaignRowId: replaceTarget._id,
                newInfluencerId,
                staff: user?.email || null
            })
        })

        const data = await res.json()

        if (!res.ok) {
            alert(data.message || "Failed to replace influencer")
            return
        }

        alert("Influencer replaced successfully")
        setShowReplaceModal(false)
        setReplaceTarget(null)
        await loadAddedInfluencers()
        await loadInfluencers()
    }

    const toggleExportField = (field: string) => {
        setExportFields((prev) =>
            prev.includes(field)
                ? prev.filter((f) => f !== field)
                : [...prev, field]
        )
    }
    const columnOptions = [
        { key: "sno", label: "Sno" },
        { key: "city", label: "City" },
        { key: "influencer", label: "Influencer" },
        { key: "followers", label: "Followers" },
        { key: "contactNumber", label: "Contact Number" },
        { key: "status", label: "Status" },
        { key: "doingOrDrop", label: "DOING / DROP" },
        { key: "pageLink", label: "Page Link" },
        { key: "rating", label: "Rating" },
        { key: "activityLink", label: "Activity Link" },
        { key: "quotedBudget", label: "Quoted Budget" },
        { key: "clientPercent", label: "Client %" },
        { key: "influBudget", label: "Influ Budget" },
        { key: "budget", label: "Budget" },
        { key: "paymentStatus", label: "Payment Status" },
        { key: "dateOfPayment", label: "Date of Payment" },
        { key: "amountPaid", label: "Amount Paid" },
        { key: "reach", label: "Reach" },
        { key: "likes", label: "Likes" },
        { key: "shares", label: "Shares" },
        { key: "remarks", label: "Remarks" },
        { key: "actions", label: "Actions" }
    ]
    const [showColumnModal, setShowColumnModal] = useState(false)

    const [visibleColumns, setVisibleColumns] = useState<string[]>([
        "sno",
        "city",
        "influencer",
        "followers",
        "contactNumber",
        "status",
        "quotedBudget",
        "clientPercent",
        "influBudget",
        "budget",
        "paymentStatus",
        "actions"
    ])
    const toggleColumn = (key: string) => {
        setVisibleColumns((prev) =>
            prev.includes(key)
                ? prev.filter((col) => col !== key)
                : [...prev, key]
        )
    }
    useEffect(() => {
        const savedColumns = localStorage.getItem("campaignTableColumns")
        if (savedColumns) {
            setVisibleColumns(JSON.parse(savedColumns))
        }
    }, [])
    const groupHistoryByInfluencer = (logs: any[]) => {
        const grouped: Record<string, any[]> = {}

        logs.forEach((log) => {
            const key =
                log.influencerName ||
                log.influencerId?.toString() ||
                "Unknown Influencer"

            if (!grouped[key]) {
                grouped[key] = []
            }

            grouped[key].push(log)
        })

        return Object.entries(grouped).map(([influencerName, items]) => ({
            influencerName,
            items: items.sort(
                (a, b) =>
                    new Date(b.createdAt || b.editedAt).getTime() -
                    new Date(a.createdAt || a.editedAt).getTime()
            )
        }))
    }
    useEffect(() => {
        localStorage.setItem(
            "campaignTableColumns",
            JSON.stringify(visibleColumns)
        )
    }, [visibleColumns])
    useEffect(() => {
        const savedColumns = localStorage.getItem("campaign-visible-columns")

        if (savedColumns) {
            setVisibleColumns(JSON.parse(savedColumns))
        }
    }, [])
    // const exportExcel = () => {
    //     const rows = addedInfluencers.map((row: any, index: number) => {
    //         const profile = getProfileFromRow(row)

    //         const instagramLink =
    //             profile?.platforms?.find(
    //                 (p: any) => p.name?.toLowerCase() === "instagram"
    //             )?.profileLink || ""

    //         const result: any = {}

    //         if (exportFields.includes("sno")) result["Sno"] = index + 1
    //         if (exportFields.includes("city"))
    //             result["City"] = row.city ?? profile?.location ?? ""
    //         if (exportFields.includes("influencer"))
    //             result["Influencer"] = profile?.influencerName || ""
    //         if (exportFields.includes("followers"))
    //             result["Followers"] = getTotalFollowers(profile?.platforms || [])
    //         if (exportFields.includes("contactNumber"))
    //             result["Contact Number"] = row.contactNumber ?? profile?.phone ?? ""
    //         if (exportFields.includes("status")) result["Status"] = row.status || ""
    //         if (exportFields.includes("doingOrDrop"))
    //             result["DOING / DROP"] = row.doingOrDrop || ""
    //         if (exportFields.includes("pageLink"))
    //             result["Page Link"] = row.pageLink || instagramLink || ""
    //         if (exportFields.includes("rating")) result["Rating"] = row.rating || ""
    //         if (exportFields.includes("activityLink"))
    //             result["Activity Link"] = row.activityLink || ""
    //         if (exportFields.includes("quotedBudget"))
    //             result["Quoted Budget"] = row.quotedBudget || ""
    //         if (exportFields.includes("clientPercent"))
    //             result["Client %"] = row.clientPercent || ""
    //         if (exportFields.includes("influBudget"))
    //             result["Influ Budget"] = row.influBudget || ""
    //         if (exportFields.includes("budget")) result["Budget"] = row.budget || ""
    //         if (exportFields.includes("paymentStatus"))
    //             result["Payment Status"] = row.paymentStatus || ""
    //         if (exportFields.includes("dateOfPayment"))
    //             result["Date of Payment"] = row.dateOfPayment || ""
    //         if (exportFields.includes("amountPaid"))
    //             result["Amount Paid"] = row.amountPaid || ""
    //         if (exportFields.includes("reach")) result["Reach"] = row.reach || ""
    //         if (exportFields.includes("likes")) result["Likes"] = row.likes || ""
    //         if (exportFields.includes("shares")) result["Shares"] = row.shares || ""
    //         if (exportFields.includes("remarks")) result["Remarks"] = row.remarks || ""

    //         return result
    //     })

    //     const worksheet = XLSX.utils.json_to_sheet(rows)
    //     const workbook = XLSX.utils.book_new()
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Campaign Sheet")
    //     XLSX.writeFile(workbook, `campaign-${campaignId}.xlsx`)
    //     setShowExportModal(false)
    // }
const exportExcel = () => {
    const rows = getOrderedCampaignRows(filteredAddedInfluencers).map((row: any, index: number) => {
        const profile = getProfileFromRow(row)

        const instagramPlatform =
            profile?.platforms?.find(
                (p: any) => p.name?.toLowerCase() === "instagram"
            ) || row.instagram_follwers

        const instagramLink =
            row.pageLink ||
            instagramPlatform?.profileLink ||
            ""

        const cityValue =
            (row.city ? row.city : row.profile?.location) ?? profile?.location ?? ""

        const contactValue =
            (row.contactNumber ? row.contactNumber : row.profile?.phone) ?? profile?.phone ?? ""

        const influencerValue =
            (row.influencerName ? row.influencerName : row.profile?.influencerName) ??
            profile?.influencerName ??
            ""

        const instagramFollowersRaw =
            instagramPlatform?.followers ? instagramPlatform.followers :
            row.instagram_follwers 
           

        const followersValue = getinstaTotalFollowers(instagramFollowersRaw)
console.log("Instagram Followers Raw:", instagramFollowersRaw, "Formatted:", followersValue) // Debug log to check followers formatting
        const result: any = {}

        if (exportFields.includes("sno")) result["Sno"] = row.isChildRow ? "" : index + 1
        if (exportFields.includes("city")) result["City"] = cityValue
        if (exportFields.includes("influencer")) result["Influencer"] = influencerValue
        if (exportFields.includes("followers")) result["Followers"] = followersValue
        if (exportFields.includes("contactNumber")) result["Contact Number"] = contactValue
        if (exportFields.includes("status")) result["Status"] = row.status || ""
        if (exportFields.includes("doingOrDrop")) result["DOING / DROP"] = row.doingOrDrop || ""
        if (exportFields.includes("pageLink")) result["Page Link"] = instagramLink
        if (exportFields.includes("rating")) result["Rating"] = row.rating || ""
        if (exportFields.includes("activityLink")) result["Activity Link"] = row.activityLink || ""
        if (exportFields.includes("quotedBudget")) result["Quoted Budget"] = row.quotedBudget || profile?.budget || ""
        if (exportFields.includes("clientPercent")) result["Client %"] = row.clientPercent || ""
        if (exportFields.includes("influBudget")) result["Influ Budget"] = row.influBudget || profile?.negotiableBudget || ""
        if (exportFields.includes("budget")) result["Budget"] = row.budget || ""
        if (exportFields.includes("paymentStatus")) result["Payment Status"] = row.paymentStatus || ""
        if (exportFields.includes("dateOfPayment")) result["Date of Payment"] = row.dateOfPayment || ""
        if (exportFields.includes("amountPaid")) result["Amount Paid"] = row.amountPaid || ""
        if (exportFields.includes("reach")) result["Reach"] = row.reach || ""
        if (exportFields.includes("likes")) result["Likes"] = row.likes || ""
        if (exportFields.includes("shares")) result["Shares"] = row.shares || ""
        if (exportFields.includes("remarks")) result["Remarks"] = row.remarks || ""

        return result
    })

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Campaign Sheet")
    XLSX.writeFile(workbook, `campaign-${campaignId}.xlsx`)
    setShowExportModal(false)
}
    const openTimelineModal = (row: any) => {
        setTimelineTarget(row)
        setShowTimelineModal(true)
    }

    const buildReplacementChain = (targetRow: any) => {
        if (!targetRow) return []

        const logs = Array.isArray(targetRow.replacementLogs)
            ? targetRow.replacementLogs
            : []

        const profileMap: Record<string, string> = {}

        addedInfluencers.forEach((row: any) => {
            const profile = getProfileFromRow(row)
            if (row.influencerId) {
                profileMap[row.influencerId.toString()] = profile?.influencerName || "Unknown"
            }
            if (row.replacedFromProfile?._id) {
                profileMap[row.replacedFromProfile._id.toString()] =
                    row.replacedFromProfile.influencerName || "Unknown"
            }
            if (row.replacedByProfile?._id) {
                profileMap[row.replacedByProfile._id.toString()] =
                    row.replacedByProfile.influencerName || "Unknown"
            }
        })

        return logs
            .sort(
                (a: any, b: any) =>
                    new Date(a.replacedAt).getTime() - new Date(b.replacedAt).getTime()
            )
            .map((log: any) => ({
                fromName: profileMap[log.fromInfluencerId?.toString()] || "Unknown",
                toName: profileMap[log.toInfluencerId?.toString()] || "Unknown",
                replacedAt: log.replacedAt,
                staff: log.staff
            }))
    }


    const restoreInfluencer = async (row: any) => {
        const ok = confirm("Restore this influencer and remove replacement?")
        if (!ok) return

        const res = await fetch("/api/crm/campaign/restore-influencer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: row._id, staff: user?.email || null })
        })

        const data = await res.json()

        if (!res.ok) {
            alert(data.message || "Failed to restore influencer")
            return
        }

        alert("Influencer restored successfully")
        await loadAddedInfluencers()
        await loadInfluencers()
    }


    const isInfluencerInCampaign = (id: string) => {
        return addedInfluencers.some(
            (row: any) =>
                row.influencerId?.toString() === id?.toString()
        )
    }
    const getOrderedCampaignRows = (rows: any[]) => {
        const mainRows: any[] = []
        const replacementMap = new Map<string, any[]>()

        rows.forEach((row) => {
            if (row.isReplacementEntry && row.replacedFromInfluencerId) {
                const key = row.replacedFromInfluencerId.toString()

                if (!replacementMap.has(key)) {
                    replacementMap.set(key, [])
                }

                replacementMap.get(key)?.push(row)
            } else {
                mainRows.push(row)
            }
        })

        const ordered: any[] = []
        const renderedReplacementIds = new Set<string>()

        // First: render rows with their replacements
        mainRows.forEach((row) => {
            const children = replacementMap.get(row.influencerId?.toString() || "")

            if (children?.length) {
                children.forEach((child) => {
                    ordered.push({
                        ...child,
                        isChildRow: false,
                        isReplacementTopRow: true
                    })
                    renderedReplacementIds.add(child._id?.toString())
                })

                ordered.push({
                    ...row,
                    isChildRow: true,
                    isReplacementTopRow: false
                })
            } else {
                ordered.push({
                    ...row,
                    isChildRow: false,
                    isReplacementTopRow: false
                })
            }
        })

        // Second: render orphan replacement rows too
        rows.forEach((row) => {
            if (
                row.isReplacementEntry &&
                !renderedReplacementIds.has(row._id?.toString())
            ) {
                ordered.push({
                    ...row,
                    isChildRow: false,
                    isReplacementTopRow: false,
                    isOrphanReplacement: true
                })
            }
        })

        return ordered
    }
    let serial = 0
    const [addedFilters, setAddedFilters] = useState({
        search: "",
        city: "",
        status: "",
        rating: "",
        paymentStatus: "",
        doingOrDrop: "",
        minBudget: "",
        maxBudget: ""
    })
    const resetAddedFilters = () => {
        setAddedFilters({
            search: "",
            city: "",
            status: "",
            rating: "",
            paymentStatus: "",
            doingOrDrop: "",
            minBudget: "",
            maxBudget: ""
        })
    }
    const filteredAddedInfluencers = getOrderedCampaignRows(addedInfluencers).filter(
        (row: any) => {
            const profile = getProfileFromRow(row)

            const searchText = addedFilters.search.toLowerCase().trim()
            const influencerName = (profile?.influencerName || "").toLowerCase()
            const city = String(row.city ?? profile?.location ?? "").toLowerCase()
            const status = String(row.status || "").toLowerCase()
            const rating = String(row.rating || "").toLowerCase()
            const paymentStatus = String(row.paymentStatus || "").toLowerCase()
            const doingOrDrop = String(row.doingOrDrop || "").toLowerCase()
            const budget = Number(row.budget || 0)

            const matchesSearch =
                !searchText ||
                influencerName.includes(searchText) ||
                city.includes(searchText) ||
                String(row.contactNumber ?? profile?.phone ?? "")
                    .toLowerCase()
                    .includes(searchText)

            const matchesCity =
                !addedFilters.city ||
                city.includes(addedFilters.city.toLowerCase())

            const matchesStatus =
                !addedFilters.status ||
                status === addedFilters.status.toLowerCase()

            const matchesRating =
                !addedFilters.rating ||
                rating === addedFilters.rating.toLowerCase()

            const matchesPaymentStatus =
                !addedFilters.paymentStatus ||
                paymentStatus === addedFilters.paymentStatus.toLowerCase()

            const matchesDoingOrDrop =
                !addedFilters.doingOrDrop ||
                doingOrDrop.includes(addedFilters.doingOrDrop.toLowerCase())

            const matchesMinBudget =
                !addedFilters.minBudget || budget >= Number(addedFilters.minBudget)

            const matchesMaxBudget =
                !addedFilters.maxBudget || budget <= Number(addedFilters.maxBudget)

            return (
                matchesSearch &&
                matchesCity &&
                matchesStatus &&
                matchesRating &&
                matchesPaymentStatus &&
                matchesDoingOrDrop &&
                matchesMinBudget &&
                matchesMaxBudget
            )
        }
    )
    const addEmptyRow = async () => {
        try {
            const res = await fetch("/api/crm/campaign/add-empty-row", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    campaignId,
                    staff: user?.email || null
                })
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data?.message || "Failed to add empty row")
                return
            }

            await loadAddedInfluencers()
            alert("Empty row added successfully")
        } catch (error) {
            console.error("Failed to add empty row:", error)
            alert("Failed to add empty row")
        }
    }
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between mb-8">

                <div className="flex items-center gap-4">

                    <button
                        onClick={() => router.back()}
                        className="bg-white border px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
                    >
                        ← Back
                    </button>

                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Campaign Influencers
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Manage influencers for this campaign
                        </p>
                    </div>

                </div>

            </div>

            <div className="flex gap-6 mb-8">
                <button
                    onClick={() => setTab("available")}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition ${tab === "available"
                        ? "bg-black text-white"
                        : "bg-white border text-gray-600 hover:bg-gray-100"
                        }`}
                >
                    Available Influencers
                </button>

                <button
                    onClick={() => setTab("added")}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition ${tab === "added"
                        ? "bg-black text-white"
                        : "bg-white border text-gray-600 hover:bg-gray-100"
                        }`}
                >
                    Added Influencers
                </button>
            </div>

            {tab === "available" && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow p-6 grid grid-cols-6 gap-4">
                        <input
                            placeholder="Search influencer"
                            value={filters.search}
                            onChange={(e) =>
                                setFilters({ ...filters, search: e.target.value })
                            }
                            className="border rounded-lg px-3 py-2 text-sm"
                        />

                        <select
                            value={filters.category}
                            onChange={(e) =>
                                setFilters({ ...filters, category: e.target.value })
                            }
                            className="border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat}>{cat}</option>
                            ))}
                        </select>

                        <select
                            value={filters.platform}
                            onChange={(e) =>
                                setFilters({ ...filters, platform: e.target.value })
                            }
                            className="border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="">All Platforms</option>
                            {platforms.map((p) => (
                                <option key={p}>{p}</option>
                            ))}
                        </select>

                        <input
                            placeholder="Location"
                            value={filters.location}
                            onChange={(e) =>
                                setFilters({ ...filters, location: e.target.value })
                            }
                            className="border rounded-lg px-3 py-2 text-sm"
                        />

                        <select
                            value={filters.followers}
                            onChange={(e) =>
                                setFilters({ ...filters, followers: e.target.value })
                            }
                            className="border rounded-lg px-3 py-2 text-sm"
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
                            onChange={(e) =>
                                setFilters({ ...filters, language: e.target.value })
                            }
                            className="border rounded-lg px-3 py-2 text-sm"
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
                            className="bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
                        >
                            Reset
                        </button>
                    </div>

                    <div className="space-y-3">
                        {influencers.map((inf: any) => {
                            const alreadyAdded = addedInfluencers.some(
                                (item: any) =>
                                    item.influencerId?.toString() === inf._id?.toString()
                            )
                            return (
                                <div
                                    key={inf._id}
                                    className="bg-white rounded-xl border p-4 flex items-center justify-between hover:shadow-md transition"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <Image
                                            src={inf.influencerImage || "/avatar.png"}
                                            width={48}
                                            height={48}
                                            alt={inf.influencerName || "Influencer"}
                                            className="rounded-full object-cover"
                                        />

                                        <div className="min-w-0">
                                            <p className="font-semibold text-lg text-gray-900">
                                                {inf.influencerName}
                                            </p>

                                            <p className="text-sm text-gray-500 truncate">
                                                {Array.isArray(inf.category)
                                                    ? inf.category.join(", ")
                                                    : inf.category || "-"}{" "}
                                                • {inf.location || "Unknown"}
                                            </p>

                                            <div className="flex gap-2 mt-2 flex-wrap">
                                                {inf.platforms?.map((p: any) => {
                                                    const platform = p.name?.toLowerCase()
                                                    let Icon: any = Globe

                                                    if (platform === "instagram") Icon = Instagram
                                                    if (platform === "youtube") Icon = Youtube
                                                    if (platform === "facebook") Icon = Facebook
                                                    if (platform === "twitter" || platform === "x")
                                                        Icon = Twitter
                                                    if (platform === "snapchat") Icon = Scan

                                                    if (!p.followers || Number(p.followers) <= 0) return null

                                                    return (
                                                        <div
                                                            key={p.name}
                                                            className="flex items-center gap-1 text-sm bg-gray-100 px-2 py-1 rounded-md"
                                                        >
                                                            <Icon size={16} />
                                                            <span>{formatFollowers(p.followers)}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            <div className="mt-2 flex items-center gap-3 flex-wrap">
                                                <span className="text-sm text-gray-600">
                                                    {Array.isArray(inf.languages)
                                                        ? inf.languages.join(", ")
                                                        : inf.languages || "-"}
                                                </span>

                                                <span className="text-sm font-medium text-green-600">
                                                    ₹ {inf.budget || "-"}
                                                </span>
                                                <div className="flex gap-2 flex-wrap mt-2">

                                                    {inf.campaignNames?.length > 0 ? (
                                                        inf.campaignNames.map((name: string, i: number) => (
                                                            <span
                                                                key={i}
                                                                className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded"
                                                            >
                                                                {name}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                                                            Available
                                                        </span>
                                                    )}

                                                </div>              </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => addToCampaign(inf._id)}
                                        disabled={alreadyAdded}
                                        className={`px-4 py-2 rounded-lg text-sm text-white transition
    ${alreadyAdded
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-black hover:bg-gray-800"
                                            }`}
                                    >
                                        {alreadyAdded ? "Added" : "Add"}
                                    </button>
                                </div>
                            )
                        }



                        )}
                    </div>
                </div>
            )}

            {tab === "added" && (
                <div className="space-y-4">
                    {campaign && (
                        <div className="mb-6">
                            <select
                                value={campaign.status || ""}
                                onChange={async (e) => {
                                    const newStatus = e.target.value

                                    setCampaign((prev: any) => ({
                                        ...prev,
                                        status: newStatus,
                                    }))

                                    const res = await fetch("/api/crm/campaign/update-status", {
                                        method: "PUT",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                            id: campaign._id,
                                            status: newStatus,
                                        }),
                                    })

                                    if (!res.ok) {
                                        alert("Failed to update campaign status")
                                    }
                                }}
                                className="border rounded px-4 py-2 min-w-[180px]"
                            >
                                <option value="running">Running</option>
                                <option value="completed">Completed</option>
                                <option value="hold">Hold</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    )}
                    <div className="bg-white border rounded-xl p-4 grid grid-cols-4 gap-3">
                        <input
                            placeholder="Search influencer / phone / city"
                            value={addedFilters.search}
                            onChange={(e) =>
                                setAddedFilters({ ...addedFilters, search: e.target.value })
                            }
                            className="border rounded-lg px-3 py-2 text-sm"
                        />

                        <input
                            placeholder="City"
                            value={addedFilters.city}
                            onChange={(e) =>
                                setAddedFilters({ ...addedFilters, city: e.target.value })
                            }
                            className="border rounded-lg px-3 py-2 text-sm"
                        />

                        <select
                            value={addedFilters.status}
                            onChange={(e) =>
                                setAddedFilters({ ...addedFilters, status: e.target.value })
                            }
                            className="border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="">All Status</option>
                            {statusOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>

                        <select
                            value={addedFilters.rating}
                            onChange={(e) =>
                                setAddedFilters({ ...addedFilters, rating: e.target.value })
                            }
                            className="border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="">All Rating</option>
                            {ratingOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>

                        <select
                            value={addedFilters.paymentStatus}
                            onChange={(e) =>
                                setAddedFilters({ ...addedFilters, paymentStatus: e.target.value })
                            }
                            className="border rounded-lg px-3 py-2 text-sm"
                        >
                            <option value="">Payment Status</option>
                            {paymentStatusOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>

                        <input
                            placeholder="Doing / Drop"
                            value={addedFilters.doingOrDrop}
                            onChange={(e) =>
                                setAddedFilters({ ...addedFilters, doingOrDrop: e.target.value })
                            }
                            className="border rounded-lg px-3 py-2 text-sm"
                        />

                        <input
                            type="number"
                            placeholder="Min Budget"
                            value={addedFilters.minBudget}
                            onChange={(e) =>
                                setAddedFilters({ ...addedFilters, minBudget: e.target.value })
                            }
                            className="border rounded-lg px-3 py-2 text-sm"
                        />

                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Max Budget"
                                value={addedFilters.maxBudget}
                                onChange={(e) =>
                                    setAddedFilters({ ...addedFilters, maxBudget: e.target.value })
                                }
                                className="border rounded-lg px-3 py-2 text-sm w-full"
                            />

                            <button
                                onClick={resetAddedFilters}
                                className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                    <div className="bg-white border rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    addedInfluencers.length > 0 &&
                                    addedInfluencers.every((row: any) =>
                                        selectedRows.includes(row._id?.toString())
                                    )
                                }
                                onChange={toggleSelectAll}
                                className="w-4 h-4"
                            />
                            <span className="text-sm text-gray-600">Select All</span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={addEmptyRow}
                                className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800"
                            >
                                + Add Empty Row
                            </button>
                            <button
                                onClick={() => setShowColumnModal(true)}
                                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                            >
                                Customize Columns
                            </button>
                            <button
                                onClick={async () => {
                                    await loadCampaignHistory()
                                    setShowHistoryModal(true)
                                }}
                                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                            >
                                View History
                            </button>
                            <button
                                onClick={() => setShowExportModal(true)}
                                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                            >
                                Export Excel
                            </button>

                            <button
                                onClick={removeSelected}
                                className="px-4 py-2 text-sm border rounded-lg text-red-600 hover:bg-red-50"
                            >
                                Remove Selected
                            </button>
                        </div>
                    </div>

                    <div className="bg-white border rounded-xl overflow-auto">
                        <table className="min-w-auto w-full text-sm">
                            <thead className="bg-green-100">
                                <tr>
                                    <th className="p-3 border text-left w-[50px]"></th>

                                    {visibleColumns.includes("sno") && (
                                        <th className="p-3 border text-left">Sno</th>
                                    )}

                                    {visibleColumns.includes("city") && (
                                        <th className="p-3 border text-left">City</th>
                                    )}

                                    {visibleColumns.includes("influencer") && (
                                        <th className="p-3 border text-left">Influencer</th>
                                    )}

                                    {visibleColumns.includes("followers") && (
                                        <th className="p-3 border text-left">Followers</th>
                                    )}

                                    {visibleColumns.includes("contactNumber") && (
                                        <th className="p-3 border text-left">Contact Number</th>
                                    )}

                                    {visibleColumns.includes("status") && (
                                        <th className="p-3 border text-left">Status</th>
                                    )}

                                    {visibleColumns.includes("doingOrDrop") && (
                                        <th className="p-3 border text-left">DOING / DROP</th>
                                    )}

                                    {visibleColumns.includes("pageLink") && (
                                        <th className="p-3 border text-left">Page Link</th>
                                    )}

                                    {visibleColumns.includes("rating") && (
                                        <th className="p-3 border text-left">Rating</th>
                                    )}

                                    {visibleColumns.includes("activityLink") && (
                                        <th className="p-3 border text-left">Activity Link</th>
                                    )}

                                    {visibleColumns.includes("quotedBudget") && (
                                        <th className="p-3 border text-left">Quoted Budget</th>
                                    )}

                                    {visibleColumns.includes("clientPercent") && (
                                        <th className="p-3 border text-left">Client %</th>
                                    )}

                                    {visibleColumns.includes("influBudget") && (
                                        <th className="p-3 border text-left">Influ Budget</th>
                                    )}

                                    {visibleColumns.includes("budget") && (
                                        <th className="p-3 border text-left">Budget</th>
                                    )}

                                    {visibleColumns.includes("paymentStatus") && (
                                        <th className="p-3 border text-left">Payment Status</th>
                                    )}

                                    {visibleColumns.includes("dateOfPayment") && (
                                        <th className="p-3 border text-left">Date of Payment</th>
                                    )}

                                    {visibleColumns.includes("amountPaid") && (
                                        <th className="p-3 border text-left">Amount Paid</th>
                                    )}

                                    {visibleColumns.includes("reach") && (
                                        <th className="p-3 border text-left">Reach</th>
                                    )}

                                    {visibleColumns.includes("likes") && (
                                        <th className="p-3 border text-left">Likes</th>
                                    )}

                                    {visibleColumns.includes("shares") && (
                                        <th className="p-3 border text-left">Shares</th>
                                    )}

                                    {visibleColumns.includes("remarks") && (
                                        <th className="p-3 border text-left">Remarks</th>
                                    )}

                                    {visibleColumns.includes("actions") && (
                                        <th className="p-3 border text-left">Actions</th>
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {getOrderedCampaignRows(filteredAddedInfluencers).map((row: any, index: number) => {
                                    const profile = getProfileFromRow(row)
                                    const instagramLink =
                                        row.profile?.platforms?.find(
                                            (p: any) => p.name?.toLowerCase() === "instagram"
                                        )?.profileLink || ""

                                    return (

                                        <tr
                                            key={row._id}
                                            className={`border-t ${row.isReplacementTopRow
                                                ? "bg-blue-50 border-l-4 border-l-blue-400"
                                                : row.isChildRow
                                                    ? "bg-red-50"
                                                    : "hover:bg-gray-50"
                                                }`}
                                        >
                                            <td className="p-2 border">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.includes(row._id?.toString())}
                                                    onChange={() => toggleRowSelection(row._id?.toString())}
                                                />
                                            </td>

                                            {visibleColumns.includes("sno") && (
                                                <td className="p-2 border">
                                                    {row.isChildRow ? (
                                                        ""
                                                    ) : (
                                                        ++serial
                                                    )}
                                                </td>
                                            )}

                                            {visibleColumns.includes("city") && row.profile && (
                                                <td className="p-2 border">
                                                    {/* <input
                                                        value={row.profile.location ?? profile?.location ?? ""}
                                                        onChange={(e) => updateRow(row._id, "city", e.target.value)}
                                                        className="w-full border rounded px-2 py-1"
                                                    /> */}
                                                    <input
                                                        value={(row.city ? row.city : row.profile.location) ?? ""}
                                                        onChange={(e) => updateRow(row._id, "city", e.target.value)}
                                                        className="w-full border rounded px-2 py-1"
                                                    />
                                                </td>
                                            )}

                                            {visibleColumns.includes("influencer") && (
                                                <td className="p-2 border min-w-[240px]">
                                                    <input
                                                        value={(row.influencerName ? row.influencerName : row.profile?.influencerName) ?? profile?.influencerName ?? ""}
                                                        onChange={(e) =>
                                                            updateRow(row._id, "influencerName", e.target.value)
                                                        }
                                                        placeholder="Enter influencer name"
                                                        className="w-full border rounded px-2 py-1"
                                                    />
                                                    {row.isReplacementTopRow && row.replacedFromProfile?.influencerName && (
                                                        <div className="text-xs text-blue-700 mt-1">
                                                            Replacement of {row.replacedFromProfile.influencerName}
                                                        </div>
                                                    )}

                                                    {row.isChildRow && row.replacedByProfile?.influencerName && (
                                                        <div className="text-xs text-red-600 mt-1">
                                                            Replaced by {row.replacedByProfile.influencerName}
                                                        </div>
                                                    )}
                                                    {Array.isArray(row.replacementLogs) &&
                                                        row.replacementLogs.length > 0 && (
                                                            <button
                                                                onClick={() => openTimelineModal(row)}
                                                                className="mt-2 text-xs text-blue-600 underline"
                                                            >
                                                                View Timeline
                                                            </button>
                                                        )}
                                                </td>
                                            )}

                                            {visibleColumns.includes("followers") && (
                                                <td className="p-2 border min-w-[220px]">
                                                    {row.influencerId ? (
                                                        <div className="relative group inline-block">
                                                            <span className="cursor-default underline decoration-dotted">
                                                                {getinstaTotalFollowers(profile?.platforms?.find(
                                                                    (p: any) => p.name?.toLowerCase() === "instagram"
                                                                )?.followers ?? row.instagram_follwers ?? "0")}
                                                            </span>

                                                            <div className="absolute left-0 top-7 z-20 hidden group-hover:block bg-black text-white text-xs rounded-lg p-3 min-w-[180px] shadow-lg">
                                                                {(profile?.platforms || [])
                                                                    .filter((p: any) => Number(p.followers) > 0)
                                                                    .map((p: any) => (
                                                                        <div
                                                                            key={p.name}
                                                                            className="flex justify-between gap-4 py-1"
                                                                        >
                                                                            <span className="capitalize">{p.name}</span>
                                                                            <span>{formatFollowers(p.followers)}</span>
                                                                        </div>
                                                                    ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <input
                                                            type="number"
                                                            placeholder="Instagram followers"
                                                            value={
                                                                (profile?.platforms?.find(
                                                                    (p: any) => p.name?.toLowerCase() === "instagram"
                                                                )?.followers ? profile?.platforms?.find(
                                                                    (p: any) => p.name?.toLowerCase() === "instagram"
                                                                )?.followers : ((row.instagram_follwers)))
                                                            }
                                                            onChange={(e) => {
                                                                const value = e.target.value

                                                                setAddedInfluencers((prev: any[]) => {
                                                                    const updated = prev.map((item) => {
                                                                        if (item._id?.toString() !== row._id?.toString()) {
                                                                            return item
                                                                        }

                                                                        const existingPlatforms = Array.isArray(item.profile?.platforms)
                                                                            ? item.profile.platforms
                                                                            : []

                                                                        const hasInstagram = existingPlatforms.some(
                                                                            (p: any) => p.name?.toLowerCase() === "instagram"
                                                                        )

                                                                        const updatedPlatforms = hasInstagram
                                                                            ? existingPlatforms.map((p: any) =>
                                                                                p.name?.toLowerCase() === "instagram"
                                                                                    ? { ...p, followers: value }
                                                                                    : p
                                                                            )
                                                                            : [
                                                                                ...existingPlatforms,
                                                                                {
                                                                                    name: "instagram",
                                                                                    profileName: "",
                                                                                    followers: value,
                                                                                    profileLink: ""
                                                                                }
                                                                            ]

                                                                        return {
                                                                            ...item,
                                                                            profile: {
                                                                                ...(item.profile || {}),
                                                                                platforms: updatedPlatforms
                                                                            }
                                                                        }
                                                                    })

                                                                    const updatedRow = updated.find(
                                                                        (item) => item._id?.toString() === row._id?.toString()
                                                                    )

                                                                    if (updatedRow) {
                                                                        autoSaveRow(updatedRow)
                                                                    }

                                                                    return updated
                                                                })
                                                            }}
                                                            className="w-full border rounded px-2 py-1"
                                                        />
                                                    )}
                                                </td>
                                            )}

                                            {visibleColumns.includes("contactNumber") && (
                                                <td className="p-2 border">
                                                    {/* <input
                                                        value={row.profile?.phone ?? profile?.phone ?? ""}
                                                        onChange={(e) =>
                                                            updateRow(row._id, "contactNumber", e.target.value)
                                                        }
                                                        className="w-full border rounded px-2 py-1"
                                                    /> */}
                                                    <input
                                                        value={(row.contactNumber ? row.contactNumber : row.profile.phone) ?? ""}
                                                        onChange={(e) => updateRow(row._id, "contactNumber", e.target.value)}
                                                        className="w-full border rounded px-2 py-1"
                                                    />
                                                </td>
                                            )}

                                            {visibleColumns.includes("status") && (
                                                <td className="p-2 border">
                                                    <select
                                                        value={row.status || ""}
                                                        onChange={(e) => updateRow(row._id, "status", e.target.value)}
                                                        className="w-full border rounded px-2 py-1"
                                                    >
                                                        <option value="">Select</option>
                                                        {statusOptions.map((opt) => (
                                                            <option key={opt} value={opt}>
                                                                {opt}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                            )}

                                            {visibleColumns.includes("doingOrDrop") && (
                                                <td className="p-2 border">
                                                    <input
                                                        value={row.doingOrDrop || ""}
                                                        onChange={(e) =>
                                                            updateRow(row._id, "doingOrDrop", e.target.value)
                                                        }
                                                        className="w-full border rounded px-2 py-1"
                                                    />
                                                </td>
                                            )}

                                            {visibleColumns.includes("pageLink") && (
                                                <td className="p-2 border">
                                                    <input
                                                        value={row.pageLink || instagramLink}
                                                        onChange={(e) => updateRow(row._id, "pageLink", e.target.value)}
                                                        className="w-full border rounded px-2 py-1"
                                                    />
                                                </td>
                                            )}

                                            {visibleColumns.includes("rating") && (
                                                <td className="p-2 border">
                                                    <select
                                                        value={row.rating || ""}
                                                        onChange={(e) => updateRow(row._id, "rating", e.target.value)}
                                                        className="w-full border rounded px-2 py-1"
                                                    >
                                                        <option value="">Select</option>
                                                        {ratingOptions.map((opt) => (
                                                            <option key={opt} value={opt}>
                                                                {opt}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                            )}

                                            {visibleColumns.includes("activityLink") && (
                                                <td className="p-2 border">
                                                    <input
                                                        value={row.activityLink || ""}
                                                        onChange={(e) =>
                                                            updateRow(row._id, "activityLink", e.target.value)
                                                        }
                                                        className="w-full border rounded px-2 py-1"
                                                    />
                                                </td>
                                            )}

                                            {visibleColumns.includes("quotedBudget") && (
                                                <td className="p-2 border">
                                                    <input
                                                        value={row.quotedBudget || profile?.budget || ""}
                                                        onChange={(e) => {
                                                            const quotedBudget = e.target.value
                                                            const percent = Number(row.clientPercent || 0)
                                                            const calculatedBudget =
                                                                quotedBudget && percent
                                                                    ? Math.round((Number(quotedBudget) * percent) / 100) + Number(quotedBudget)
                                                                    : ""

                                                            setAddedInfluencers((prev: any[]) => {
                                                                const updated = prev.map((item) =>
                                                                    item._id?.toString() === row._id?.toString()
                                                                        ? {
                                                                            ...item,
                                                                            quotedBudget,
                                                                            budget: calculatedBudget
                                                                        }
                                                                        : item
                                                                )

                                                                const updatedRow = updated.find(
                                                                    (item) => item._id?.toString() === row._id?.toString()
                                                                )

                                                                if (updatedRow) {
                                                                    autoSaveRow(updatedRow)
                                                                }

                                                                return updated
                                                            })
                                                        }}
                                                        className="w-full border rounded px-2 py-1"
                                                    />
                                                </td>
                                            )}

                                            {visibleColumns.includes("clientPercent") && (
                                                <td className="p-2 border">
                                                    <select
                                                        value={row.clientPercent || ""}
                                                        onChange={(e) => {
                                                            const percent = Number(e.target.value)
                                                            const quoted = Number(row.quotedBudget || profile?.budget || 0)
                                                            const calculatedBudget =
                                                                quoted && percent
                                                                    ? Math.round((quoted * percent) / 100) + quoted
                                                                    : ""

                                                            setAddedInfluencers((prev: any[]) => {
                                                                const updated = prev.map((item) =>
                                                                    item._id?.toString() === row._id?.toString()
                                                                        ? {
                                                                            ...item,
                                                                            clientPercent: e.target.value,
                                                                            budget: calculatedBudget
                                                                        }
                                                                        : item
                                                                )

                                                                const updatedRow = updated.find(
                                                                    (item) => item._id?.toString() === row._id?.toString()
                                                                )

                                                                if (updatedRow) {
                                                                    autoSaveRow(updatedRow)
                                                                }

                                                                return updated
                                                            })
                                                        }}
                                                        className="w-full border rounded px-2 py-1"
                                                    >
                                                        <option value="">Select</option>
                                                        {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                                                            <option key={num} value={num}>
                                                                {num}%
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                            )}

                                            {visibleColumns.includes("influBudget") && (
                                                <td className="p-2 border">
                                                    <input
                                                        value={row.influBudget || profile?.negotiableBudget || ""}
                                                        onChange={(e) =>
                                                            updateRow(row._id, "influBudget", e.target.value)
                                                        }
                                                        className="w-full border rounded px-2 py-1"
                                                    />
                                                </td>
                                            )}

                                            {visibleColumns.includes("budget") && (
                                                <td className="p-2 border">
                                                    <input
                                                        value={row.budget || ""}
                                                        readOnly
                                                        className="w-full border rounded px-2 py-1 bg-gray-50"
                                                    />
                                                </td>
                                            )}

                                            {visibleColumns.includes("paymentStatus") && (
                                                <td className="p-2 border">
                                                    <select
                                                        value={row.paymentStatus || ""}
                                                        onChange={(e) =>
                                                            updateRow(row._id, "paymentStatus", e.target.value)
                                                        }
                                                        className="w-full border rounded px-2 py-1"
                                                    >
                                                        <option value="">Select</option>
                                                        {paymentStatusOptions.map((opt) => (
                                                            <option key={opt} value={opt}>
                                                                {opt}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                            )}

                                            {visibleColumns.includes("dateOfPayment") && (
                                                <td className="p-2 border">
                                                    <input
                                                        type="date"
                                                        value={row.dateOfPayment || ""}
                                                        onChange={(e) =>
                                                            updateRow(row._id, "dateOfPayment", e.target.value)
                                                        }
                                                        className="w-full border rounded px-2 py-1"
                                                    />
                                                </td>
                                            )}

                                            {visibleColumns.includes("amountPaid") && (
                                                <td className="p-2 border">
                                                    <input
                                                        value={row.amountPaid || ""}
                                                        onChange={(e) =>
                                                            updateRow(row._id, "amountPaid", e.target.value)
                                                        }
                                                        className="w-full border rounded px-2 py-1"
                                                    />
                                                </td>
                                            )}

                                            {visibleColumns.includes("reach") && (
                                                <td className="p-2 border">
                                                    <input
                                                        value={row.reach || ""}
                                                        onChange={(e) => updateRow(row._id, "reach", e.target.value)}
                                                        className="w-full border rounded px-2 py-1"
                                                    />
                                                </td>
                                            )}

                                            {visibleColumns.includes("likes") && (
                                                <td className="p-2 border">
                                                    <input
                                                        value={row.likes || ""}
                                                        onChange={(e) => updateRow(row._id, "likes", e.target.value)}
                                                        className="w-full border rounded px-2 py-1"
                                                    />
                                                </td>
                                            )}

                                            {visibleColumns.includes("shares") && (
                                                <td className="p-2 border">
                                                    <input
                                                        value={row.shares || ""}
                                                        onChange={(e) => updateRow(row._id, "shares", e.target.value)}
                                                        className="w-full border rounded px-2 py-1"
                                                    />
                                                </td>
                                            )}

                                            {visibleColumns.includes("remarks") && (
                                                <td className="p-2 border">
                                                    <input
                                                        value={row.remarks || ""}
                                                        onChange={(e) => updateRow(row._id, "remarks", e.target.value)}
                                                        className="w-full border rounded px-2 py-1"
                                                    />
                                                </td>
                                            )}

                                            {visibleColumns.includes("actions") && (
                                                <td className="p-2 border">
                                                    <div className="flex gap-2">
                                                        {row.isReplaced && (
                                                            <button
                                                                onClick={() => restoreInfluencer(row)}
                                                                className="px-3 py-1 rounded border text-blue-600 text-xs hover:bg-blue-50"
                                                            >
                                                                Restore
                                                            </button>
                                                        )}

                                                        {!row.isReplaced && !row.isManualEntry && row.influencerId && (
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => openReplaceModal(row)}
                                                                    className="px-3 py-1 rounded border text-xs hover:bg-gray-50"
                                                                >
                                                                    Replace
                                                                </button>
                                                            </div>
                                                        )}

                                                        <button
                                                            onClick={() => removeRow(row)}
                                                            className="px-3 py-1 rounded border text-red-600 text-xs hover:bg-red-50"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {showReplaceModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-[700px] max-h-[80vh] overflow-hidden shadow-xl">
                        <div className="p-5 border-b flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Replace Influencer</h2>
                            <button
                                onClick={() => {
                                    setShowReplaceModal(false)
                                    setReplaceTarget(null)
                                }}
                                className="text-gray-500 hover:text-black"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-5">
                            <input
                                value={replaceSearch}
                                onChange={(e) => setReplaceSearch(e.target.value)}
                                placeholder="Search influencer"
                                className="w-full border rounded-lg px-3 py-2 mb-4"
                            />

                            <div className="space-y-3 max-h-[55vh] overflow-auto">
                                {influencers
                                    .filter((inf: any) =>
                                        inf.influencerName
                                            ?.toLowerCase()
                                            .includes(replaceSearch.toLowerCase())
                                    )
                                    .map((inf: any) => (
                                        <div
                                            key={inf._id}
                                            className="border rounded-lg p-3 flex items-center justify-between"
                                        >
                                            <div>
                                                <div className="font-medium">{inf.influencerName}</div>
                                                <div className="text-sm text-gray-500">
                                                    {Array.isArray(inf.category)
                                                        ? inf.category.join(", ")
                                                        : inf.category || "-"}{" "}
                                                    • {inf.location || "-"}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => replaceInfluencer(inf._id)}
                                                disabled={
                                                    inf._id?.toString() === replaceTarget?.influencerId?.toString() ||
                                                    isInfluencerInCampaign(inf._id)
                                                }
                                                className={`px-4 py-2 rounded-lg text-sm ${inf._id?.toString() === replaceTarget?.influencerId?.toString()
                                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    : isInfluencerInCampaign(inf._id)
                                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                        : "bg-black text-white hover:bg-gray-800"
                                                    }`}
                                            >
                                                {inf._id?.toString() === replaceTarget?.influencerId?.toString()
                                                    ? "Current Influencer"
                                                    : isInfluencerInCampaign(inf._id)
                                                        ? "Already in Campaign"
                                                        : "Replace"}
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showExportModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-[600px] shadow-xl">
                        <div className="p-5 border-b flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Select Fields for Excel</h2>
                            <button
                                onClick={() => setShowExportModal(false)}
                                className="text-gray-500 hover:text-black"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-5 grid grid-cols-2 gap-3 max-h-[60vh] overflow-auto">
                            {exportFieldOptions.map((field) => (
                                <label key={field.key} className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={exportFields.includes(field.key)}
                                        onChange={() => toggleExportField(field.key)}
                                    />
                                    {field.label}
                                </label>
                            ))}
                        </div>

                        <div className="p-5 border-t flex justify-end gap-3">
                            <button
                                onClick={() => setShowExportModal(false)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={exportExcel}
                                className="px-4 py-2 bg-black text-white rounded-lg"
                            >
                                Download Excel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showTimelineModal && timelineTarget && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-[700px] max-h-[80vh] overflow-hidden shadow-xl">
                        <div className="p-5 border-b flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Replacement Timeline</h2>
                            <button
                                onClick={() => {
                                    setShowTimelineModal(false)
                                    setTimelineTarget(null)
                                }}
                                className="text-gray-500 hover:text-black"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-5 space-y-4 max-h-[65vh] overflow-auto">
                            {buildReplacementChain(timelineTarget).length > 0 ? (
                                buildReplacementChain(timelineTarget).map((log: any, index: number) => (
                                    <div
                                        key={index}
                                        className="border-l-2 border-blue-500 pl-4 py-2"
                                    >
                                        <div className="font-medium text-sm">
                                            {log.fromName} → {log.toName}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {new Date(log.replacedAt).toLocaleString()}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            By: {log.staff || "Unknown"}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500">No replacement history</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {showColumnModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-[500px] shadow-xl">
                        <div className="p-5 border-b flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Choose Table Columns</h2>
                            <button
                                onClick={() => setShowColumnModal(false)}
                                className="text-gray-500 hover:text-black"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-5 grid grid-cols-2 gap-3 max-h-[60vh] overflow-auto">
                            {columnOptions.map((col) => (
                                <label key={col.key} className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={visibleColumns.includes(col.key)}
                                        onChange={() => toggleColumn(col.key)}
                                    />
                                    {col.label}
                                </label>
                            ))}
                        </div>

                        <div className="p-5 border-t flex justify-end gap-3">
                            <button
                                onClick={() => setVisibleColumns(columnOptions.map((c) => c.key))}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Select All
                            </button>

                            <button
                                onClick={() => {
                                    localStorage.setItem(
                                        "campaign-visible-columns",
                                        JSON.stringify(visibleColumns)
                                    )
                                    setShowColumnModal(false)
                                }}
                                className="px-4 py-2 bg-black text-white rounded-lg"
                            >
                                Done
                            </button>
                            <button
                                onClick={() => {
                                    const defaultColumns = [
                                        "sno",
                                        "city",
                                        "influencer",
                                        "followers",
                                        "contactNumber",
                                        "status",
                                        "quotedBudget",
                                        "clientPercent",
                                        "influBudget",
                                        "budget",
                                        "paymentStatus",
                                        "actions"
                                    ]

                                    setVisibleColumns(defaultColumns)
                                    localStorage.setItem(
                                        "campaign-visible-columns",
                                        JSON.stringify(defaultColumns)
                                    )
                                }}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Reset Default
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showHistoryModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[85vh] overflow-hidden shadow-2xl">

                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b bg-white flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Campaign Activity Timeline
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Full edit history from campaign start to latest update
                                </p>
                            </div>

                            <button
                                onClick={() => setShowHistoryModal(false)}
                                className="w-9 h-9 rounded-full border flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="overflow-y-auto max-h-[calc(85vh-88px)] px-6 py-6 bg-gray-50">
                            {historyLoading ? (
                                <div className="text-sm text-gray-500">Loading history...</div>
                            ) : campaignHistory.length === 0 ? (
                                <div className="bg-white border rounded-xl p-6 text-sm text-gray-500">
                                    No campaign activity found.
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {groupHistoryByInfluencer(campaignHistory).map((group, groupIndex) => (
                                        <div
                                            key={groupIndex}
                                            className="bg-white border rounded-2xl shadow-sm overflow-hidden"
                                        >
                                            {/* Group Header */}
                                            <div className="px-5 py-4 border-b bg-gray-50 flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-base font-semibold text-gray-900">
                                                        {group.influencerName}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {group.items.length} activity
                                                        {group.items.length > 1 ? " entries" : " entry"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Group Timeline */}
                                            <div className="p-5">
                                                <div className="relative">
                                                    <div className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-gray-200" />

                                                    <div className="space-y-5">
                                                        {group.items.map((log: any, index: number) => {
                                                            const styles = getActionStyles(log.action)

                                                            return (
                                                                <div key={index} className="relative pl-12">
                                                                    <div
                                                                        className={`absolute left-0 top-2 w-8 h-8 rounded-full border-4 border-white shadow ${styles.dot}`}
                                                                    />

                                                                    <div className="border rounded-2xl p-4 bg-white">
                                                                        <div className="flex items-start justify-between gap-4">
                                                                            <div>
                                                                                <div className="flex items-center gap-3 flex-wrap">
                                                                                    <span
                                                                                        className={`text-xs font-medium px-3 py-1 rounded-full ${styles.badge}`}
                                                                                    >
                                                                                        {styles.label}
                                                                                    </span>

                                                                                    <span className="text-sm font-medium text-gray-800">
                                                                                        {log.staff || "Unknown"}
                                                                                    </span>
                                                                                </div>

                                                                                <div className="mt-2 text-sm text-gray-700">
                                                                                    {log.action === "edit" && (
                                                                                        <>
                                                                                            Updated{" "}
                                                                                            <span className="font-semibold">
                                                                                                {fieldLabels[log.field] || log.field}
                                                                                            </span>
                                                                                        </>
                                                                                    )}

                                                                                    {log.action === "add" && <>Added to campaign</>}

                                                                                    {log.action === "replace" && (
                                                                                        <>Replaced influencer</>
                                                                                    )}

                                                                                    {log.action === "remove" && (
                                                                                        <>Removed from campaign</>
                                                                                    )}

                                                                                    {log.action === "restore" && (
                                                                                        <>Restored to campaign</>
                                                                                    )}
                                                                                </div>
                                                                            </div>

                                                                            <div className="text-xs text-gray-500 whitespace-nowrap">
                                                                                {new Date(
                                                                                    log.createdAt || log.editedAt
                                                                                ).toLocaleString()}
                                                                            </div>
                                                                        </div>

                                                                        {(log.field ||
                                                                            log.oldValue !== undefined ||
                                                                            log.newValue !== undefined) && (
                                                                                <div className="mt-4 grid md:grid-cols-2 gap-3">
                                                                                    {log.field && (
                                                                                        <div className="bg-gray-50 rounded-xl p-3">
                                                                                            <div className="text-xs text-gray-500 mb-1">
                                                                                                Field
                                                                                            </div>
                                                                                            <div className="text-sm font-medium text-gray-800">
                                                                                                {fieldLabels[log.field] || log.field}
                                                                                            </div>
                                                                                        </div>
                                                                                    )}

                                                                                    {log.oldValue !== undefined && (
                                                                                        <div className="rounded-xl border border-red-100 bg-red-50 p-3">
                                                                                            <div className="text-xs text-red-600 mb-1">
                                                                                                Old Value
                                                                                            </div>
                                                                                            <div className="text-sm text-gray-800 break-words">
                                                                                                {formatHistoryValue(log.oldValue)}
                                                                                            </div>
                                                                                        </div>
                                                                                    )}

                                                                                    {log.newValue !== undefined && (
                                                                                        <div className="rounded-xl border border-green-100 bg-green-50 p-3">
                                                                                            <div className="text-xs text-green-600 mb-1">
                                                                                                New Value
                                                                                            </div>
                                                                                            <div className="text-sm text-gray-800 break-words">
                                                                                                {formatHistoryValue(log.newValue)}
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}