'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const faqs = [
  {
    id: 1,
    question: "How do I register as an influencer on InfluConnect?",
    answer: "Simply visit our registration page, fill out your profile information, upload your photos/videos, connect your social media accounts, and submit your application. Our team will review and approve your profile within 24-48 hours."
  },
  {
    id: 2,
    question: "What are the requirements to become an influencer on the platform?",
    answer: "We welcome creators with at least 1,000 followers on any major platform (Instagram, YouTube, TikTok, Facebook). You should have consistent content creation, authentic engagement, and be based in India. We value quality content over follower count."
  },
  {
    id: 3,
    question: "How do brands find and contact influencers?",
    answer: "Brands can browse our influencer directory, use advanced filters to find creators that match their requirements, and submit enquiries directly through our platform. We also provide personalized recommendations based on campaign objectives."
  },
  {
    id: 4,
    question: "What types of campaigns can I participate in?",
    answer: "Our platform offers various campaign types including product reviews, sponsored posts, brand ambassadorships, event coverage, content creation, social media campaigns, and long-term partnerships across multiple industries."
  },
//   {
//     id: 5,
//     question: "How are payments handled on InflueConnect?",
//     answer: "We support multiple payment methods including PhonePe, Google Pay, and Paytm. Payments are processed securely, and influencers set their own rates. We ensure timely payments and provide transaction tracking for transparency."
//   },
//   {
//     id: 6,
//     question: "Is there a fee to join InflueConnect as an influencer?",
//     answer: "No, registration and profile creation are completely free for influencers. We only earn when you earn - through a small commission on successful collaborations. There are no upfront costs or hidden fees."
//   },
//   {
//     id: 7,
//     question: "How do you ensure the quality of influencers and brands?",
//     answer: "We have a rigorous verification process for both influencers and brands. This includes profile verification, social media authentication, background checks, and ongoing performance monitoring to maintain platform quality."
//   },
//   {
//     id: 8,
//     question: "Can I edit my profile after registration?",
//     answer: "Yes, you can update your profile information, photos, videos, social media links, and rates at any time. Simply log in with your registered email address to access the edit functionality on your profile page."
//   },
//   {
//     id: 9,
//     question: "What support do you provide for campaign management?",
//     answer: "We offer end-to-end campaign support including brief clarification, content guidelines, timeline management, performance tracking, and dispute resolution. Our team is available 24/7 to assist with any issues."
//   },
//   {
//     id: 10,
//     question: "How can brands measure campaign success?",
//     answer: "We provide detailed analytics including reach, engagement rates, click-through rates, conversion tracking, and ROI metrics. Brands receive comprehensive reports to measure campaign effectiveness and plan future collaborations."
//   }
];

export function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-[#EC6546]/10 rounded-full px-4 py-2 mb-4">
            <HelpCircle className="w-5 h-5 text-[#EC6546]" />
            <span className="text-[#EC6546] font-semibold">Support</span>
          </div>
          <h2 className="text-4xl font-bold text-[#000631] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about InfluConnect, our services, and how to get started.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card 
              key={faq.id} 
              className="overflow-hidden shadow-lg border-0 hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-0">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:bg-gray-50"
                >
                  <h3 className="text-lg font-semibold text-[#000631] pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openFAQ === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-[#EC6546]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openFAQ === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-5">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-[#000631] to-[#EC6546] rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-white/90 mb-6">
              Our support team is here to help you get started and succeed on InfluConnect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#000631] rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Contact Support
              </a>
              {/* <a
                href="influconnectbytheteamc@gmail.com"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-[#000631] transition-colors duration-200"
              >
                Email Us
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}