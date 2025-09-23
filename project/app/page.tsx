import { HeroSection } from '@/components/home/hero-section';
import { AboutSection } from '@/components/home/about-section';
import { InfluencersCarousel } from '@/components/home/influencers-carousel';
import { ReviewsSection } from '@/components/home/reviews-section';
import InfluencerCard from '@/components/HomeSectionCard';
import { ClientsSection } from '@/components/home/ClientsSection';
import { TopInfluencersSection } from '@/components/home/TopInfluencersSection';
import { FAQSection } from '@/components/home/FAQSection';

export default function Home() {
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
    <>
      <HeroSection />
      <AboutSection />
      {/* <InfluencerCard influencer={obj} /> */}
      {/* <InfluencersCarousel /> */}
      {/* <ReviewsSection /> */}
       <ClientsSection />
      <TopInfluencersSection />
      <FAQSection />
    </>
  );
}