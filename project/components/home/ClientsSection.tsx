'use client';

import { useState, useEffect } from 'react';
import { Building, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

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
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-[#EC6546]/10 rounded-full px-5 py-2 mb-6">
            <Building className="w-5 h-5 text-[#EC6546]" />
            <span className="text-[#EC6546] font-semibold">Our Clients</span>
          </div>
          <h2 className="text-4xl font-extrabold text-[#000631] mb-4">
            Trusted by Leading Brands
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We’ve partnered with innovative companies to launch impactful campaigns that drive real results.
          </p>
        </div>

        {/* Continuous Swiper Carousel */}
        <Swiper
          modules={[Autoplay, FreeMode]}
          freeMode={true}
          loop={true}
          speed={5000} // bigger = slower scroll
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          slidesPerView={2}
          spaceBetween={24}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1440: { slidesPerView: 5 },
          }}
        >
          {clients.concat(clients).map((client, i) => ( // duplicate list for smooth loop
            <SwiperSlide key={client._id + '-' + i}>
              <Card className="relative overflow-hidden rounded-2xl shadow-md group h-24 w-54 flex items-center justify-center bg-white">
                <CardContent className="p-0.4 h-full flex items-center justify-center">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-h-64 max-w-54 object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
