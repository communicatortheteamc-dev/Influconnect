'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, CheckCircle, Building, Target } from 'lucide-react';
import { services, indianStates } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function EnquiryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    district: '',
    services: [] as string[],
    message: '',
    influencerId: ''
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
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const error = await response.json();
        alert(error.message || 'Enquiry submission failed');
      }
    } catch (error) {
      console.error('Enquiry error:', error);
      alert('Enquiry submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center shadow-xl border-0">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-[#000631] mb-4">Enquiry Submitted Successfully!</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Thank you for your interest! Our team will review your requirements and get back to you within 24 hours with suitable influencer recommendations.
              </p>
              <Button asChild className="bg-[#EC6546] hover:bg-[#EC6546]/90">
                <a href="/">Return to Home</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-[#EC6546]/10 rounded-full px-4 py-2 mb-4">
            <MessageSquare className="w-5 h-5 text-[#EC6546]" />
            <span className="text-[#EC6546] font-semibold">Campaign Enquiry</span>
          </div>
          <h1 className="text-4xl font-bold text-[#000631] mb-4">Find Your Perfect Influencers</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tell us about your campaign requirements and we'll connect you with the most suitable influencers for your brand.
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-[#000631] to-[#EC6546] text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center space-x-2">
              <Building className="w-6 h-6" />
              <span>Campaign Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div>
                <h3 className="text-xl font-semibold text-[#000631] mb-4 border-b pb-2">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Company/Brand Name *</Label>
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
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select onValueChange={(value) => handleInputChange('state', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-6">
                  <Label htmlFor="district">District/City *</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    required
                    className="mt-1"
                    placeholder="Enter your district or city"
                  />
                </div>
              </div>

              {/* Services Required */}
              <div>
                <h3 className="text-xl font-semibold text-[#000631] mb-4 border-b pb-2 flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Services Required</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <div key={service} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <Checkbox
                        id={service}
                        checked={formData.services.includes(service)}
                        onCheckedChange={(checked) => handleServiceChange(service, checked as boolean)}
                      />
                      <label htmlFor={service} className="text-sm font-medium cursor-pointer flex-1">
                        {service}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Campaign Details */}
              <div>
                <h3 className="text-xl font-semibold text-[#000631] mb-4 border-b pb-2">
                  Campaign Details
                </h3>
                <div>
                  <Label htmlFor="message">Campaign Description</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={6}
                    className="mt-1"
                    placeholder="Tell us about your campaign objectives, target audience, budget range, timeline, and any specific requirements..."
                  />
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
                      Submitting...
                    </>
                  ) : (
                    'Submit Enquiry'
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