"use client";
import { useState, useMemo } from "react";

interface Client {
  _id: string;
  name: string;
  logo?: string;
  industry?: string;
  rating?: number;
}

export default function ClientsTable({ data }: { data: Client[] }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return data.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);
const [showPopup, setShowPopup] = useState(false);
const [newClient, setNewClient] = useState({ name: "", logo: "" });
const [adding, setAdding] = useState(false);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewClient((prev) => ({ ...prev, logo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }
};

const handleAddClient = async () => {
  if (!newClient.name || !newClient.logo) {
    alert("Please provide both name and logo");
    return;
  }
  setAdding(true);
  try {
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newClient.name,
        logo: newClient.logo,
        industry: "N/A",
        description: "N/A",
        rating: 0,
        testimonial: "N/A",
      }),
    });
    const data = await res.json();
    if (data.success) {
      alert("✅ Client added successfully!");
      setShowPopup(false);
      setNewClient({ name: "", logo: "" });
    } else {
      alert(`❌ ${data.error || "Failed to add client"}`);
    }
  } catch (err) {
    console.error("Error adding client:", err);
    alert("Something went wrong.");
  } finally {
    setAdding(false);
  }
};
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Clients</h2>
        <input
          type="text"
          placeholder="Search..."
          className="border rounded p-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
<button
  onClick={() => setShowPopup(true)}
  className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
>
  + Add Client
</button>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">Logo</th>
              <th className="p-2 border">Name</th>
              {/* <th className="p-2 border">Industry</th>
              <th className="p-2 border">Rating</th>
              <th className="p-2 border">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {filtered.map((client) => (
              <tr key={client._id} className="hover:bg-gray-50">
                <td className="p-2 border">
                  {client.logo ? (
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="p-2 border">{client.name}</td>
                {/* <td className="p-2 border">{client.industry}</td>
                <td className="p-2 border">{client.rating || "-"}</td>
                <td className="p-2 border">
                  <button className="bg-blue-600 text-white text-sm px-3 py-1 rounded">
                    Edit
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 p-3">No clients found.</p>
        )}
        {showPopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white p-6 rounded-lg w-80 shadow-lg">
      <h3 className="text-lg font-semibold mb-3">Add New Client</h3>

      <input
        type="text"
        placeholder="Client Name"
        className="border p-2 rounded w-full mb-3"
        value={newClient.name}
        onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
      />

      <input
        type="file"
        accept="image/*"
        className="border p-2 rounded w-full mb-3"
        onChange={handleFileChange}
      />

      {newClient.logo && (
        <img
          src={newClient.logo}
          alt="Preview"
          className="w-16 h-16 object-cover rounded mb-3 mx-auto"
        />
      )}

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowPopup(false)}
          className="px-3 py-1 border rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleAddClient}
          disabled={adding}
          className={`px-3 py-1 rounded text-white ${
            adding ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {adding ? "Adding..." : "Save"}
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}
