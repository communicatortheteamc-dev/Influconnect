"use client";
import { useState } from "react";

export default function CampaignForm({ clients, influencers }: { clients: any[]; influencers: any[] }) {
  const [form, setForm] = useState({
    clientId: "",
    influencerIds: [] as string[],
    title: "",
    campaignCode: "",
    budget: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInfluencerToggle = (id: string) => {
    setForm((prev) => {
      const exists = prev.influencerIds.includes(id);
      const updated = exists
        ? prev.influencerIds.filter((x) => x !== id)
        : [...prev.influencerIds, id];
      return { ...prev, influencerIds: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.clientId ||
      form.influencerIds.length === 0 ||
      !form.title ||
      !form.startDate ||
      !form.endDate ||
      !form.budget ||
      !form.campaignCode
    ) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Campaign created successfully!");
        setForm({
          clientId: "",
          influencerIds: [],
          title: "",
          campaignCode: "",
          budget: "",
          startDate: "",
          endDate: "",
          description: "",
        });
      } else {
        alert(`❌ Error: ${data.error || "Failed to create campaign"}`);
      }
    } catch (err) {
      console.error("Error creating campaign:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
// Inside the component, above return
const [influencerSearch, setInfluencerSearch] = useState("");

// Filter influencers based on search input
const filteredInfluencers = influencers.filter((i) => {
  const search = influencerSearch.toLowerCase();
  return (
    i.name?.toLowerCase().includes(search) ||
    i.email?.toLowerCase().includes(search) ||
    i.category?.toLowerCase().includes(search) ||
    i.location?.city?.toLowerCase().includes(search) ||
    i.phone?.toLowerCase().includes(search)
  );
});
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-xl shadow space-y-3 border border-gray-200"
    >
      <h2 className="font-semibold text-lg text-gray-800">Create / Update Campaign</h2>

      <select
        value={form.clientId}
        onChange={(e) => setForm({ ...form, clientId: e.target.value })}
        className="border p-2 rounded w-full"
        required
      >
        <option value="">Select Client</option>
        {clients.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>
      {/* <div className="border p-3 rounded">
        <p className="font-medium mb-2">Select Influencers</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
          {influencers.map((i) => (
            <label key={i._id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.influencerIds.includes(i._id)}
                onChange={() => handleInfluencerToggle(i._id)}
              />
              {i.name}
            </label>
          ))}
        </div>
      </div> */}
<div className="border p-3 rounded">
  <p className="font-medium mb-2">Select Influencers</p>
  {/* Search input */}
  <input
    type="text"
    placeholder="Search Influencers..."
    value={influencerSearch}
    onChange={(e) => setInfluencerSearch(e.target.value)}
    className="border p-2 rounded w-full mb-2"
  />

  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
    {filteredInfluencers.map((i) => (
      <label key={i._id} className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.influencerIds.includes(i._id)}
          onChange={() => handleInfluencerToggle(i._id)}
        />
        {i.name}
      </label>
    ))}
  </div>
</div>
      <input
        type="text"
        placeholder="Campaign Code"
        className="border p-2 rounded w-full"
        value={form.campaignCode}
        onChange={(e) => setForm({ ...form, campaignCode: e.target.value })}
        required
      />

      <input
        type="text"
        placeholder="Campaign Title"
        className="border p-2 rounded w-full"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />

      <textarea
        placeholder="Campaign Description"
        className="border p-2 rounded w-full h-24"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        type="number"
        placeholder="Budget"
        className="border p-2 rounded w-full"
        value={form.budget}
        onChange={(e) => setForm({ ...form, budget: e.target.value })}
      />

      <div className="flex gap-2">
        <input
          type="date"
          className="border p-2 rounded w-full"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 rounded w-full"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-600 text-white px-4 py-2 rounded transition ${
          loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        {loading ? "Saving..." : "Save Campaign"}
      </button>
    </form>
  );
}
