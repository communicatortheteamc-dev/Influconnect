"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Globe,
  Scan,
} from "lucide-react";

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
  "Spiritual",
];

const platforms = ["instagram", "youtube", "facebook", "twitter"];

type FiltersType = {
  search: string;
  category: string;
  platform: string;
  location: string;
  followers: string;
  language: string;
};

const defaultFilters: FiltersType = {
  search: "",
  category: "",
  platform: "",
  location: "",
  followers: "",
  language: "",
};

export default function InfluencersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const initialFilters = useMemo<FiltersType>(
    () => ({
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      platform: searchParams.get("platform") || "",
      location: searchParams.get("location") || "",
      followers: searchParams.get("followers") || "",
      language: searchParams.get("language") || "",
    }),
    [searchParams]
  );

  const initialPage = useMemo(() => {
    const pageParam = Number(searchParams.get("page") || "1");
    return Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  }, [searchParams]);

  const [filters, setFilters] = useState<FiltersType>(initialFilters);
  const [page, setPage] = useState<number>(initialPage);

  const currentListUrl = useMemo(() => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.platform) params.set("platform", filters.platform);
    if (filters.location) params.set("location", filters.location);
    if (filters.followers) params.set("followers", filters.followers);
    if (filters.language) params.set("language", filters.language);
    params.set("page", String(page));

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [filters, page, pathname]);

  const updateUrl = (nextFilters: FiltersType, nextPage: number) => {
    const params = new URLSearchParams();

    if (nextFilters.search) params.set("search", nextFilters.search);
    if (nextFilters.category) params.set("category", nextFilters.category);
    if (nextFilters.platform) params.set("platform", nextFilters.platform);
    if (nextFilters.location) params.set("location", nextFilters.location);
    if (nextFilters.followers) params.set("followers", nextFilters.followers);
    if (nextFilters.language) params.set("language", nextFilters.language);
    params.set("page", String(nextPage));

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const loadInfluencers = async (activeFilters = filters, activePage = page) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        ...activeFilters,
        page: String(activePage),
      });

      const res = await fetch(`/api/crm/influencers?${params.toString()}`, {
        cache: "no-store",
      });

      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to load influencers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/crm/me", {
      credentials: "include",
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => console.error("CRM user fetch error:", err));
  }, []);

  useEffect(() => {
    setFilters(initialFilters);
    setPage(initialPage);
  }, [initialFilters, initialPage]);

  useEffect(() => {
    updateUrl(filters, page);
    loadInfluencers(filters, page);
  }, [filters, page]);

  const handleFilterChange = (key: keyof FiltersType, value: string) => {
    const nextFilters = {
      ...filters,
      [key]: value,
    };

    setFilters(nextFilters);
    setPage(1);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
    router.replace(pathname, { scroll: false });
  };

  const addToFollowup = async (id: any) => {
    const res = await fetch("/api/crm/influencers/lock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        influencerId: id,
        staffId: user?.email,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to add to followup");
      return;
    }

    alert("Added to followup");
  };

  const getRelativeTime = (date: string) => {
    const now = new Date().getTime();
    const past = new Date(date).getTime();
    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Influencers</h1>

      <div className="bg-white p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
        <input
          placeholder="Search influencer"
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="border rounded p-2"
        />

        <select
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={filters.platform}
          onChange={(e) => handleFilterChange("platform", e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Platforms</option>
          {platforms.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <input
          placeholder="Location"
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          className="border rounded p-2"
        />

        <select
          value={filters.followers}
          onChange={(e) => handleFilterChange("followers", e.target.value)}
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
          onChange={(e) => handleFilterChange("language", e.target.value)}
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
          className="bg-gray-200 hover:bg-gray-300 rounded px-4 py-2"
        >
          Reset
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="space-y-3 p-3">
          {loading ? (
            <div className="p-6 text-sm text-gray-500">Loading...</div>
          ) : data?.influencers?.length > 0 ? (
            data.influencers.map((inf: any) => {
              const lastEdit =
                inf.editHistory?.length > 0
                  ? inf.editHistory[inf.editHistory.length - 1]
                  : null;

              const editHref = `/crm/influencers/${inf._id}?edit=true&returnTo=${encodeURIComponent(
                currentListUrl
              )}`;

              const viewHref = `/crm/influencers/${inf._id}?returnTo=${encodeURIComponent(
                currentListUrl
              )}`;

              return (
                <div
                  key={inf._id}
                  className="bg-white rounded-xl shadow-sm border p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <Image
                      src={inf.influencerImage || "/avatar.png"}
                      width={50}
                      height={50}
                      alt={inf.influencerName || "Influencer"}
                      className="rounded-full"
                    />

                    <div className="min-w-0">
                      <p className="font-semibold text-lg truncate">
                        {inf.influencerName}
                      </p>

                      <p className="text-sm text-gray-500">
                        {Array.isArray(inf.category)
                          ? inf.category.join(", ")
                          : inf.category || "-"}{" "}
                        • {inf.location || "Unknown"}
                      </p>

                      {lastEdit && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 flex-wrap">
                          <span className="text-blue-500">Last edited by</span>
                          <span className="font-medium text-gray-700">
                            {lastEdit.editedBy}
                          </span>
                          <span>• {getRelativeTime(lastEdit.date)}</span>
                        </div>
                      )}

                      <div className="flex gap-3 mt-2 flex-wrap">
                        {inf.platforms?.map((p: any) => {
                          const platform = p.name?.toLowerCase();
                          let Icon = Globe;

                          if (platform === "instagram") Icon = Instagram;
                          if (platform === "youtube") Icon = Youtube;
                          if (platform === "facebook") Icon = Facebook;
                          if (platform === "twitter" || platform === "x")
                            Icon = Twitter;
                          if (platform === "snapchat") Icon = Scan;

                          return (
                            <div
                              key={`${inf._id}-${p.name}-${p.profileName}`}
                              className="flex items-center gap-1 text-sm bg-gray-100 px-2 py-1 rounded-md"
                            >
                              <Icon size={16} />
                              <span>
                                {p.followers >= 1000000
                                  ? (p.followers / 1000000).toFixed(1) + "M"
                                  : p.followers >= 1000
                                  ? (p.followers / 1000).toFixed(0) + "K"
                                  : p.followers}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex flex-wrap gap-1 mt-1">
                        {inf.missingFields?.map((field: string) => (
                          <span
                            key={field}
                            className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded"
                          >
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-stretch lg:items-end gap-3 min-w-[180px]">
                    <div className="w-full">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Profile</span>
                        <span className="font-medium">
                          {inf.completionPercent}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ width: `${inf.completionPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
                      <button
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm"
                        onClick={() => addToFollowup(inf._id)}
                      >
                        Add to Followup
                      </button>

                      <Link
                        href={editHref}
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Edit
                      </Link>

                      <Link
                        href={viewHref}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-sm text-gray-500">No influencers found.</div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          className="border px-4 py-2 rounded disabled:opacity-40"
        >
          Previous
        </button>

        <span>
          Page {data?.page || page} / {data?.pages || 1}
        </span>

        <button
          disabled={loading || page >= (data?.pages || 1)}
          onClick={() =>
            setPage((prev) => Math.min(prev + 1, data?.pages || prev + 1))
          }
          className="border px-4 py-2 rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}