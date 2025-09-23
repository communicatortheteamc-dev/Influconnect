'use client';

import { CheckCircle, Target, Users, Zap } from 'lucide-react';
import Image from 'next/image';
import aboutusimage2 from "@/images/aboutusimage2.png"
export function AboutSection() {
  const features = [
    {
      icon: Target,
      title: 'Strategic Influencer Marketing:',
      description: 'We specialize in Strategic Influencer Marketing that blends creativity, data, and authentic collaborations. Our focus is on building impactful campaigns that inspire trust, influence decisions, and deliver measurable results.',
    },
    {
      icon: Users,
      title: 'Ensure Brand Resonance:',
      description: 'At Influ Connect by Team C, our goal is simple — to ensure brand resonance. We create strategies that align your brand with the right voices and audiences. Every campaign is crafted to build trust, spark engagement, and leave a lasting impact.',
    },
    {
      icon: Zap,
      title: 'Clear measurable goals',
      description: 'At Influ Connect by Team C, we design campaigns with clear, measurable goals. Our strategies focus on delivering real engagement, brand growth, and lasting impact. Every collaboration is driven by results that matter.',
    },
    // {
    //   icon: CheckCircle,
    //   title: 'Proven Results',
    //   description: 'Track record of successful campaigns with measurable ROI and authentic brand-influencer partnerships.',
    // },
  ];

  return (
    <section className="py-20 bg-gray-50" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
       <div className="max-w-6xl mx-auto px-6 lg:px-12 mb-20">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    {/* Left Side - Text */}
    <div className="space-y-6 text-center lg:text-left">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-[#000631] leading-tight">
        About <span className="text-[#EC6546]">InfluConnect</span>
      </h2>
      <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
        Welcome to <span className="font-semibold">Influ Connect by Team C</span> – 
        where influence meets impact. With over{" "}
        <span className="text-[#EC6546] font-medium">10 years of proven advertising expertise</span>, 
        we have been at the forefront of connecting brands with audiences through 
        powerful influencer marketing and creative communication strategies.
      </p>
      <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
        Our decade-long journey reflects <span className="font-semibold">trust, innovation, 
        and results</span> that speak for themselves.
      </p>
    </div>

    {/* Right Side - Image */}
    <div className="flex justify-center">
      <Image
        src={aboutusimage2}
        alt="About InfluConnect"
        width={500}
        height={400}
        className="rounded-2xl  hover:scale-105 transition-transform duration-300"
      />
    </div>
  </div>
</div>


        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
            >
              <div className="w-12 h-12 bg-[#EC6546]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#EC6546]/20 transition-colors">
                <feature.icon className="w-6 h-6 text-[#EC6546]" />
              </div>
              <h3 className="text-xl font-semibold text-[#000631] mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        {/* <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-[#000631] mb-6">Our Mission</h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                To democratize influencer marketing by providing a transparent, efficient platform where brands of all sizes can connect with authentic content creators who align with their values and objectives.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#EC6546] mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#000631]">Transparency First</h4>
                    <p className="text-gray-600">Clear pricing, authentic metrics, and honest communication.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#EC6546] mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#000631]">Quality Assured</h4>
                    <p className="text-gray-600">Rigorous vetting process for all influencer partners.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#EC6546] mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#000631]">Results Driven</h4>
                    <p className="text-gray-600">Focus on measurable outcomes and ROI optimization.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#000631] to-[#EC6546] rounded-2xl p-1">
                <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-6xl font-bold text-[#000631]">3K+</div>
                    <div className="text-xl font-semibold text-gray-600">Verified Influencers</div>
                    <div className="text-4xl font-bold text-[#EC6546]">200+</div>
                    <div className="text-lg text-gray-600">Happy Brands</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}