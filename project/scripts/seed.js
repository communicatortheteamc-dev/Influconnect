const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;
const dbName = 'influeconnect';

// Sample data for seeding
const categories = [
  'Fashion & Lifestyle',
  'Fitness & Health',
  'Food & Cooking',
  'Travel',
  'Technology',
  'Beauty & Skincare',
  'Gaming',
  'Entertainment',
  'Education',
  'Business & Finance',
  'Art & Creativity',
  'Sports',
  'Music',
  'Parenting',
  'Home & Garden',
];

const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
  'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
  'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana',
  'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar',
  'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad',
  'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur',
  'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur'
];

const samplePhotos = [
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400'
];

const firstNames = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Aadhya', 'Ananya', 'Diya', 'Ira', 'Pihu', 'Prisha', 'Anvi', 'Riya', 'Navya', 'Kavya',
  'Rahul', 'Rohan', 'Amit', 'Suresh', 'Vikram', 'Rajesh', 'Deepak', 'Manoj', 'Sandeep', 'Ashish',
  'Priya', 'Pooja', 'Sneha', 'Neha', 'Ritu', 'Sunita', 'Kavita', 'Meera', 'Sita', 'Geeta'
];

const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Agarwal', 'Bansal', 'Jain', 'Singhal', 'Garg', 'Mittal', 'Goyal',
  'Kumar', 'Singh', 'Yadav', 'Mishra', 'Pandey', 'Tiwari', 'Dubey', 'Shukla', 'Srivastava', 'Tripathi',
  'Patel', 'Shah', 'Mehta', 'Desai', 'Modi', 'Joshi', 'Parikh', 'Thakkar', 'Vyas', 'Amin',
  'Reddy', 'Rao', 'Naidu', 'Chowdary', 'Prasad', 'Krishna', 'Raju', 'Babu', 'Murthy', 'Sastry'
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePhoneNumber() {
  const prefixes = ['98', '99', '97', '96', '95', '94', '93', '92', '91', '90'];
  const prefix = getRandomElement(prefixes);
  const remaining = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  return `+91 ${prefix}${remaining}`;
}

function generateEmail(name) {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const cleanName = name.toLowerCase().replace(/\s+/g, '');
  const number = Math.floor(Math.random() * 999);
  return `${cleanName}${number}@${getRandomElement(domains)}`;
}

function generateClientData() {
  const companies = [
    { name: 'TechStart Solutions', industry: 'Technology', logo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'BeautyBloom Cosmetics', industry: 'Beauty & Skincare', logo: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'FitLife Nutrition', industry: 'Health & Fitness', logo: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'StyleHub Fashion', industry: 'Fashion & Lifestyle', logo: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'FoodieDelight', industry: 'Food & Beverage', logo: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'TravelWise', industry: 'Travel & Tourism', logo: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'EcoGreen Products', industry: 'Sustainability', logo: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'GameZone Entertainment', industry: 'Gaming', logo: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'HomeDecor Plus', industry: 'Home & Garden', logo: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'EduTech Learning', industry: 'Education', logo: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'FinanceFirst', industry: 'Financial Services', logo: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'AutoDrive Motors', industry: 'Automotive', logo: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'PetCare Solutions', industry: 'Pet Care', logo: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'SportsPro Equipment', industry: 'Sports', logo: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { name: 'MusicStream', industry: 'Entertainment', logo: 'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg?auto=compress&cs=tinysrgb&w=100' }
  ];

  const testimonials = [
    "InflueConnect helped us find the perfect influencers for our campaign. The results exceeded our expectations!",
    "Working with InflueConnect was seamless. Their platform made influencer discovery and management effortless.",
    "The quality of influencers on this platform is outstanding. We saw a 300% increase in engagement.",
    "Professional service and excellent results. InflueConnect is our go-to platform for influencer marketing.",
    "Amazing ROI and authentic partnerships. Highly recommend InflueConnect for any brand.",
    "The platform's filtering system helped us find exactly the right creators for our niche market.",
    "Transparent pricing and reliable influencers. InflueConnect delivered beyond our expectations.",
    "Great customer support and smooth campaign execution. Will definitely work with them again.",
    "The analytics and reporting features helped us track our campaign success effectively.",
    "Found genuine influencers who truly connected with our brand values and audience."
  ];

  return companies.map(company => ({
    ...company,
    description: `${company.name} is a leading company in the ${company.industry.toLowerCase()} sector, committed to innovation and customer satisfaction.`,
    campaignsCompleted: getRandomNumber(5, 50),
    rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // 3.5 to 5.0 rating
    testimonial: getRandomElement(testimonials),
    website: `https://${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
  }));
}

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function generateBio(name, category) {
  const bios = {
    'Fashion & Lifestyle': [
      `${name} is a fashion enthusiast who loves sharing style tips and lifestyle content with followers.`,
      `Passionate about sustainable fashion and helping others discover their unique style.`,
      `Fashion blogger and stylist with a keen eye for trends and affordable fashion finds.`
    ],
    'Fitness & Health': [
      `${name} is a certified fitness trainer dedicated to helping others achieve their health goals.`,
      `Fitness enthusiast sharing workout routines, nutrition tips, and wellness advice.`,
      `Personal trainer and health coach inspiring others to live their best life.`
    ],
    'Food & Cooking': [
      `${name} is a food lover who enjoys creating and sharing delicious recipes with the community.`,
      `Home chef passionate about traditional Indian cuisine and modern cooking techniques.`,
      `Food blogger exploring diverse cuisines and sharing easy-to-follow recipes.`
    ],
    'Travel': [
      `${name} is an avid traveler sharing adventures and travel tips from around the world.`,
      `Travel enthusiast documenting beautiful destinations and cultural experiences.`,
      `Wanderlust-driven content creator inspiring others to explore new places.`
    ],
    'Technology': [
      `${name} is a tech enthusiast reviewing gadgets and sharing technology insights.`,
      `Software developer and tech reviewer helping others make informed tech decisions.`,
      `Technology content creator passionate about innovation and digital trends.`
    ]
  };
  
  const categoryBios = bios[category] || [
    `${name} is a content creator passionate about sharing knowledge and experiences.`,
    `Creative individual dedicated to producing engaging and valuable content.`,
    `Influencer committed to building authentic connections with the community.`
  ];
  
  return getRandomElement(categoryBios);
}

function generateInfluencer() {
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(lastNames);
  const name = `${firstName} ${lastName}`;
  const category = getRandomElement(categories);
  const location = getRandomElement(indianCities);
  const photoUrl = getRandomElement(samplePhotos);
  
  // Generate rate based on followers (₹5-50 per 1000 followers)
  const baseRate = Math.floor(Math.random() * 45000) + 5000; // ₹5,000 to ₹50,000
  const rate = Math.round(baseRate / 1000) * 1000; // Round to nearest 1000
  
  // Generate social media data
  const instagramFollowers = getRandomNumber(5000, 500000);
  const youtubeFollowers = getRandomNumber(2000, 200000);
  const facebookFollowers = getRandomNumber(1000, 100000);
  const tiktokFollowers = getRandomNumber(10000, 800000);
  
  const socials = {};
  
  // 90% chance of having Instagram
  if (Math.random() > 0.1) {
    socials.instagram = {
      id: `@${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      followers: instagramFollowers,
      link: `https://instagram.com/${firstName.toLowerCase()}${lastName.toLowerCase()}`
    };
  }
  
  // 70% chance of having YouTube
  if (Math.random() > 0.3) {
    socials.youtube = {
      id: `${firstName} ${lastName}`,
      followers: youtubeFollowers,
      link: `https://youtube.com/channel/${firstName}${lastName}`
    };
  }
  
  // 50% chance of having Facebook
  if (Math.random() > 0.5) {
    socials.facebook = {
      id: `${firstName}.${lastName}`,
      followers: facebookFollowers,
      link: `https://facebook.com/${firstName}.${lastName}`
    };
  }
  
  // 60% chance of having TikTok
  if (Math.random() > 0.4) {
    socials.tiktok = {
      id: `@${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      followers: tiktokFollowers,
      link: `https://tiktok.com/@${firstName.toLowerCase()}${lastName.toLowerCase()}`
    };
  }
  
  // Calculate total followers
  const totalFollowers = Object.values(socials).reduce((sum, social) => sum + social.followers, 0);
  
  return {
    name,
    email: generateEmail(name),
    phone: generatePhoneNumber(),
    location,
    bio: generateBio(firstName, category),
    category,
    photoUrl,
    videoUrl: Math.random() > 0.7 ? `https://res.cloudinary.com/demo/video/upload/v1/${Date.now()}_intro.mp4` : null,
    rate,
    socials,
    totalFollowers,
    termsAccepted: true,
    slug: generateSlug(name),
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString() // Random date within last year
  };
}

async function seedDatabase() {
  const client = new MongoClient(uri);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    
    const db = client.db(dbName);
    const collection = db.collection('influencers');
    
    // Clear existing data
    console.log('Clearing existing influencer data...');
    await collection.deleteMany({});
    
    // Clear existing client data
    const clientsCollection = db.collection('clients');
    console.log('Clearing existing client data...');
    await clientsCollection.deleteMany({});
    
    // Generate and insert influencers
    console.log('Generating influencer data...');
    const influencers = [];
    
    for (let i = 0; i < 3000; i++) {
      influencers.push(generateInfluencer());
      
      if (i % 100 === 0) {
        console.log(`Generated ${i + 1} influencers...`);
      }
    }
    
    console.log('Inserting data into database...');
    const result = await collection.insertMany(influencers);
    
    // Generate and insert clients
    console.log('Generating client data...');
    const clients = generateClientData();
    
    console.log('Inserting client data...');
    const clientResult = await clientsCollection.insertMany(clients);
    
    console.log(`Successfully inserted ${result.insertedCount} influencers`);
    console.log(`Successfully inserted ${clientResult.insertedCount} clients`);
    
    // Create indexes for better search performance
    console.log('Creating database indexes...');
    await collection.createIndex({ name: 'text', bio: 'text', category: 'text', location: 'text' });
    await collection.createIndex({ category: 1 });
    await collection.createIndex({ location: 1 });
    await collection.createIndex({ totalFollowers: -1 });
    await collection.createIndex({ createdAt: -1 });
    await collection.createIndex({ slug: 1 }, { unique: true });
    
    // Create indexes for clients
    await clientsCollection.createIndex({ name: 1 });
    await clientsCollection.createIndex({ industry: 1 });
    await clientsCollection.createIndex({ rating: -1 });
    
    console.log('Database seeding completed successfully!');
    
    // Display some statistics
    const stats = await collection.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgFollowers: { $avg: '$totalFollowers' }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();
    
    console.log('\nCategory Statistics:');
    stats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} influencers (avg ${Math.round(stat.avgFollowers)} followers)`);
    });
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };