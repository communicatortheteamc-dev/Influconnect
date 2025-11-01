'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Instagram, Youtube, Facebook, Users, CheckCircle } from 'lucide-react';
import { categories, platforms } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import TermsPopup from '@/components/TermsPopup';
import emailjs from "emailjs-com";
type FormData = {
  name: string;
  email: string;
  phone: string;
  location: {
    city: string,
    town: string,
    district: string,
    zipcode: string
  },
  bio: string;
  category: string;
  photoUrl: string;
  videoUrl: string;
  socials: {
    instagram: { id: string; followers: number; link: string };
    youtube: { id: string; followers: number; link: string };
    facebook: { id: string; followers: number; link: string };
    tiktok: { id: string; followers: number; link: string };
  };
  termsAccepted: boolean;
  influencer_type: ""
  [key: string]: any; // ✅ allows dynamic access
};
export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: {
      city: "",
      town: "",
      district: "",
      zipcode: ""
    },
    bio: '',
    category: '',
    photoUrl: '',
    videoUrl: '',
    socials: {
      instagram: { id: '', followers: 0, link: '' },
      youtube: { id: '', followers: 0, link: '' },
      facebook: { id: '', followers: 0, link: '' },
      Snapchat: { id: '', followers: 0, link: '' }
    },
    budget: {
      rate_per_post: "",
      rate_per_reel: "",
      rate_per_story: "",
      rate_per_collaboration: ""
    },
    influencer_type: {
      youtube: "",
      facebook: "",
      instagram: "",
      Snapchat: "",
    },
    termsAccepted: false,

  });

  // const handleInputChange = (field: string, value: any) => {
  //   if (field.includes('.')) {
  //     const [parent, child, subChild] = field.split('.');
  //     setFormData(prev => ({
  //       ...prev,
  //       [parent]: {
  //         ...prev[parent as keyof typeof prev],
  //         [child]: {
  //           ...(prev[parent as keyof typeof prev] as any)[child],
  //           [subChild]: value
  //         }
  //       }
  //     }));
  //   } else {
  //     setFormData(prev => ({
  //       ...prev,
  //       [field]: value
  //     }));
  //   }
  // };
  // const handleInputChange = (field: string, value: any) => {
  //   if (field.includes(".")) {
  //     const keys = field.split("."); // e.g. ["socials", "instagram", "id"]

  //     setFormData((prev) => {
  //       const updated = { ...prev } as any;
  //       let current = updated;

  //       // Walk down the keys until the last one
  //       for (let i = 0; i < keys.length - 1; i++) {
  //         const key = keys[i];
  //         current[key] = { ...current[key] }; // copy each nested object
  //         current = current[key];
  //       }

  //       // Set the final value
  //       current[keys[keys.length - 1]] = value;

  //       return updated;
  //     });
  //   } else {
  //     setFormData((prev) => ({
  //       ...prev,
  //       [field]: value,
  //     }));
  //   }
  // };
  // const handleInputChange = (field: string, value: any) => {
  //   if (field.includes(".")) {
  //     const keys = field.split("."); // e.g. ["socials", "instagram", "id"]

  //     setFormData((prev) => {
  //       const updated = { ...prev } as any;
  //       let current = updated;

  //       for (let i = 0; i < keys.length - 1; i++) {
  //         const key = keys[i];
  //         current[key] = { ...current[key] };
  //         current = current[key];
  //       }

  //       current[keys[keys.length - 1]] = value;
  //       return updated;
  //     });
  //   } else {
  //     setFormData((prev) => {
  //       const updated = { ...prev, [field]: value };

  //       // Remove old fields if updating photoUrl or videoUrl
  //       if (field === "photoUrl" && "photo" in updated) delete updated.photo;
  //       if (field === "videoUrl" && "video" in updated) delete updated.video;

  //       return updated;
  //     });
  //   }
  // };
  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const keys = field.split("."); // e.g. ["socials", "instagram", "followers"]

      setFormData((prev) => {
        const updated = { ...prev } as any;
        let current = updated;

        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          current[key] = { ...current[key] };
          current = current[key];
        }

        current[keys[keys.length - 1]] = value;

        // --- NEW: Update influencer_type if followers changed ---
        if (keys[keys.length - 1] === "followers") {
          const social = keys[1]; // instagram / youtube / facebook / tiktok
          const followers = value;
          let type: "mega" | "micro" | "nano" = "nano";

          if (followers >= 100_000) type = "mega";
          else if (followers >= 10_000) type = "micro";
          else type = "nano";

          updated.influencer_type = {
            ...updated.influencer_type,
            [social]: type,
          };
        }

        return updated;
      });
    } else {
      setFormData((prev) => {
        const updated = { ...prev, [field]: value };

        // Remove old fields if updating photoUrl or videoUrl
        if (field === "photoUrl" && "photo" in updated) delete updated.photo;
        if (field === "videoUrl" && "video" in updated) delete updated.video;

        return updated;
      });
    }
  };

  // const handleFileUpload = async (file: File, type: 'photo' | 'video') => {
  //   // Simulated Cloudinary upload - replace with actual implementation
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('upload_preset', 'influencer_uploads');

  //   try {
  //     // This is a placeholder URL - replace with actual Cloudinary upload
  //     const mockUrl = `https://res.cloudinary.com/demo/image/upload/v1/${Date.now()}_${file.name}`;
  //     // "https://res.cloudinary.com/dzfnaks6l/image/upload/v1757491983/vub1gjvbk1a2aylnxxcw.png"

  //     if (type === 'photo') {
  //       handleInputChange('photoUrl', mockUrl);
  //     } else {
  //       handleInputChange('videoUrl', mockUrl);
  //     }
  //   } catch (error) {
  //     console.error('Upload failed:', error);
  //   }
  // };
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File, type: "photo" | "video") => {
    // 👇 Show instant preview before uploading
    const previewURL = URL.createObjectURL(file);
    setPhotoPreview(previewURL);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "influencer_uploads"); // Cloudinary preset

    try {
      setIsUploading(true);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        }/${type === "photo" ? "image" : "video"}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setIsUploading(false);

      if (data.secure_url) {
        if (type === "photo") {
          handleInputChange("photoUrl", data.secure_url);
          setPhotoPreview(data.secure_url); // replace preview with actual Cloudinary image
        } else {
          handleInputChange("videoUrl", data.secure_url);
        }
      } else {
        console.error("Cloudinary upload error:", data);
        alert("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      alert('Please accept the terms and conditions');
      return;
    }
    if (!formData.category || !formData.photoUrl || !formData.budget.rate_per_collaboration || !formData.budget.rate_per_post || !formData.budget.rate_per_reel || !formData.budget.rate_per_story || !formData.location.city) {
      alert('Please fill all required fields');
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/influencers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsSuccess(true);
        await emailjs.send(
          "service_8la2lyx",
          "template_0pf8kw1",
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
          "RI6ijkt2WR-Mgd9sj"
        );
      } else {
        const error = await response.json();
        alert(error.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const [isOpenTermsPopup, setIsOpenTermsPopup] = useState(false)
  const handleCloseTermsPopup = () => {
    setIsOpenTermsPopup(false)
  }
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center shadow-xl border-0">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-[#000631] mb-4">Registration Successful!</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Thank you for joining InfluConnect! Your profile has been submitted for review.
                We'll get back to you within 24-48 hours.
              </p>
              <Button asChild className="bg-[#EC6546] hover:bg-[#EC6546]/90">
                <a href="/">Return to Home</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-[#EC6546]/10 rounded-full px-4 py-2 mb-4">
            <Users className="w-5 h-5 text-[#EC6546]" />
            <span className="text-[#EC6546] font-semibold">Join Our Network</span>
          </div>
          <h1 className="text-4xl font-bold text-[#000631] mb-4"></h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to monetize your influence? Join thousands of creators who trust InfluConnect
            to connect them with leading brands.
          </p>
        </div>
        <div></div>
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-[#000631] to-[#EC6546] text-white rounded-t-lg">
            <CardTitle className="text-2xl">Create Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-semibold text-[#000631] mb-4 border-b pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Page Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  {/* <div>
                    <Label htmlFor="location">Budget *</Label>
                    <Input
                      id="location"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      required
                      className="mt-1"
                      placeholder="budget"
                    />
                  </div> */}

                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    {/* <Budget className="w-6 h-6 text-red-500" /> */}
                    <h4 className="font-semibold">Budget</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Rate Per Post</Label>
                      <Input
                        type="number"
                        value={formData.budget.rate_per_post}
                        onChange={(e) => handleInputChange('budget.rate_per_post', e.target.value)}
                        className="mt-1"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Rate Per Reel</Label>
                      <Input
                        type="number"
                        value={formData.budget.rate_per_reel || 0}
                        onChange={(e) => handleInputChange('budget.rate_per_reel', (e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Rate Per Story</Label>
                      <Input
                        type="number"
                        value={formData.budget.rate_per_story}
                        onChange={(e) => handleInputChange('budget.rate_per_story', e.target.value)}
                        placeholder="0"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Rate Per Collaboration</Label>
                      <Input
                        type="number"
                        value={formData.budget.rate_per_collaboration}
                        onChange={(e) => handleInputChange('budget.rate_per_collaboration', e.target.value)}
                        placeholder="0"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6 mt-4">
                  <div className="flex items-center space-x-2 mb-4">
                    {/* <Instagram className="w-6 h-6 text-pink-500" /> */}
                    <h4 className="font-semibold">Location</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Town</Label>
                      <Input
                        value={formData.location.town}
                        onChange={(e) => handleInputChange('location.town', e.target.value)}
                        placeholder="Town"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>City</Label>
                      <Input
                        type="text"
                        value={formData.location.city}
                        onChange={(e) => handleInputChange('location.city', e.target.value)}
                        placeholder="City"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>District</Label>
                      <Input
                        value={formData.location.district}
                        onChange={(e) => handleInputChange('location.district', e.target.value)}
                        placeholder="District"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Zipcode</Label>
                      <Input
                        value={formData.location.zipcode}
                        onChange={(e) => handleInputChange('location.zipcode', e.target.value)}
                        placeholder="Zipcode"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Label htmlFor="category">Category *</Label>
                  <Select onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your niche" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-6">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="mt-1"
                    placeholder="Tell us about yourself and your content style..."
                  />
                </div>
              </div>

              {/* Media Upload */}
              <div>
                <h3 className="text-xl font-semibold text-[#000631] mb-4 border-b pb-2">
                  Profile Media
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Profile Photo *</Label>

                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#EC6546] transition-colors relative">
                      {/* 👇 Show preview if selected */}
                      {photoPreview ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={photoPreview}
                            alt="Profile Preview"
                            className=" object-cover  border-2 border-[#EC6546] mb-3"
                          />

                          {isUploading ? (
                            <p className="text-sm text-gray-500">Uploading...</p>
                          ) : (
                            <>
                              {/* 👇 Hidden input for changing photo */}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  e.target.files?.[0] &&
                                  handleFileUpload(e.target.files[0], "photo")
                                }
                                className="hidden"
                                id="photo-upload"
                              />

                              <label
                                htmlFor="photo-upload"
                                className="inline-block mt-2 px-4 py-2 bg-[#EC6546] text-white rounded-lg cursor-pointer hover:bg-[#EC6546]/90"
                              >
                                Change Photo
                              </label>
                            </>
                          )}
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Upload your best photo</p>

                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              e.target.files?.[0] &&
                              handleFileUpload(e.target.files[0], "photo")
                            }
                            className="hidden"
                            id="photo-upload"
                          />

                          <label
                            htmlFor="photo-upload"
                            className="inline-block mt-2 px-4 py-2 bg-[#EC6546] text-white rounded-lg cursor-pointer hover:bg-[#EC6546]/90"
                          >
                            Choose File
                          </label>
                        </>
                      )}


                    </div>
                  </div>
                </div>
              </div>
              {/* <div>
                    <Label>Intro Video (Optional)</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#EC6546] transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Upload a short intro video</p>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'video')}
                        className="hidden"
                        id="video-upload"
                      />
                      <label
                        htmlFor="video-upload"
                        className="inline-block mt-2 px-4 py-2 bg-[#EC6546] text-white rounded-lg cursor-pointer hover:bg-[#EC6546]/90"
                      >
                        Choose File
                      </label>
                    </div>
                  </div> */}


              {/* Social Media*/}
              <div>
                <h3 className="text-xl font-semibold text-[#000631] mb-4 border-b pb-2">
                  Social Media Profiles
                </h3>
                <div className="space-y-6">
                  {/* Instagram */}

                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Instagram className="w-6 h-6 text-pink-500" />
                      <h4 className="font-semibold">Instagram</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Username</Label>
                        <Input
                          value={formData.socials.instagram.id}
                          onChange={(e) => handleInputChange('socials.instagram.id', e.target.value)}
                          placeholder="@username"
                          className="mt-1"
                        />
                      </div>
                      <div>

                        <Label>Followers</Label>


                        <Input
                          type="number"
                          value={formData.socials.instagram.followers || 0}
                          onChange={(e) => handleInputChange('socials.instagram.followers', parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                        {formData.socials.instagram.followers > 0 &&
                          <p className="mt-1 text-sm bg-orange-100 mt-1 rounded-lg p-1">
                            Type: <span className="font-semibold capitalize">{formData.influencer_type.instagram}</span>
                          </p>
                        }

                      </div>
                      <div>
                        <Label>Profile Link</Label>
                        <Input
                          value={formData.socials.instagram.link}
                          onChange={(e) => handleInputChange('socials.instagram.link', e.target.value)}
                          placeholder="https://instagram.com/username"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* YouTube */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Youtube className="w-6 h-6 text-red-500" />
                      <h4 className="font-semibold">YouTube</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Channel Name</Label>
                        <Input
                          value={formData.socials.youtube.id}
                          onChange={(e) => handleInputChange('socials.youtube.id', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        {/* <div className="flex flex-col"> */}
                        <Label>Subscribers</Label>


                        {/* </div> */}

                        <Input
                          type="number"
                          value={formData.socials.youtube.followers || 0}
                          onChange={(e) => handleInputChange('socials.youtube.followers', parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                        {formData.socials.youtube.followers > 0 && (
                          <p className="mt-1 text-sm bg-orange-100 mt-1 rounded-lg p-1">
                            Type: <span className="font-semibold capitalize">{formData.influencer_type.youtube}</span>
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Channel Link</Label>
                        <Input
                          value={formData.socials.youtube.link}
                          onChange={(e) => handleInputChange('socials.youtube.link', e.target.value)}
                          placeholder="https://youtube.com/channel/..."
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Facebook */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Facebook className="w-6 h-6 text-red-500" />
                      <h4 className="font-semibold">Facebook</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Facebook Id</Label>
                        <Input
                          value={formData.socials.facebook.id}
                          onChange={(e) => handleInputChange('socials.facebook.id', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Followers</Label>


                        <Input
                          type="number"
                          value={formData.socials.facebook.followers || 0}
                          onChange={(e) => handleInputChange('socials.facebook.followers', parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                        {formData.socials.facebook.followers > 0 &&
                          <p className="mt-1 text-sm bg-orange-100 mt-1 rounded-lg p-1">
                            Type: <span className="font-semibold capitalize">{formData.influencer_type.facebook}</span>
                          </p>
                        }
                      </div>
                      <div>
                        <Label>Facebook Link</Label>
                        <Input
                          value={formData.socials.facebook.link}
                          onChange={(e) => handleInputChange('socials.facebook.link', e.target.value)}
                          placeholder="https://facebook.com/..."
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      {/* <Chat className="w-6 h-6 text-red-500" /> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-6 h-6 text-yellow-400"
                      >
                        <path d="M12 2c-1.38 0-2.5 1.12-2.5 2.5S10.62 7 12 7s2.5-1.12 2.5-2.5S13.38 2 12 2z" />
                        <path d="M8 9c-1.1 0-2 .9-2 2v7a2 2 0 002 2h8a2 2 0 002-2v-7c0-1.1-.9-2-2-2H8z" />
                      </svg>
                      <h4 className="font-semibold">Snapchat</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Snapchat Id</Label>
                        <Input
                          value={formData.socials.facebook.id}
                          onChange={(e) => handleInputChange('socials.Snapchat.id', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Followers</Label>
                        <Input
                          type="number"
                          value={formData.socials.Snapchat.followers || 0}
                          onChange={(e) => handleInputChange('socials.Snapchat.followers', parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                        {formData.socials.Snapchat.followers > 0 &&
                          <p className="mt-1 text-sm bg-orange-100 mt-1 rounded-lg p-1">
                            Type: <span className="font-semibold capitalize">{formData.influencer_type.Snapchat}</span>
                          </p>
                        }
                      </div>
                      <div>
                        <Label>Snapchat Link</Label>
                        <Input
                          value={formData.socials.Snapchat.link}
                          onChange={(e) => handleInputChange('socials.Snapchat.link', e.target.value)}
                          placeholder="https://Snapchat.com/..."
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start space-x-3">
                  {/* <Checkbox
                    id="terms"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) => handleInputChange('termsAccepted', checked)}
                  /> */}
                  <button onClick={() => setIsOpenTermsPopup(true)}>Terms & Conditions</button>
                  <TermsPopup isOpen={isOpenTermsPopup} onClose={handleCloseTermsPopup} onAccept={(value: any) => handleInputChange('termsAccepted', value)} />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#EC6546] hover:bg-[#EC6546]/90 px-12 py-3 text-lg font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner className="w-5 h-5 mr-2" />
                      Registering...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}