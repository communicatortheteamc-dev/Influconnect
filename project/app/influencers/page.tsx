'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Grid, List, Users, MapPin, Instagram, Youtube, BookText as TikTok, Facebook } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatFollowers, debounce, categories } from '@/lib/utils';
import { Influencer, FilterParams } from '@/types';
import Link from 'next/link';

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<FilterParams>({
    q: '',
    category: '',
    location: '',
    platform: '',
    minFollowers: 0,
    maxFollowers: 10000000,
    page: 1,
    limit: 12,
    sort: 'followers_desc'
  });

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0
  });

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [followersRange, setFollowersRange] = useState([0, 10000000]);

  const fetchInfluencers = useCallback(async (params: FilterParams) => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== '') {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/influencers?${searchParams.toString()}`);
      const data = await response.json();

      setInfluencers(data.data || []);
      setPagination({
        total: data.total || 0,
        totalPages: data.totalPages || 0
      });
    } catch (error) {
      console.error('Error fetching influencers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      setFilters(prev => ({ ...prev, q: searchTerm.toLowerCase(), page: 1 }));
    }, 300),
    []
  );

  useEffect(() => {
    fetchInfluencers(filters);
  }, [filters, fetchInfluencers]);

  const handleSearchChange = (value: string) => {
    debouncedSearch(value);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePlatformChange = (platform: string, checked: boolean) => {
    const newPlatforms = checked
      ? [...selectedPlatforms, platform]
      : selectedPlatforms.filter(p => p !== platform);

    setSelectedPlatforms(newPlatforms);
    handleFilterChange('platform', newPlatforms.join(','));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const clearFilters = () => {
    setFilters({
      q: '',
      category: '',
      location: '',
      platform: '',
      minFollowers: 0,
      maxFollowers: 10000000,
      page: 1,
      limit: 20,
      sort: 'followers_desc'
    });
    setSelectedPlatforms([]);
    setFollowersRange([0, 10000000]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-6 h-6 text-[#EC6546]" />
            <span className="text-[#EC6546] font-semibold">Discover Talent</span>
          </div>
          <h1 className="text-4xl font-bold text-[#000631] mb-4">Browse Influencers</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Discover verified content creators across various niches and platforms.
            Find the perfect match for your brand campaigns.
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search influencers by name, category, or location..."
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-4">
              <Select onValueChange={(value) => handleFilterChange('category', value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="All Categories">All Categories</SelectItem> */}
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => handleFilterChange('sort', value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="followers_desc">Most Followers</SelectItem>
                  <SelectItem value="followers_asc">Least Followers</SelectItem>
                  <SelectItem value="name_asc">Name A-Z</SelectItem>
                  <SelectItem value="name_desc">Name Z-A</SelectItem>
                  <SelectItem value="createdAt_desc">Newest</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-[#000631] text-[#000631] hover:bg-[#000631] hover:text-white"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <Input
                    placeholder="Enter city or state"
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  />
                </div>

                {/* Platforms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platforms
                  </label>
                  <div className="space-y-2">
                    {['Instagram', 'YouTube', 'Facebook'].map((platform) => (
                      <div key={platform} className="flex items-center space-x-2">
                        <Checkbox
                          id={platform}
                          checked={selectedPlatforms.includes(platform)}
                          onCheckedChange={(checked) => handlePlatformChange(platform, checked as boolean)}
                        />
                        <label htmlFor={platform} className="text-sm flex items-center space-x-1">
                          {platform === 'Instagram' && <Instagram className="w-4 h-4 text-pink-500" />}
                          {platform === 'YouTube' && <Youtube className="w-4 h-4 text-red-500" />}
                          {platform === 'TikTok' && <TikTok className="w-4 h-4 text-black" />}
                          {platform === 'Facebook' && <Facebook className="w-4 h-4 text-blue-500" />}
                          <span>{platform}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Followers Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Followers Range: {formatFollowers(followersRange[0])} - {formatFollowers(followersRange[1])}
                  </label>
                  <Slider
                    value={followersRange}
                    onValueChange={(value) => {
                      setFollowersRange(value);
                      handleFilterChange('minFollowers', value[0]);
                      handleFilterChange('maxFollowers', value[1]);
                    }}
                    max={10000000}
                    step={1000}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-between">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <div className="text-sm text-gray-600">
                  Showing {influencers.length} of {pagination.total} influencers
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="space-y-6">
          {loading ? (
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : influencers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No influencers found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters.</p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {influencers.map((influencer) => (
                    <Link key={influencer._id} href={`/influencers/${influencer.slug}`}>
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                        <div className="relative">
                          <div className="aspect-[3/2] w-full overflow-hidden">
                            <img
                              src={
                                influencer.photoUrl ||
                                'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
                              }
                              alt={influencer.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          <div className="absolute top-3 right-3 bg-[#EC6546] text-white px-2 py-1 rounded-full text-xs font-semibold">
                            {formatFollowers(influencer.totalFollowers || 0)}
                          </div>
                          <div className="absolute bottom-3 left-3 flex space-x-2">
                            {influencer.socials?.instagram && (
                              <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                                <Instagram className="w-3 h-3 text-pink-500" />
                              </div>
                            )}
                            {influencer.socials?.youtube && (
                              <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                                <Youtube className="w-3 h-3 text-red-500" />
                              </div>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-[#000631] mb-1 group-hover:text-[#EC6546] transition-colors">
                            {influencer.name}
                          </h3>
                          <p className="text-sm text-[#EC6546] font-medium mb-2">{influencer.category}</p>
                          <div className="flex items-center text-gray-500 text-sm">
                            <MapPin className="w-3 h-3 mr-1" />
                            {influencer.location.city}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {influencers.map((influencer) => (
                    <Link key={influencer._id} href={`/influencers/${influencer.slug}`}>
                      <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center space-x-6">
                            <img
                              src={influencer.photoUrl || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'}
                              alt={influencer.name}
                              className="w-20 h-20 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-semibold text-[#000631]">{influencer.name}</h3>
                                <div className="text-[#EC6546] font-semibold">
                                  {formatFollowers(influencer.totalFollowers || 0)} followers
                                </div>
                              </div>
                              <p className="text-[#EC6546] font-medium mb-2">{influencer.category}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-gray-500">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {influencer.location.city}
                                </div>
                                <div className="flex space-x-2">
                                  {influencer.socials?.instagram && (
                                    <Instagram className="w-5 h-5 text-pink-500" />
                                  )}
                                  {influencer.socials?.youtube && (
                                    <Youtube className="w-5 h-5 text-red-500" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      disabled={filters.page === 1}
                      onClick={() => handlePageChange(filters.page! - 1)}
                    >
                      Previous
                    </Button>

                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={filters.page === page ? 'default' : 'outline'}
                          onClick={() => handlePageChange(page)}
                          className={filters.page === page ? 'bg-[#EC6546] hover:bg-[#EC6546]/90' : ''}
                        >
                          {page}
                        </Button>
                      );
                    })}

                    <Button
                      variant="outline"
                      disabled={filters.page === pagination.totalPages}
                      onClick={() => handlePageChange(filters.page! + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}