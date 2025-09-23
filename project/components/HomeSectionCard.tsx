import React from "react";
import Image from "next/image";

interface Influencer {
  name: string;
  followers: string;
  location: string;
  campaign: string;
  reach: string;
  imageUrl: string;
  type: string; // e.g., "Mega Influencer"
}

interface InfluencerCardProps {
  influencer: Influencer;
}

const InfluencerCard = (props: { influencer?: any }) => {


  return (
    <div className="max-w-xl rounded-xl overflow-hidden border border-gray-200 shadow-md bg-white">
      {/* Image */}
      <div className="relative w-full h-60">
        <Image
          src={props.influencer.photoUrl}
          alt={props.influencer.name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-xl"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900">
            {props.influencer.name}{" "}
            <span className="font-normal text-gray-600">
              {props.influencer.socials.instagram.infollowers}
            </span>
          </h3>
          <div className="text-sm text-gray-500 text-right">
            <p>{props.influencer.campaign}</p>
            <p>Reach : {props.influencer.reach}</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">{props.influencer.location.city}</p>

        {/* Button */}
        <button className="w-full py-2 rounded-lg bg-gradient-to-r from-[#FF6A3D] to-[#FF854D] text-white font-semibold hover:scale-105 transition-all">
          {props.influencer.influencer_type.instagram}
        </button>
      </div>
    </div>
  );
};

export default InfluencerCard;
