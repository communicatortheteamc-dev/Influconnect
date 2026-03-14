"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import CampaignForm from "@/components/CampaignForm";
import ClientsTable from "@/components/ClientsTable";
import InfluencersTable from "@/components/InfluencersTable";
import InsightsGraph from "@/components/InsightsGraph";
import { FilterParams } from "@/types";

export default function DashboardPage() {
    const [influencers, setInfluencers] = useState([]);
    const [clients, setClients] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("campaigns");
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem("staffUser");
        if (!user) router.push("/login");
    }, []);

    const fetchInfluencers = useCallback(async (params: FilterParams) => {
        setLoading(true);
        try {
            const searchParams = new URLSearchParams();
            if (params.q) searchParams.append("q", params.q);
            if (params.category) searchParams.append("category", params.category);
            if (params.location) searchParams.append("location", params.location);
            if (params.page) searchParams.append("page", params.page.toString());
            if (params.limit) searchParams.append("limit", params.limit.toString());

            const res = await fetch(`/api/influencers?${searchParams.toString()}`);
            const data = await res.json();

            setInfluencers(data.data || []);
            setPagination({
                total: data.total || 0,
                totalPages: data.totalPages || 0,
            });
        } catch (err) {
            console.error("Error fetching influencers:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCampaigns = useCallback(async () => {
        try {
            const res = await fetch("/api/campaigns");
            const data = await res.json();
            if (data) setCampaigns(data.data);
        } catch (err) {
            console.error("Error fetching campaigns:", err);
        }
    }, []);

    const fetchClients = useCallback(async () => {
        try {
            const res = await fetch("/api/clients");
            const data = await res.json();
            if (data) setClients(data.data);
        } catch (err) {
            console.error("Error fetching clients:", err);
        }
    }, []);

    useEffect(() => {
        fetchCampaigns();
        fetchInfluencers({ page: 1, limit: 1000 });
        fetchClients();
    }, []);
   useEffect(() => {
        fetchCampaigns();
        fetchInfluencers({ page: 1, limit: 1000 });
        fetchClients();
    }, [activeTab]);
    return (
        <div className="p-6 space-y-6 mt-16">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold">Staff Dashboard</h1>
                <button
                    onClick={() => {
                        localStorage.removeItem("staffUser");
                        router.push("/login");
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-100 p-4 rounded-xl shadow">
                    Influencers: {influencers.length}
                </div>
                <div className="bg-green-100 p-4 rounded-xl shadow">
                    Clients: {clients.length}
                </div>
                <div className="bg-yellow-100 p-4 rounded-xl shadow">
                    Campaigns: {campaigns.length}
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex flex-wrap border-b border-gray-300 mt-6">
                {[
                    { key: "campaigns", label: "Campaigns" },
                    { key: "influencers", label: "Influencers" },
                    { key: "clients", label: "Clients" },
                    { key: "insights", label: "Insights" },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-6 py-3 text-sm font-medium transition-all ${activeTab === tab.key
                                ? "border-b-2 border-blue-500 text-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === "influencers" && (
                    <InfluencersTable
                        fetchInfluencers={fetchInfluencers}
                        influencers={influencers}
                        pagination={pagination}
                        loading={loading}
                        campaigns={campaigns}
                        clients={clients}  // ✅ add this
                    />
                )}

                {activeTab === "clients" && <ClientsTable data={clients} />}

                {activeTab === "campaigns" && (
                    <CampaignForm clients={clients} influencers={influencers} />
                )}

                {activeTab === "insights" && <InsightsGraph campaigns={campaigns} />}
            </div>
        </div>
    );
}
