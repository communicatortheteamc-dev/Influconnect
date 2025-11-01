"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { utils, writeFile } from "xlsx";
import { IndianRupee, ChevronDown, ChevronUp } from "lucide-react";
import { FilterParams } from "@/types";

interface Influencer {
  _id: string;
  name: string;
  email: string;
  category?: string;
  totalFollowers?: number;
  location?: { city?: string };
  photoUrl?: string;
  influencerId?: string;
  phone?: string;
  campaigns?: { campaignCode: string; title: string; budget: number; status: string }[];
}

interface Pagination {
  total: number;
  totalPages: number;
}

interface Client {
  _id: string;
  name: string;
}

interface Campaign {
  _id: string;
  title: string;
  campaignCode: string;
  clientId: string;
  influencerId?: string;
  status: string;
  budget: number;
  createdAt?: string;
  startDate?: string;
  influencers: {
    influencerId: string;
    name: string;
    email: string;
    phone: string;
    status: string;
  }[];
}

interface Props {
  fetchInfluencers: (params: FilterParams) => Promise<void>;
  influencers: Influencer[];
  pagination: Pagination;
  loading: boolean;
  campaigns: Campaign[];
  clients: Client[];
}

export default function InfluencersTable({
  fetchInfluencers,
  influencers,
  pagination,
  loading,
  campaigns,
  clients,
}: Props) {
  const [filters, setFilters] = useState<any>({ q: "", page: 1, limit: 100 });
  const [activeClient, setActiveClient] = useState<string>("all");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchInfluencers(filters);
  }, [fetchInfluencers, filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, q: e.target.value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev: any) => ({ ...prev, page }));
  };

  // ✅ API-based Excel download
  // const handleDownloadExcel = useCallback(async () => {
  //   try {
  //     const res = await fetch("/api/export");
  //     const blob = await res.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = "influencers_data.xlsx";
  //     a.click();
  //   } catch (err) {
  //     console.error("Error exporting data:", err);
  //   }
  // }, []);
    const mergedClientInfluencers = useMemo(() => {
    const clientMap: Record<string, any[]> = {};
    campaigns.forEach((camp) => {
      const clientId = camp.clientId;
      if (!clientMap[clientId]) clientMap[clientId] = [];
      camp.influencers?.forEach((inf) => {
        const existing = clientMap[clientId].find(
          (i) => i.influencerId === inf.influencerId
        );
        const campaignData = {
          campaignCode: camp.campaignCode,
          title: camp.title,
          budget: camp.budget,
          status: camp.status,
        };
        if (existing) {
          existing.campaigns.push(campaignData);
        } else {
          clientMap[clientId].push({
            influencerId: inf.influencerId,
            name: inf.name,
            email: inf.email,
            phone: inf.phone,
            status: inf.status,
            campaigns: [campaignData],
          });
        }
      });
    });
    return clientMap;
  }, [campaigns]);
   const latestCampaignDataMap = useMemo(() => {
    const map = new Map<string, { status: string; budget: number; createdAt: Date }>();
    campaigns.forEach((c) => {
      const influencerId = c.influencerId?.toString();
      if (!influencerId) return;
      const currentDate = new Date(c.createdAt || c.startDate || 0);
      const existing = map.get(influencerId);
      if (!existing || currentDate > existing.createdAt) {
        map.set(influencerId, {
          status: c.status || "No Status",
          budget: c.budget || 0,
          createdAt: currentDate,
        });
      }
    });
    const plainObject: Record<string, { status: string; budget: number }> = {};
    map.forEach((value, key) => {
      plainObject[key] = { status: value.status, budget: value.budget };
    });
    return plainObject;
  }, [campaigns]);
  const filteredInfluencers = useMemo(() => {
    if (activeClient === "all") return influencers;
    const all = mergedClientInfluencers[activeClient] || [];
    if (!selectedCampaign) return all;
    return all.filter((inf) =>
      inf.campaigns.some((c: any) => c.campaignCode === selectedCampaign)
    );
  }, [activeClient, selectedCampaign, mergedClientInfluencers, influencers]);
const handleDownloadExcel = useCallback(() => {
  try {
    let dataToExport: any[] = [];

    if (activeClient === "all") {
      // All influencers
      dataToExport = influencers.map((inf) => ({
        Name: inf.name,
        Email: inf.email,
        Category: inf.category || "",
        Followers: inf.totalFollowers || "",
        City: inf.location?.city || "",
        Status: latestCampaignDataMap[inf._id]?.status || "No Campaign",
        Budget: latestCampaignDataMap[inf._id]?.budget || 0,
      }));
    } else {
      // Client-specific
      dataToExport = filteredInfluencers.map((inf: any) => {
        // If selectedCampaign, filter campaigns
        const campaignsToInclude = selectedCampaign
          ? inf.campaigns.filter((c: any) => c.campaignCode === selectedCampaign)
          : inf.campaigns;

        return campaignsToInclude.map((c: any) => ({
          Name: inf.name,
          Email: inf.email,
          Phone: inf.phone,
          CampaignCode: c.campaignCode,
          CampaignTitle: c.title,
          Budget: c.budget,
          Status: c.status,
        }));
      }).flat();
    }

    const worksheet = utils.json_to_sheet(dataToExport);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Influencers");
    writeFile(workbook, "influencers_data.xlsx");
  } catch (err) {
    console.error("Error exporting Excel:", err);
  }
}, [activeClient, influencers, filteredInfluencers, latestCampaignDataMap, selectedCampaign]);
  // ✅ Latest campaign per influencer
 

  // ✅ Merge influencers per client




  const toggleExpand = (infId: string) => {
    setExpandedRows((prev) => ({ ...prev, [infId]: !prev[infId] }));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      {/* Tabs */}
      <div className="flex flex-wrap border-b mb-4">
        <button
          onClick={() => {
            setActiveClient("all");
            setSelectedCampaign("");
          }}
          className={`px-4 py-2 text-sm font-medium ${
            activeClient === "all"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          All Influencers
        </button>
        {clients.map((client) => (
          <button
            key={client._id}
            onClick={() => {
              setActiveClient(client._id);
              setSelectedCampaign("");
            }}
            className={`px-4 py-2 text-sm font-medium ${
              activeClient === client._id
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {client.name}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Influencers</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded p-2 text-sm"
            value={filters.q || ""}
            onChange={handleSearchChange}
          />
          <button
            onClick={handleDownloadExcel}
            className="bg-green-600 text-white px-3 py-2 rounded text-sm"
          >
            Download Excel
          </button>
        </div>
      </div>

      {activeClient !== "all" && (
       <div className="flex justify-end mb-4">
  <select
    className="border rounded p-2 text-sm"
    value={selectedCampaign}
    onChange={(e) => setSelectedCampaign(e.target.value)}
  >
    <option value="">All Campaigns</option>
    {Array.from(new Set(
      campaigns
        .filter((c) => c.clientId === activeClient)
        .map((c) => c.campaignCode)
    )).map((code) => (
      <option key={code} value={code}>
        {code}
      </option>
    ))}
  </select>
</div>

      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-800"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      ) : filteredInfluencers.length === 0 ? (
        <p className="text-center text-gray-500 p-3">No influencers found.</p>
      ) : activeClient === "all" ? (
        // All Influencers Table
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 border">Photo</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Followers</th>
                <th className="p-2 border">City</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Budget</th>
              </tr>
            </thead>
            <tbody>
              {influencers.map((inf) => (
                <tr key={inf._id} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    {inf.photoUrl ? (
                      <img
                        src={inf.photoUrl}
                        alt={inf.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-2 border">{inf.name}</td>
                  <td className="p-2 border">{inf.email}</td>
                  <td className="p-2 border">{inf.category}</td>
                  <td className="p-2 border">
                    {inf.totalFollowers?.toLocaleString() || "-"}
                  </td>
                  <td className="p-2 border">{inf.location?.city || "-"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        latestCampaignDataMap[inf._id]?.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : latestCampaignDataMap[inf._id]?.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {latestCampaignDataMap[inf._id]?.status || "No Campaign"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800 flex items-center gap-1">
                    {latestCampaignDataMap[inf._id]?.budget && (
                      <IndianRupee className="w-4 h-4" />
                    )}
                    {latestCampaignDataMap[inf._id]?.budget
                      ? latestCampaignDataMap[inf._id].budget.toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-end items-center gap-2 mt-4">
            {Array.from({ length: pagination.totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded ${
                  filters.page === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Client-specific influencers (with subtable)
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Campaign</th>
                <th className="p-2 border">Budget</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInfluencers.map((inf: any) => {
                const hasMultiple = inf.campaigns.length > 1;
                const expanded = expandedRows[inf.influencerId];
                const latest = inf.campaigns[inf.campaigns.length - 1];
                return (
                  <React.Fragment key={inf.influencerId}>
                    <tr className="hover:bg-gray-50">
                      <td className="p-2 border flex items-center gap-1">
                        {hasMultiple && (
                          <button
                            onClick={() => toggleExpand(inf.influencerId)}
                            className="text-gray-600 hover:text-black"
                          >
                            {expanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        )}
                        {inf.name}
                      </td>
                      <td className="p-2 border">{inf.email}</td>
                      <td className="p-2 border">{inf.phone}</td>
                      <td className="p-2 border">{latest.campaignCode}</td>
                      <td className="p-2 border flex items-center gap-1 font-semibold">
                        <IndianRupee className="w-4 h-4" />
                        {latest.budget}
                      </td>
                      <td className="p-2 border">
                        
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            inf.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : inf.status === "In Progress"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {inf.status}
                        </span>
                      </td>
                    </tr>
                    {expanded && hasMultiple && (
                      <tr>
                        <td colSpan={6} className="bg-gray-50 border-t">
                          <div className="p-3">
                            <table className="w-full text-xs border">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="p-2 border">Campaign Code</th>
                                  <th className="p-2 border">Title</th>
                                  <th className="p-2 border">Budget</th>
                                  <th className="p-2 border">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {inf.campaigns.map((c: any, i: number) => (
                                  <tr key={i}>
                                    <td className="p-2 border">{c.campaignCode}</td>
                                    <td className="p-2 border">{c.title}</td>
                                    <td className="p-2 border">{c.budget}</td>
                                    <td className="p-2 border">{c.status}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
