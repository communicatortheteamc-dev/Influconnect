export interface Influencer {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  location: {
      city: string,
      town: string,
      district: string,
      zipcode: string
    },
  bio?: string;
  category: string;
  photoUrl: string;
  videoUrl?: string;
  socials: {
    instagram?: {
      id: string;
      followers: number;
      link: string;
    };
    facebook?: {
      id: string;
      followers: number;
      link: string;
    };
    youtube?: {
      id: string;
      followers: number;
      link: string;
    };
    tiktok?: {
      id: string;
      followers: number;
      link: string;
    };
  };
  totalFollowers?: number;
  termsAccepted: boolean;
  createdAt: string;
  slug?: string;
}

export interface Enquiry {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  district: string;
  services: string[];
  message?: string;
  influencerId?: string;
  createdAt: string;
}

export interface FilterParams {
  q?: string;
  category?: string;
  location?: string;
  platform?: string;
  minFollowers?: number;
  maxFollowers?: number;
  page?: number;
  limit?: number;
  sort?: string;
}