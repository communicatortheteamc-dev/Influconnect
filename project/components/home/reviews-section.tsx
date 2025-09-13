'use client';

import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Building, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const customerReviews = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    company: 'TechStart Solutions',
    role: 'Marketing Director',
    rating: 5,
    review: 'InflueConnect transformed our brand visibility completely. We found the perfect tech influencers who understood our product and delivered exceptional results. Our app downloads increased by 300% in just 2 months!',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    campaignType: 'Product Launch'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    company: 'BeautyBloom Cosmetics',
    role: 'Brand Manager',
    rating: 5,
    review: 'The quality of influencers on this platform is outstanding. Every creator we worked with was professional, creative, and delivered content that perfectly aligned with our brand values. Highly recommended!',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    campaignType: 'Brand Awareness'
  },
  {
    id: 3,
    name: 'Arjun Patel',
    company: 'FitLife Nutrition',
    role: 'CEO',
    rating: 5,
    review: 'Working with InflueConnect was a game-changer for our fitness brand. The platform made it easy to find authentic fitness influencers who genuinely used and loved our products. ROI exceeded expectations!',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
    campaignType: 'Product Reviews'
  }
];

const influencerReviews = [
  {
    id: 1,
    name: 'Sneha Reddy',
    category: 'Fashion & Lifestyle',
    followers: '125K',
    rating: 5,
    review: 'InflueConnect has been incredible for my creator journey. The brands I work with through this platform are always professional, pay on time, and give me creative freedom. It\'s my go-to platform for collaborations!',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
    platform: 'Instagram'
  },
  {
    id: 2,
    name: 'Vikram Singh',
    category: 'Technology',
    followers: '89K',
    rating: 5,
    review: 'As a tech reviewer, finding the right brands to partner with was always challenging. InflueConnect connects me with innovative companies that value authentic reviews. The support team is also fantastic!',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    platform: 'YouTube'
  },
  {
    id: 3,
    name: 'Kavya Nair',
    category: 'Food & Cooking',
    followers: '156K',
    rating: 5,
    review: 'The quality of brand partnerships through InflueConnect is unmatched. Every collaboration feels meaningful and aligns perfectly with my content style. It\'s helped me grow both creatively and financially!',
    avatar: 'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=150',
    platform: 'Instagram'
  }
];

export function ReviewsSection() {
  const [activeTab, setActiveTab] = useState<'customers' | 'influencers'>('customers');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const currentReviews = activeTab === 'customers' ? customerReviews : influencerReviews;

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === currentReviews.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentReviews.length]);

  const nextReview = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === currentReviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevReview = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? currentReviews.length - 1 : prevIndex - 1
    );
  };

  const handleTabChange = (tab: 'customers' | 'influencers') => {
    setActiveTab(tab);
    setCurrentIndex(0);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#000631] mb-4">
            What Our Community Says
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from brands and creators who have found success through our platform
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-full p-2 shadow-lg border">
            <button
              onClick={() => handleTabChange('customers')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'customers'
                  ? 'bg-[#EC6546] text-white shadow-lg'
                  : 'text-gray-600 hover:text-[#EC6546]'
              }`}
            >
              <Building className="w-5 h-5" />
              <span>Brand Reviews</span>
            </button>
            <button
              onClick={() => handleTabChange('influencers')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === 'influencers'
                  ? 'bg-[#EC6546] text-white shadow-lg'
                  : 'text-gray-600 hover:text-[#EC6546]'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Creator Reviews</span>
            </button>
          </div>
        </div>

        {/* Reviews Carousel */}
        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {currentReviews.map((review) => (
                <div key={review.id} className="w-full flex-shrink-0 px-4">
                  <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="text-center mb-6">
                        <Quote className="w-12 h-12 text-[#EC6546] mx-auto mb-4 opacity-50" />
                        <div className="flex justify-center mb-4">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed italic mb-6">
                          "{review.review}"
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-4">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-16 h-16 rounded-full object-cover border-4 border-[#EC6546]/20"
                        />
                        <div className="text-center">
                          <h4 className="font-semibold text-[#000631] text-lg">{review.name}</h4>
                          {activeTab === 'customers' ? (
                            <>
                              <p className="text-[#EC6546] font-medium">{(review as any).role}</p>
                              <p className="text-gray-600 text-sm">{(review as any).company}</p>
                              <div className="inline-block bg-[#EC6546]/10 text-[#EC6546] px-3 py-1 rounded-full text-xs font-medium mt-2">
                                {(review as any).campaignType}
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="text-[#EC6546] font-medium">{(review as any).category}</p>
                              <p className="text-gray-600 text-sm">{(review as any).followers} followers</p>
                              <div className="inline-block bg-[#EC6546]/10 text-[#EC6546] px-3 py-1 rounded-full text-xs font-medium mt-2">
                                {(review as any).platform}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevReview}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-[#000631] hover:bg-[#000631] hover:text-white transition-all duration-200 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextReview}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-[#000631] hover:bg-[#000631] hover:text-white transition-all duration-200 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {currentReviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex ? 'bg-[#EC6546] w-8' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#000631] mb-2">4.9/5</div>
            <div className="text-gray-600">Average Rating</div>
            <div className="flex justify-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#000631] mb-2">98%</div>
            <div className="text-gray-600">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#000631] mb-2">1000+</div>
            <div className="text-gray-600">Happy Clients</div>
          </div>
        </div>
      </div>
    </section>
  );
}