'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MessageCircle, CheckCircle } from 'lucide-react';
import { services } from '@/lib/utils';
import { Influencer } from '@/types';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ContactModalProps {
  influencer: Influencer;
  onClose: () => void;
}

export function ContactModal({ influencer, onClose }: ContactModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    services: [] as string[],
    budget: '',
    message: '',
    influencerId: influencer._id
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: checked 
        ? [...prev.services, service]
        : prev.services.filter(s => s !== service)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.services.length === 0) {
      alert('Please select at least one service');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          message: `${formData.message}\n\nInterested in collaborating with: ${influencer.name}\nBudget Range: ${formData.budget}`
        })
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact error:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-[#000631] mb-2">Message Sent!</h3>
            <p className="text-gray-600 mb-6">
              Your message has been sent to {influencer.name}. They will get back to you soon!
            </p>
            <Button onClick={onClose} className="bg-[#EC6546] hover:bg-[#EC6546]/90">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#000631] flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>Contact {influencer.name}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
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
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="company">Company/Brand</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Your company name"
              />
            </div>
          </div>

          {/* Budget Range */}
          <div>
            <Label htmlFor="budget">Budget Range</Label>
            <Select onValueChange={(value) => handleInputChange('budget', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-10k">Under ₹10,000</SelectItem>
                <SelectItem value="10k-25k">₹10,000 - ₹25,000</SelectItem>
                <SelectItem value="25k-50k">₹25,000 - ₹50,000</SelectItem>
                <SelectItem value="50k-100k">₹50,000 - ₹1,00,000</SelectItem>
                <SelectItem value="100k-250k">₹1,00,000 - ₹2,50,000</SelectItem>
                <SelectItem value="250k-500k">₹2,50,000 - ₹5,00,000</SelectItem>
                <SelectItem value="500k-plus">₹5,00,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Services Required */}
          <div>
            <Label className="text-base font-semibold">Services Required *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {services.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={service}
                    checked={formData.services.includes(service)}
                    onCheckedChange={(checked) => handleServiceChange(service, checked as boolean)}
                  />
                  <label htmlFor={service} className="text-sm font-medium cursor-pointer">
                    {service}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={4}
              placeholder="Tell us about your campaign, timeline, and specific requirements..."
              required
            />
          </div>

          {/* Influencer Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-[#000631] mb-2">Collaboration Details</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Influencer:</strong> {influencer.name}</p>
              <p><strong>Category:</strong> {influencer.category}</p>
              <p><strong>Total Reach:</strong> {influencer.totalFollowers?.toLocaleString()} followers</p>
              <p><strong>Location:</strong> {influencer.location.city}</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
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
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}