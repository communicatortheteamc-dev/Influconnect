'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Instagram, Youtube, MapPin } from 'lucide-react';
import { formatFollowers } from '@/lib/utils';
import Link from 'next/link';
import InfluencerCard from '../HomeSectionCard';



export function InfluencersCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const [influencers, setInfluencers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/top-influencers")
      .then((res) => res.json())
      .then((data) => setInfluencers(data));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
  };



  // useEffect(() => {
  //   if (!isAutoPlaying) return;

  //   const interval = setInterval(() => {
  //     setCurrentIndex((prevIndex) => 
  //       prevIndex === influencers.length - 3 ? 0 : prevIndex + 1
  //     );
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === influencers.length - 3 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? influencers.length - 3 : prevIndex - 1
    );
  };
 const obj = {
    "_id": { "$oid": "68c2b296cef6787c7d548ee1" },
    "name": "Kumar",
    "email": "theteamc.official@gmail.com",
    "phone": "56466456",
    "location": { "city": "dsa", "town": "dasdas", "district": "dsa", "zipcode": "34232" },
    "bio": "dfsfsdf",
    "category": "Entertainment",
    "photoUrl": "https://res.cloudinary.com/dzfnaks6l/image/upload/v1757590129/uoelcjxtwhzgdjewjuor.avif",
    "videoUrl": "",
    "socials": {
      "instagram": { "id": "dfsfs", "followers": { "$numberInt": "343" }, "link": "fssd" },
      "youtube": { "id": "fdsfs", "followers": { "$numberInt": "43444" }, "link": "fdsds" }, "facebook": { "id": "fdsf", "followers": { "$numberInt": "43435345" }, "link": "fdsf" },
      "tiktok": { "id": "", "followers": { "$numberInt": "0" }, "link": "" }
    },
    "budget": "033",
    "influencer_type": { "youtube": "micro", "facebook": "mega", "instagram": "nano" },
    "termsAccepted": true,
    "totalFollowers": { "$numberInt": "43479132" },
    "slug": "kumar",
    "createdAt": "2025-09-11T11:29:26.793Z",
    "campaign": "campaign",
    "reach": "reach"
  }
 
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#000631] mb-4">
            Meet Our Top Influencers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover talented content creators across various niches who are ready to amplify your brand message.
          </p>
        </div>

        {/* Carousel */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
            > 
            {/* <InfluencerCard influencer={obj}/> */}
              {influencers.map((influencer) => (
                <div key={influencer.id} className="w-1/3 flex-shrink-0 px-4">
                  <Link href={`/influencers/${influencer.slug}`}>
                    {/* <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
                      <div className="relative">
                        <img
                          src={influencer.photoUrl}
                          alt={influencer.name}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4 bg-[#EC6546] text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {formatFollowers(influencer.totalFollowers)}
                        </div>
                        <div className="absolute bottom-4 left-4 flex space-x-2">
                          {influencer.platforms.includes('Instagram') && (
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                              <Instagram className="w-4 h-4 text-pink-500" />
                            </div>
                          )}
                          {influencer.platforms.includes('YouTube') && (
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                              <Youtube className="w-4 h-4 text-red-500" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-[#000631] mb-2">{influencer.name}</h3>
                        <p className="text-[#EC6546] font-medium mb-2">{influencer.category}</p>
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {influencer.location}
                        </div>
                      </div>
                    </div> */}
                     <InfluencerCard influencer={influencer}/>
                  </Link>
                </div>
               
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-[#000631] hover:bg-[#000631] hover:text-white transition-all duration-200 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-[#000631] hover:bg-[#000631] hover:text-white transition-all duration-200 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: influencers.length - 2 }).map((_, index) => (
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

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/influencers"
            className="inline-flex items-center space-x-2 bg-[#EC6546] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#EC6546]/90 transition-colors duration-200 hover:shadow-lg"
          >
            <span>View All Influencers</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}