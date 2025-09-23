'use client';

import { useState, useEffect } from 'react';
import { Crown, Instagram, Youtube, MapPin, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatFollowers } from '@/lib/utils';
import { Influencer } from '@/types';
import Link from 'next/link';

export function TopInfluencersSection() {
  const [topInfluencers, setTopInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopInfluencers = async () => {
      try {
        const response = await fetch('/api/influencers?sort=followers_desc&limit=3');
        const data = await response.json();
        setTopInfluencers(data.data || []);
      } catch (error) {
        console.error('Error fetching top influencers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopInfluencers();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-80 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-yellow-100 rounded-full px-4 py-2 mb-4">
            <Crown className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-600 font-semibold">Top Performers</span>
          </div>
          <h2 className="text-4xl font-bold text-[#000631] mb-4">
            Our Top Influencers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our most successful content creators who consistently deliver exceptional results for brand campaigns.
          </p>
        </div>

        {/* Top Influencers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topInfluencers.map((influencer, index) => (
            <Link key={influencer._id} href={`/influencers/${influencer.slug}`}>
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group relative">
                {/* Rank Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 
                    index === 2 ? 'bg-amber-600' : 'bg-[#EC6546]'
                  }`}>
                    #{index + 1}
                  </div>
                </div>

                <div className="relative">
                  <img
                    src={influencer.photoUrl || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={influencer.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Follower Count Overlay */}
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{formatFollowers(influencer.totalFollowers || 0)}</span>
                  </div>
                  
                  {/* Social Media Icons */}
                  <div className="absolute bottom-4 left-4 flex space-x-2">
                    {influencer.socials?.instagram && (
                      <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                        <Instagram className="w-4 h-4 text-pink-500" />
                      </div>
                    )}
                    {influencer.socials?.youtube && (
                      <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                        <Youtube className="w-4 h-4 text-red-500" />
                      </div>
                    )}
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-[#000631] group-hover:text-[#EC6546] transition-colors mb-1">
                        {influencer.name}
                      </h3>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="w-3 h-3 mr-1" />
                        {influencer.location.city}
                      </div>
                    </div>
                    {index < 3 && (
                      <Crown className={`w-5 h-5 ${
                        index === 0 ? 'text-yellow-500' : 
                        index === 1 ? 'text-gray-400' : 'text-amber-600'
                      }`} />
                    )}
                  </div>
                  
                  <Badge className="bg-[#EC6546]/10 text-[#EC6546] hover:bg-[#EC6546]/20 mb-3">
                    {influencer.category}
                  </Badge>
                  
                  {influencer.bio && (
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {influencer.bio}
                    </p>
                  )}
                  
                  {/* Engagement Stats */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Reach</span>
                      <span className="font-semibold text-[#000631]">
                        {formatFollowers(influencer.totalFollowers || 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/influencers"
            className="inline-flex items-center space-x-2 bg-[#EC6546] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#EC6546]/90 transition-colors duration-200 hover:shadow-lg"
          >
            <span>View All Influencers</span>
            <TrendingUp className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}