'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Save, Upload } from 'lucide-react';
import { categories } from '@/lib/utils';
import { Influencer } from '@/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface EditInfluencerModalProps {
  influencer: Influencer;
  onClose: () => void;
  onUpdate: (data: Partial<Influencer>) => void;
}

export function EditInfluencerModal({ influencer, onClose, onUpdate }: EditInfluencerModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: influencer.name,
    email: influencer.email,
    phone: influencer.phone,
    location: influencer.location,
    bio: influencer.bio || '',
    category: influencer.category,
    photoUrl: influencer.photoUrl,
    videoUrl: influencer.videoUrl || '',
    socials: {
      instagram: {
        id: influencer.socials?.instagram?.id || '',
        followers: influencer.socials?.instagram?.followers || 0,
        link: influencer.socials?.instagram?.link || ''
      },
      youtube: {
        id: influencer.socials?.youtube?.id || '',
        followers: influencer.socials?.youtube?.followers || 0,
        link: influencer.socials?.youtube?.link || ''
      },
      facebook: {
        id: influencer.socials?.facebook?.id || '',
        followers: influencer.socials?.facebook?.followers || 0,
        link: influencer.socials?.facebook?.link || ''
      },
      tiktok: {
        id: influencer.socials?.tiktok?.id || '',
        followers: influencer.socials?.tiktok?.followers || 0,
        link: influencer.socials?.tiktok?.link || ''
      }
    }
  });

//   const handleInputChange = (field: string, value: any) => {
//     if (field.includes('.')) {
//       const [parent, child, subChild] = field.split('.');
//       setFormData(prev => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent as keyof typeof prev],
//           [child]: {
//             ...(prev[parent as keyof typeof prev] as any)[child],
//             [subChild]: value
//           }
//         }
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [field]: value
//       }));
//     }
//   };
const handleInputChange = (field: string, value: any) => {
  if (field.includes(".")) {
    const [parent, child, subChild] = field.split(".");

    setFormData(prev => {
      const parentObj = prev[parent as keyof typeof prev] as Record<string, any>;

      return {
        ...prev,
        [parent]: {
          ...parentObj,
          [child]: {
            ...(parentObj?.[child] || {}),
            [subChild]: value,
          },
        },
      };
    });
  } else {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }
};

  const handleFileUpload = async (file: File, type: 'photo' | 'video') => {
    // Simulated Cloudinary upload - replace with actual implementation
    const mockUrl = `https://res.cloudinary.com/demo/${type === 'photo' ? 'image' : 'video'}/upload/v1/${Date.now()}_${file.name}`;
    
    if (type === 'photo') {
      handleInputChange('photoUrl', mockUrl);
    } else {
      handleInputChange('videoUrl', mockUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Calculate total followers
      let totalFollowers = 0;
      Object.values(formData.socials).forEach((social: any) => {
        if (social.followers) {
          totalFollowers += social.followers;
        }
      });

      const updateData = {
        ...formData,
        totalFollowers
      };

      // In a real app, you'd make an API call here
      // const response = await fetch(`/api/influencers/${influencer._id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updateData)
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onUpdate(updateData);
      onClose();
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#000631]">Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-[#000631] mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location.city}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => handleInputChange('category', value)} value={formData.category}>
                <SelectTrigger>
                  <SelectValue />
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
            <div className="mt-4">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          {/* Media Upload */}
          <div>
            <h3 className="text-lg font-semibold text-[#000631] mb-4">Profile Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Profile Photo</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {formData.photoUrl && (
                    <img src={formData.photoUrl} alt="Profile" className="w-20 h-20 object-cover rounded-full mx-auto mb-2" />
                  )}
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'photo')}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="inline-block px-4 py-2 bg-[#EC6546] text-white rounded-lg cursor-pointer hover:bg-[#EC6546]/90"
                  >
                    Upload Photo
                  </label>
                </div>
              </div>
              <div>
                <Label>Intro Video (Optional)</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'video')}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="inline-block px-4 py-2 bg-[#EC6546] text-white rounded-lg cursor-pointer hover:bg-[#EC6546]/90"
                  >
                    Upload Video
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-[#000631] mb-4">Social Media</h3>
            <div className="space-y-4">
              {/* Instagram */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Instagram</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>Username</Label>
                    <Input
                      value={formData.socials.instagram.id}
                      onChange={(e) => handleInputChange('socials.instagram.id', e.target.value)}
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <Label>Followers</Label>
                    <Input
                      type="number"
                      value={formData.socials.instagram.followers}
                      onChange={(e) => handleInputChange('socials.instagram.followers', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Profile Link</Label>
                    <Input
                      value={formData.socials.instagram.link}
                      onChange={(e) => handleInputChange('socials.instagram.link', e.target.value)}
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                </div>
              </div>

              {/* YouTube */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">YouTube</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>Channel Name</Label>
                    <Input
                      value={formData.socials.youtube.id}
                      onChange={(e) => handleInputChange('socials.youtube.id', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Subscribers</Label>
                    <Input
                      type="number"
                      value={formData.socials.youtube.followers}
                      onChange={(e) => handleInputChange('socials.youtube.followers', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label>Channel Link</Label>
                    <Input
                      value={formData.socials.youtube.link}
                      onChange={(e) => handleInputChange('socials.youtube.link', e.target.value)}
                      placeholder="https://youtube.com/channel/..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#EC6546] hover:bg-[#EC6546]/90"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner className="w-4 h-4 mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}