'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Building } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Client {
  _id: string;
  name: string;
  logo: string;
  industry: string;
  description: string;
  campaignsCompleted: number;
  rating: number;
  testimonial: string;
  website: string;
}

export function ClientsSection() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      if (window.innerWidth < 640) {
        setIsMobile(true);
        setItemsPerSlide(1);
      } else if (window.innerWidth < 1024) {
        setIsMobile(false);
        setItemsPerSlide(2);
      } else {
        setIsMobile(false);
        setItemsPerSlide(3);
      }
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients');
        const data = await response.json();
        setClients(data.data || []);
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 >= clients.length - itemsPerSlide + 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? clients.length - itemsPerSlide : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-[#EC6546]/10 rounded-full px-4 py-2 mb-4">
            <Building className="w-5 h-5 text-[#EC6546]" />
            <span className="text-[#EC6546] font-semibold">Our Clients</span>
          </div>
          <h2 className="text-4xl font-bold text-[#000631] mb-4">
            Trusted by Leading Brands
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've helped hundreds of brands connect with the right influencers
            to achieve their marketing goals.
          </p>
        </div>

        {/* Mobile: simple stacked list */}
        {isMobile ? (
          <div className="grid grid-cols-1 gap-6">
            {clients.map((client) => (
              <Card
                key={client._id}
                className="transition-all duration-300 hover:-translate-y-2 overflow-hidden group h-full"
              >
                <CardContent className="relative p-0 h-64">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-sm font-semibold px-3 py-1 rounded-lg">
                    {client.name}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Tablet + Desktop: carousel */
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${(currentIndex * 100) / itemsPerSlide}%)`,
                  width: `${(clients.length * 100) / itemsPerSlide}%`,
                }}
              >
                {clients.map((client) => (
                  <div
                    key={client._id}
                    className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-4"
                  >
                    <Card className="transition-all duration-300 hover:-translate-y-2 overflow-hidden group h-full">
                      <CardContent className="relative p-0 h-64">
                        <img
                          src={client.logo}
                          alt={client.name}
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-sm font-semibold px-3 py-1 rounded-lg">
                          {client.name}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            {clients.length > itemsPerSlide && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-[#000631] hover:bg-[#000631] hover:text-white transition-all duration-200 z-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-[#000631] hover:bg-[#000631] hover:text-white transition-all duration-200 z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
