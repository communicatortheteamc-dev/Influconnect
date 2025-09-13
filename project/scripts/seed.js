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
    console.log('Clearing existing data...');
    await collection.deleteMany({});
    
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
    
    console.log(`Successfully inserted ${result.insertedCount} influencers`);
    
    // Create indexes for better search performance
    console.log('Creating database indexes...');
    await collection.createIndex({ name: 'text', bio: 'text', category: 'text', location: 'text' });
    await collection.createIndex({ category: 1 });
    await collection.createIndex({ location: 1 });
    await collection.createIndex({ totalFollowers: -1 });
    await collection.createIndex({ createdAt: -1 });
    await collection.createIndex({ slug: 1 }, { unique: true });
    
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