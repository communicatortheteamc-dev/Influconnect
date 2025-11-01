
'use client'
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import toast from "react-hot-toast";

// ---- main Page component ----
export default function Page() {
    const [form, setForm] = useState<any>({
        pageName: '',
        phoneNumber: '',
        email: '',
        instagram: { username: '', followers: '', profileLink: '', budget: {} },
        facebook: { username: '', followers: '', profileLink: '', budget: {} },
        snapchat: { username: '', followers: '', profileLink: '', budget: {} },
        twitter: { username: '', followers: '', profileLink: '', budget: {} },
        threads: { username: '', followers: '', profileLink: '', budget: {} },
    });

    function updatePath(path: string, value: any) {
        setForm((prev: any) => {
            const copy = structuredClone(prev); // simpler and faster than JSON
            const keys = path.split('.');
            let cur: any = copy;
            for (let i = 0; i < keys.length - 1; i++) {
                cur = cur[keys[i]] = cur[keys[i]] || {};
            }
            cur[keys[keys.length - 1]] = value;
            return copy;
        });
    }

    // rest of your handleSave + handleDownload stay unchanged
async function handleSave(e: React.FormEvent) {
  e.preventDefault();
  try {
    if (!form.pageName || form.pageName.trim() === '') {
      toast.error('Please provide Page Name');
      return;
    }

    const payload = {
      ...form,
      instagram: {
        ...form.instagram,
        followers: Number(form.instagram.followers),
        budget: {
          costPerPost: Number(form.instagram.budget?.costPerPost || 0),
          costPerReel: Number(form.instagram.budget?.costPerReel || 0),
          costPerStory: Number(form.instagram.budget?.costPerStory || 0),
          costPerCollaboration: Number(form.instagram.budget?.costPerCollaboration || 0),
        },
      },
      facebook: {
        ...form.facebook,
        followers: Number(form.facebook.followers),
        budget: {
          costPerPost: Number(form.facebook.budget?.costPerPost || 0),
          costPerReel: Number(form.facebook.budget?.costPerReel || 0),
          costPerStory: Number(form.facebook.budget?.costPerStory || 0),
          costPerCollaboration: Number(form.facebook.budget?.costPerCollaboration || 0),
        },
      },
      snapchat: {
        ...form.snapchat,
        followers: Number(form.snapchat.followers),
        budget: {
          costPerPost: Number(form.snapchat.budget?.costPerPost || 0),
          costPerReel: Number(form.snapchat.budget?.costPerReel || 0),
          costPerStory: Number(form.snapchat.budget?.costPerStory || 0),
          costPerCollaboration: Number(form.snapchat.budget?.costPerCollaboration || 0),
        },
      },
      twitter: {
        ...form.twitter,
        followers: Number(form.twitter.followers),
        budget: {
          costPerPost: Number(form.twitter.budget?.costPerPost || 0),
          costPerReel: Number(form.twitter.budget?.costPerReel || 0),
          costPerStory: Number(form.twitter.budget?.costPerStory || 0),
          costPerCollaboration: Number(form.twitter.budget?.costPerCollaboration || 0),
        },
      },
      threads: {
        ...form.threads,
        followers: Number(form.threads.followers),
        budget: {
          costPerPost: Number(form.threads.budget?.costPerPost || 0),
          costPerReel: Number(form.threads.budget?.costPerReel || 0),
          costPerStory: Number(form.threads.budget?.costPerStory || 0),
          costPerCollaboration: Number(form.threads.budget?.costPerCollaboration || 0),
        },
      },
    };

    // ✅ Save to 'registerdata' collection
    const res = await fetch('/api/registerdata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success('Saved successfully in registerdata');
      setForm({
        pageName: '',
        phoneNumber: '',
        email: '',
        instagram: { username: '', followers: '', profileLink: '', budget: {} },
        facebook: { username: '', followers: '', profileLink: '', budget: {} },
        snapchat: { username: '', followers: '', profileLink: '', budget: {} },
        twitter: { username: '', followers: '', profileLink: '', budget: {} },
        threads: { username: '', followers: '', profileLink: '', budget: {} },
      });
    } else {
      const errData = await res.json();
      toast.error(errData.error || 'Save failed');
    }
  } catch (err: any) {
    console.error(err);
    toast.error(err.message || 'Error saving');
  }
}

async function handleDownload() {
  try {
    toast.loading('Preparing download...');
    const res = await fetch('/api/registerexport');
    if (!res.ok) throw new Error('Export failed');

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registerexport.xlsx'; // ✅ renamed file properly
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    toast.dismiss();
    toast.success('Download started');
  } catch (err: any) {
    toast.dismiss();
    console.error(err);
    toast.error(err.message || 'Export failed');
  }
}

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <Toaster position="top-right" />
            <div className="max-w-4xl mx-auto bg-gradient-to-b from-white to-gray-50 rounded-lg p-6 shadow">
                <h1 className="text-2xl font-bold mb-4">Influencer Registration</h1>

                <form>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2">
                            <label className="block text-sm">Page Name *</label>
                            <input value={form.pageName} onChange={(e) => setForm((s: any) => ({ ...s, pageName: e.target.value }))} className="w-full border p-2 rounded mt-1" />
                        </div>
                        <div>
                            <label className="block text-sm">Phone Number</label>
                            <input type="tel" value={form.phoneNumber} onChange={(e) => setForm((s: any) => ({ ...s, phoneNumber: e.target.value }))} className="w-full border p-2 rounded mt-1" />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm">Email Address</label>
                            <input type="email" value={form.email} onChange={(e) => setForm((s: any) => ({ ...s, email: e.target.value }))} className="w-full border p-2 rounded mt-1" />
                        </div>
                        <div className="md:col-span-3">
                            <PlatformCard name="Instagram" statePath="instagram" form={form} updatePath={updatePath} />
                            <PlatformCard name="Facebook" statePath="facebook" form={form} updatePath={updatePath} />
                            <PlatformCard name="Snapchat" statePath="snapchat" form={form} updatePath={updatePath} />
                            <PlatformCard name="Twitter (X)" statePath="twitter" form={form} updatePath={updatePath} />
                            <PlatformCard name="Threads" statePath="threads" form={form} updatePath={updatePath} />
                        </div>
                        <div className="md:col-span-3 flex gap-3 pt-4">
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" onClick={(e) => handleSave(e)}>Save</button>
                            <button type="button" onClick={() => handleDownload()} className="px-4 py-2 bg-green-600 text-white rounded">Download Excel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}



// ---- helper to safely read nested props ----
function get(obj: any, path: string) {
    try {
        return path.split('.').reduce((a, b) => (a ? a[b] : undefined), obj);
    } catch {
        return undefined;
    }
}

// ---- reusable PlatformCard component ----
function PlatformCard({
    name,
    statePath,
    form,
    updatePath,
}: {
    name: string;
    statePath: string;
    form: any;
    updatePath: (path: string, value: any) => void;
}) {
    const [open, setOpen] = useState(true);

    return (
        <div className="mb-4 bg-white rounded-lg shadow-sm p-4">
            <div
                className="cursor-pointer font-semibold flex justify-between items-center"
                onClick={() => setOpen(!open)}
            >
                <span>{name}</span>
                <span>{open ? '▲' : '▼'}</span>
            </div>

            {open && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm">Username</label>
                        <input
                            value={get(form, `${statePath}.username`) || ''}
                            onChange={(e) => updatePath(`${statePath}.username`, e.target.value)}
                            className="w-full border p-2 rounded mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm">Followers</label>
                        <input
                            type="number"
                            value={get(form, `${statePath}.followers`) || ''}
                            onChange={(e) => updatePath(`${statePath}.followers`, e.target.value)}
                            className="w-full border p-2 rounded mt-1"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm">Profile Link</label>
                        <input
                            value={get(form, `${statePath}.profileLink`) || ''}
                            onChange={(e) => updatePath(`${statePath}.profileLink`, e.target.value)}
                            className="w-full border p-2 rounded mt-1"
                        />
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm">Cost per Post</label>
                            <input
                                type="number"
                                value={get(form, `${statePath}.budget.costPerPost`) || ''}
                                onChange={(e) =>
                                    updatePath(`${statePath}.budget.costPerPost`, e.target.value)
                                }
                                className="w-full border p-2 rounded mt-1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm">Cost per Reel</label>
                            <input
                                type="number"
                                value={get(form, `${statePath}.budget.costPerReel`) || ''}
                                onChange={(e) =>
                                    updatePath(`${statePath}.budget.costPerReel`, e.target.value)
                                }
                                className="w-full border p-2 rounded mt-1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm">Cost per Story</label>
                            <input
                                type="number"
                                value={get(form, `${statePath}.budget.costPerStory`) || ''}
                                onChange={(e) =>
                                    updatePath(`${statePath}.budget.costPerStory`, e.target.value)
                                }
                                className="w-full border p-2 rounded mt-1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm">Cost per Collaboration</label>
                            <input
                                type="number"
                                value={get(form, `${statePath}.budget.costPerCollaboration`) || ''}
                                onChange={(e) =>
                                    updatePath(
                                        `${statePath}.budget.costPerCollaboration`,
                                        e.target.value
                                    )
                                }
                                className="w-full border p-2 rounded mt-1"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
