'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock, CheckCircle, MessageCircle } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import emailjs from "emailjs-com";
export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

   const handleClose = () => {
  // Example: reset form + hide modal
  setFormData({ name: "", email: "", phone: "",  subject: '',message: '' });
  setIsSuccess(true);
  setIsSubmitting(false);

};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
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

    setIsSuccess(true);
    handleClose(); // close/reset after success
  } catch (error) {
    console.error("Contact form error:", error);
    alert("Message sending failed ❌. Please try again.");
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
              <h2 className="text-3xl font-bold text-[#000631] mb-4">Message Sent Successfully!</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Thank you for reaching out to us! We've received your message and will get back to you within 24 hours.
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-[#EC6546]/10 rounded-full px-4 py-2 mb-4">
            <MessageCircle className="w-5 h-5 text-[#EC6546]" />
            <span className="text-[#EC6546] font-semibold">Get in Touch</span>
          </div>
          <h1 className="text-4xl font-bold text-[#000631] mb-4">Contact InflueConnect</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about our platform? Need help with your campaign? We're here to assist you every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#000631] mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-[#EC6546]/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[#EC6546]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#000631]">Email</h4>
                      <p className="text-gray-600">influconnectbytheteamc@gmail.com</p>
                      {/* <p className="text-gray-600">support@influeconnect.com</p> */}
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-[#EC6546]/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-[#EC6546]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#000631]">Phone</h4>
                      <p className="text-gray-600">+91 9642426444</p>
                      {/* <p className="text-gray-600">+91 9876543211</p> */}
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-[#EC6546]/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#EC6546]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#000631]">Address</h4>
                      <p className="text-gray-600">
                        5th floor, Monya Exotica, Rd.Number 10,<br />
                        Kakatiya Hills, Madhapur, Hyderabad,<br />
                        Telangana - 500033
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    {/* <div className="w-10 h-10 bg-[#EC6546]/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#EC6546]" />
                    </div> */}
                    {/* <div>
                      <h4 className="font-semibold text-[#000631]">Business Hours</h4>
                      <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                    </div> */}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-[#000631] to-[#EC6546] text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Response</h3>
                <p className="text-white/90 mb-4">
                  Need immediate assistance? Our support team typically responds within 2-4 hours during business hours.
                </p>
                <Button variant="secondary" className="w-full">
                  Chat with Support
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-[#000631] to-[#EC6546] text-white rounded-t-lg">
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
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
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      required
                      rows={6}
                      className="mt-1"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#EC6546] hover:bg-[#EC6546]/90 px-12 py-3 text-lg font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner className="w-5 h-5 mr-2" />
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}