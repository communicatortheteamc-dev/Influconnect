'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  MapPin,
  Instagram,
  Youtube,
  Facebook,
  Users,
  Mail,
  Phone,
  Edit3,
  CreditCard,
  Smartphone,
  Wallet,
  Star,
  Play,
  ExternalLink,
  MessageCircle,
  CheckCircle,
  ArrowLeft,
  LogIn,
  IndianRupee
} from 'lucide-react';
import { formatFollowers } from '@/lib/utils';
import { Influencer } from '@/types';
import Link from 'next/link';
// import { EditInfluencerModal } from '@/components/influencer/edit-influencer-modal';
// import { PaymentModal } from '@/components/influencer/payment-modal';
// import { ContactModal } from '@/components/influencer/contact-modal';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EditInfluencerModal } from '@/components/influencer/EditInfluencerModal';
import { ContactModal } from '@/components/influencer/ContactModal';
import { PaymentModal } from '@/components/influencer/PaymentModal';

export default function InfluencerDetailPage() {
  const params = useParams();
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const fetchInfluencer = async () => {
      try {
        const response = await fetch(`/api/influencers/${params.slug}`);
        if (!response.ok) {
          throw new Error('Influencer not found');
        }
        const data = await response.json();
        setInfluencer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load influencer');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchInfluencer();
    }
  }, [params.slug]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setLoginError('Please enter your email address');
      return;
    }

    setIsVerifying(true);
    setLoginError('');

    try {
      const response = await fetch('/api/verify-influencer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.trim(),
          slug: params.slug
        })
      });

      const data = await response.json();

      if (response.ok && data.verified) {
        setIsAuthenticated(true);
        setShowLoginModal(false);
        setLoginEmail('');
        setLoginError('');
      } else {
        setLoginError(data.message || 'Email verification failed. Please check your email address.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };
  const handleUpdateInfluencer = (updatedData: Partial<Influencer>) => {
    if (influencer) {
      setInfluencer({ ...influencer, ...updatedData });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96 w-full rounded-xl" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !influencer) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Influencer Not Found</h1>
          <p className="text-gray-600 mb-8">The influencer you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/influencers">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Influencers
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const socialPlatforms = [
    { key: 'instagram', icon: Instagram, color: 'text-pink-500', bgColor: 'bg-pink-50' },
    { key: 'youtube', icon: Youtube, color: 'text-red-500', bgColor: 'bg-red-50' },
    { key: 'facebook', icon: Facebook, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { key: 'tiktok', icon: Users, color: 'text-black', bgColor: 'bg-gray-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/influencers">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Influencers
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <Card className="overflow-hidden shadow-xl border-0">
              <div className="relative">
                {influencer.videoUrl ? (
                  <div className="relative aspect-video bg-black">
                    <video
                      src={influencer.videoUrl}
                      controls
                      className="w-full h-full object-cover"
                      poster={influencer.photoUrl}
                    />
                    <div className="absolute top-4 left-4 bg-[#EC6546] text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Play className="w-3 h-3" />
                      <span>Intro Video</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-84 bg-gray-200 flex items-center justify-center " >
                    <img
                      src={
                        influencer.photoUrl ||
                        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800'
                      }
                      alt={influencer.name}
                      className="max-h-full max-w-full object-contain "
                    />
                    <div className="absolute top-4 left-4 bg-[#EC6546] text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>Top Influencer</span>
                    </div>
                  </div>
                )}

                {/* Overlay Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2">{influencer.name}</h1>
                      <div className="flex items-center space-x-4 text-white/90">
                        <Badge className="bg-[#EC6546] hover:bg-[#EC6546]/90">
                          {influencer.category}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{influencer.location.city}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        {formatFollowers(influencer.totalFollowers || 0)}
                      </div>
                      <div className="text-white/80 text-sm">Total Followers</div>
                    </div>
                  </div>
                </div>

                {/* Edit Button - Only for own profile */}
                {!isAuthenticated ? (
                  <Button
                    onClick={() => setShowLoginModal(true)}
                    className="absolute top-4 right-4 bg-white/90 text-[#000631] hover:bg-white"
                    size="sm"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login to Edit
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowEditModal(true)}
                    className="absolute top-4 right-4 bg-white/90 text-[#000631] hover:bg-white"
                    size="sm"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </Card>

            {/* Bio Section */}
            {influencer.bio && (
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-[#000631] mb-4">About</h2>
                  <p className="text-gray-700 leading-relaxed">{influencer.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Social Media Stats */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-[#000631] mb-6">Social Media Presence</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {socialPlatforms.map(({ key, icon: Icon, color, bgColor }) => {
                    const social = influencer.socials?.[key as keyof typeof influencer.socials];
                    if (!social || !social.followers) return null;

                    return (
                      <div key={key} className={`${bgColor} rounded-xl p-4 hover:shadow-md transition-shadow`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
                              <Icon className={`w-5 h-5 ${color}`} />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 capitalize">{key}</div>
                              <div className="text-sm text-gray-600">{social.id}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg text-gray-900">
                              {formatFollowers(social.followers)}
                            </div>
                            <div className="text-xs text-gray-500">followers</div>
                          </div>
                        </div>
                        {social.link && (
                          <a
                            href={social.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center text-sm text-[#EC6546] hover:text-[#EC6546]/80 font-medium"
                          >
                            Visit Profile
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold text-green-800">Rate per Post</h3>
                <div className="text-3xl font-bold text-green-700 mb-2">
                  ₹ {influencer.budget.rate_per_post || "0"}
                </div>
                <p className="text-green-600 text-sm">Starting rate</p>
              </CardContent>
            </Card>

            {/* Story Rate */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold text-blue-800">Rate per Story</h3>
                <div className="text-3xl font-bold text-blue-700 mb-2">
                  ₹ {influencer.budget.rate_per_story || "0"}
                </div>
                <p className="text-blue-600 text-sm">Starting rate</p>
              </CardContent>
            </Card>

            {/* Reel Rate */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold text-purple-800">Rate per Reel</h3>
                <div className="text-3xl font-bold text-purple-700 mb-2">
                  ₹ {influencer.budget.rate_per_reel || "0"}
                </div>
                <p className="text-purple-600 text-sm">Starting rate</p>
              </CardContent>
            </Card>

            {/* Collab Rate */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-pink-50 to-pink-100">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold text-pink-800">Rate per Collab</h3>
                <div className="text-3xl font-bold text-pink-700 mb-2">
                  ₹ {influencer.budget.rate_per_collaboration || "0"}
                </div>
                <p className="text-pink-600 text-sm">Starting rate</p>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-[#000631] to-[#EC6546] text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                <div className="space-y-4">
                  <Button
                    onClick={() => setShowContactModal(true)}
                    className="w-full bg-white text-[#000631] hover:bg-gray-100"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{influencer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{influencer.phone}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Options */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#000631] mb-4">Quick Payment</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Send payments directly for collaborations
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full bg-[#EC6546] hover:bg-[#EC6546]/90 flex items-center justify-center space-x-2"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>PhonePe</span>
                  </Button>
                  <Button
                    onClick={() => setShowPaymentModal(true)}
                    variant="outline"
                    className="w-full border-[#000631] text-[#000631] hover:bg-[#000631] hover:text-white flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Google Pay</span>
                  </Button>
                  <Button
                    onClick={() => setShowPaymentModal(true)}
                    variant="outline"
                    className="w-full border-[#EC6546] text-[#EC6546] hover:bg-[#EC6546] hover:text-white flex items-center justify-center space-x-2"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Paytm</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#000631] mb-4">Profile Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Reach</span>
                    <span className="font-semibold">{formatFollowers(influencer.totalFollowers || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Platforms</span>
                    <span className="font-semibold">
                      {Object.keys(influencer.socials || {}).filter(key =>
                        influencer.socials?.[key as keyof typeof influencer.socials]?.followers
                      ).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Category</span>
                    <Badge variant="secondary">{influencer.category}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Verified</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                </div>
                <div>

                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Login Modal */}
      {showLoginModal && (
        <Dialog open={true} onOpenChange={() => setShowLoginModal(false)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#000631] flex items-center space-x-2">
                <LogIn className="w-5 h-5" />
                <span>Verify Your Identity</span>
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="loginEmail">Enter your registered email address</Label>
                <Input
                  id="loginEmail"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="mt-1"
                />
                {loginError && (
                  <p className="text-red-500 text-sm mt-1">{loginError}</p>
                )}

              </div>

              <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                <p>Enter the email address you used when registering as an influencer to edit your profile.</p>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowLoginModal(false)}
                  disabled={isVerifying}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isVerifying}
                  className="bg-[#EC6546] hover:bg-[#EC6546]/90"
                >
                  {isVerifying ? (
                    <>
                      <LoadingSpinner className="w-4 h-4 mr-2" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Edit'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Modals */}
      {showEditModal && (
        <EditInfluencerModal
          influencer={influencer}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateInfluencer}
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          influencer={influencer}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {showContactModal && (
        <ContactModal
          influencer={influencer}
          onClose={() => setShowContactModal(false)}
        />
      )}
    </div>
  );
}