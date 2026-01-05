'use client'
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import toast from "react-hot-toast";

/* ✅ CATEGORY OPTIONS */
const PROFILE_CATEGORIES = [
  'Fashion',
  'Beauty',
  'Technology',
  'Fitness',
  'Travel',
  'Food',
  'Education',
  'Finance',
  'Gaming',
  'Entertainment',
  'Lifestyle',
];

export default function Page() {
  const [form, setForm] = useState<any>({
    pageName: '',
    category: '',
    phoneNumber: '',
    email: '',
    location: '',
    instagram: { username: '', followers: '', profileLink: '', frequency: '', rating: '', influBudget: '', budget: {} },
    facebook: { username: '', followers: '', profileLink: '', frequency: '', rating: '', influBudget: '', budget: {} },
    snapchat: { username: '', followers: '', profileLink: '', frequency: '', rating: '', influBudget: '', budget: {} },
    twitter: { username: '', followers: '', profileLink: '', frequency: '', rating: '', influBudget: '', budget: {} },
    threads: { username: '', followers: '', profileLink: '', frequency: '', rating: '', influBudget: '', budget: {} },
  });

  function updatePath(path: string, value: any) {
    setForm((prev: any) => {
      const copy = structuredClone(prev);
      const keys = path.split('.');
      let cur: any = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        cur = cur[keys[i]] = cur[keys[i]] || {};
      }
      cur[keys[keys.length - 1]] = value;
      return copy;
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!form.pageName.trim()) return toast.error("Page Name required");
    if (!form.category) return toast.error("Category required");

    const normalize = (p: any) => ({
      ...p,
      followers: Number(p.followers || 0),
      influBudget: Number(p.influBudget || 0),
      budget: {
        costPerPost: Number(p.budget?.costPerPost || 0),
        costPerReel: Number(p.budget?.costPerReel || 0),
        costPerStory: Number(p.budget?.costPerStory || 0),
        costPerCollaboration: Number(p.budget?.costPerCollaboration || 0),
      },
    });

    const payload = {
      ...form,
      instagram: normalize(form.instagram),
      facebook: normalize(form.facebook),
      snapchat: normalize(form.snapchat),
      twitter: normalize(form.twitter),
      threads: normalize(form.threads),
    };

    const res = await fetch('/api/registerdata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    res.ok ? toast.success("Saved") : toast.error("Save failed");
  }

  async function handleDownload() {
    const res = await fetch('/api/registerexport');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DIGITAL_DATA.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6">
      <Toaster />
      <div className="w-full max-w-4xl bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Influencer Registration</h1>

        <form className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="md:col-span-2">
            <label className="text-sm">Page Name *</label>
            <input className="border p-2 w-full"
              value={form.pageName}
              onChange={(e) => setForm((s:any)=>({...s,pageName:e.target.value}))}
            />
          </div>

          <div>
            <label className="text-sm">Category *</label>
            <select className="border p-2 w-full"
              value={form.category}
              onChange={(e)=>setForm((s:any)=>({...s,category:e.target.value}))}>
              <option value="">Select</option>
              {PROFILE_CATEGORIES.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm">Phone Number</label>
            <input className="border p-2 w-full"
              value={form.phoneNumber}
              onChange={(e)=>setForm((s:any)=>({...s,phoneNumber:e.target.value}))}
            />
          </div>

          <div>
            <label className="text-sm">Email</label>
            <input className="border p-2 w-full"
              value={form.email}
              onChange={(e)=>setForm((s:any)=>({...s,email:e.target.value}))}
            />
          </div>

          <div className="md:col-span-3">
            <label className="text-sm">Location</label>
            <input className="border p-2 w-full"
              value={form.location}
              onChange={(e)=>setForm((s:any)=>({...s,location:e.target.value}))}
            />
          </div>

          <div className="md:col-span-3">
            <PlatformCard name="Instagram" path="instagram" form={form} updatePath={updatePath}/>
            <PlatformCard name="Facebook" path="facebook" form={form} updatePath={updatePath}/>
            <PlatformCard name="Twitter" path="twitter" form={form} updatePath={updatePath}/>
            <PlatformCard name="Snapchat" path="snapchat" form={form} updatePath={updatePath}/>
            <PlatformCard name="Threads" path="threads" form={form} updatePath={updatePath}/>
          </div>

          <div className="md:col-span-3 flex gap-3 pt-4">
            <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
              Save
            </button>
            <button type="button" onClick={handleDownload} className="bg-green-600 text-white px-4 py-2 rounded">
              Download Excel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

/* ---------- Platform Card ---------- */
function PlatformCard({ name, path, form, updatePath }: any) {
  return (
    <div className="border rounded p-4 mb-4">
      <h3 className="font-semibold mb-2">{name}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input placeholder="Username" className="border p-2"
          value={form[path].username}
          onChange={(e)=>updatePath(`${path}.username`,e.target.value)}
        />
        <input type="number" placeholder="Followers" className="border p-2"
          value={form[path].followers}
          onChange={(e)=>updatePath(`${path}.followers`,e.target.value)}
        />
        <input placeholder="Profile Link" className="border p-2 md:col-span-2"
          value={form[path].profileLink}
          onChange={(e)=>updatePath(`${path}.profileLink`,e.target.value)}
        />
        <input type="number" placeholder="Quoted Budget" className="border p-2"
          onChange={(e)=>updatePath(`${path}.budget.costPerPost`,e.target.value)}
        />
        <input type="number" placeholder="Influ Budget" className="border p-2"
          value={form[path].influBudget}
          onChange={(e)=>updatePath(`${path}.influBudget`,e.target.value)}
        />
        <input placeholder="Rating" className="border p-2"
          value={form[path].rating}
          onChange={(e)=>updatePath(`${path}.rating`,e.target.value)}
        />
        <input placeholder="Frequency" className="border p-2"
          value={form[path].frequency}
          onChange={(e)=>updatePath(`${path}.frequency`,e.target.value)}
        />
      </div>
    </div>
  );
}
