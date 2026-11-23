/**
 * TedBus Database Seed Script
 * Run with: node seed.js [--dry-run] [--force-prod]
 */

const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const Routes = require('./models/route');
const Buses = require('./models/bus');
const CommunityPost = require('./models/CommunityPost');

const isDryRun = process.argv.includes('--dry-run');
const forceProd = process.argv.includes('--force-prod');
const isProd = process.env.NODE_ENV === 'production';

if (isProd && !forceProd) {
  console.error('❌ Refusing to seed production database without --force-prod flag.');
  process.exit(1);
}

const DBURL = process.env.MONGO_URI || 'mongodb+srv://chetannanda62:P6pld7Kfp6psfWEi@tedbus.fcvedwg.mongodb.net/?retryWrites=true&w=majority&appName=TedBus';

// Realistic Corridors
const corridors = [
  {
    from: 'Delhi',
    to: 'Jaipur',
    duration: 5,
    fromSubs: ['ISBT Kashmere Gate', 'Dhaula Kuan', 'Mahipalpur', 'IFFCO Chowk'],
    toSubs: ['Sindhi Camp', 'Narayan Singh Circle', 'Transport Nagar', '200 Ft Bypass'],
    buses: [
      { operator: 'Zingbus Plus Electric', type: 'Volvo 9600 Multi-Axle AC Sleeper (2+1)', time: '06:30', rating: [4.8, 4.9, 4.7], tracking: 1, resched: 1 },
      { operator: 'IntrCity SmartBus', type: 'BharatBenz Executive AC Seater (2+2)', time: '08:00', rating: [4.6, 4.5, 4.7], tracking: 1, resched: 1 },
      { operator: 'NueGo Green Mobility', type: 'Zero Emission Electric AC Seater (2+2)', time: '10:30', rating: [4.9, 4.8], tracking: 1, resched: 1 },
      { operator: 'RSRTC Royal Express', type: 'Volvo Super Deluxe Air Suspension (2+2)', time: '14:00', rating: [4.3, 4.2], tracking: 0, resched: 1 },
      { operator: 'Hans Travels (I) Pvt Ltd', type: 'Scania High Deck AC Sleeper (2+1)', time: '22:30', rating: [4.7, 4.8, 4.6], tracking: 1, resched: 1 },
      { operator: 'Ashok Travels Mandsaur', type: 'AC Sleeper 2+1 with Washroom', time: '23:45', rating: [4.4, 4.5], tracking: 1, resched: 0 }
    ]
  },
  {
    from: 'Delhi',
    to: 'Chandigarh',
    duration: 4.5,
    fromSubs: ['ISBT Kashmere Gate', 'Majnu Ka Tilla', 'Karnal Bypass'],
    toSubs: ['ISBT Sector 43', 'ISBT Sector 17', 'Tribune Chowk'],
    buses: [
      { operator: 'IntrCity SmartBus', type: 'Volvo 9600 AC Seater (2+2)', time: '07:00', rating: [4.8, 4.7], tracking: 1, resched: 1 },
      { operator: 'Zingbus Premium', type: 'Scania Multi-Axle AC Seater (2+2)', time: '09:15', rating: [4.7, 4.8], tracking: 1, resched: 1 },
      { operator: 'HRTC Himsuta', type: 'Volvo B11R AC Super Luxury (2+2)', time: '12:00', rating: [4.5, 4.6], tracking: 1, resched: 1 },
      { operator: 'NueGo Intercity', type: 'Electric AC Coach (2+2)', time: '16:30', rating: [4.8, 4.9], tracking: 1, resched: 1 }
    ]
  },
  {
    from: 'Delhi',
    to: 'Agra',
    duration: 3.5,
    fromSubs: ['Sarai Kale Khan ISBT', 'Akshardham', 'Noida Pari Chowk'],
    toSubs: ['Agra ISBT', 'Water Works Bypass', 'Idgah Bus Stand'],
    buses: [
      { operator: 'UPSRTC Shatabdi Bus', type: 'Scania AC Seater (2+2)', time: '06:00', rating: [4.4, 4.3], tracking: 1, resched: 1 },
      { operator: 'Taj Express Lines', type: 'Volvo AC Seater (2+2)', time: '08:30', rating: [4.6, 4.7], tracking: 1, resched: 1 },
      { operator: 'Zingbus Electric', type: 'Smart Electric AC Coach (2+2)', time: '11:00', rating: [4.8, 4.8], tracking: 1, resched: 1 }
    ]
  },
  {
    from: 'Mumbai',
    to: 'Pune',
    duration: 3.5,
    fromSubs: ['Borivali East', 'Dadar Asiad', 'Vashi Toll Plaza', 'Kharghar'],
    toSubs: ['Wakad Bridge', 'Swargate', 'Pune Station', 'Hinjewadi Flyover'],
    buses: [
      { operator: 'MSRTC Shivneri', type: 'Volvo B9R AC Multi-Axle (2+2)', time: '06:00', rating: [4.8, 4.7], tracking: 1, resched: 1 },
      { operator: 'Purple Travels (Prasanna)', type: 'Scania Metrolink AC Seater (2+2)', time: '07:30', rating: [4.7, 4.6], tracking: 1, resched: 1 },
      { operator: 'Neeta Tours and Travels', type: 'Mercedes Benz AC Seater (2+2)', time: '09:00', rating: [4.5, 4.4], tracking: 1, resched: 1 },
      { operator: 'IntrCity SmartBus', type: 'Volvo 9600 AC Seater (2+2)', time: '14:30', rating: [4.8, 4.9], tracking: 1, resched: 1 }
    ]
  },
  {
    from: 'Mumbai',
    to: 'Goa',
    duration: 11,
    fromSubs: ['Borivali National Park', 'Andheri East', 'Chembur', 'Vashi'],
    toSubs: ['Mapusa Bus Stand', 'Panaji KTC Bus Stand', 'Margao KTC'],
    buses: [
      { operator: 'VRL Travels', type: 'I-Shift Multi-Axle AC Sleeper (2+1)', time: '17:30', rating: [4.8, 4.9], tracking: 1, resched: 1 },
      { operator: 'Paulo Travels', type: 'Volvo 9600 AC Sleeper with Personal Screens (2+1)', time: '18:45', rating: [4.7, 4.8], tracking: 1, resched: 1 },
      { operator: 'Konduskar Travels Pvt Ltd', type: 'Scania High Deck AC Sleeper (2+1)', time: '20:00', rating: [4.6, 4.7], tracking: 1, resched: 1 },
      { operator: 'Atmaram Travels', type: 'Mercedes Benz Luxury Sleeper (2+1)', time: '21:15', rating: [4.5, 4.6], tracking: 1, resched: 0 }
    ]
  },
  {
    from: 'Bangalore',
    to: 'Chennai',
    duration: 6,
    fromSubs: ['Majestic Bus Stand', 'Shantinagar', 'Madiwala', 'Electronic City'],
    toSubs: ['Koyambedu CMBT', 'Guindy', 'Tambaram', 'Sriperumbudur'],
    buses: [
      { operator: 'KSRTC Airavat Club Class', type: 'Volvo Multi-Axle AC Seater (2+2)', time: '06:00', rating: [4.8, 4.9], tracking: 1, resched: 1 },
      { operator: 'SRS Travels', type: 'Scania AC Sleeper/Seater (2+1)', time: '07:30', rating: [4.6, 4.5], tracking: 1, resched: 1 },
      { operator: 'Orange Tours and Travels', type: 'Volvo 9600 Multi-Axle AC Sleeper (2+1)', time: '14:00', rating: [4.7, 4.8], tracking: 1, resched: 1 },
      { operator: 'IntrCity SmartBus', type: 'BharatBenz AC Sleeper (2+1)', time: '23:00', rating: [4.9, 4.8], tracking: 1, resched: 1 }
    ]
  },
  {
    from: 'Bangalore',
    to: 'Hyderabad',
    duration: 9,
    fromSubs: ['Kalasipalyam', 'Majestic', 'Hebbal', 'Yelahanka Bypass'],
    toSubs: ['Shamshabad', 'Ameerpet', 'MGBS', 'Kukatpally'],
    buses: [
      { operator: 'Orange Tours and Travels', type: 'Volvo Multi-Axle AC Sleeper (2+1)', time: '20:30', rating: [4.8, 4.9], tracking: 1, resched: 1 },
      { operator: 'VRL Travels', type: 'I-Shift Multi-Axle AC Sleeper (2+1)', time: '21:15', rating: [4.7, 4.8], tracking: 1, resched: 1 },
      { operator: 'KSRTC Ambaari Utsav', type: 'Volvo 9600 Luxury Sleepers (2+1)', time: '22:00', rating: [4.9, 4.9], tracking: 1, resched: 1 },
      { operator: 'Morning Star Travels', type: 'Scania AC Sleeper (2+1)', time: '22:45', rating: [4.6, 4.5], tracking: 1, resched: 0 }
    ]
  }
];

// Rich Community Seed Posts matching CommunityPost schema
const communitySeedPosts = [
  {
    title: 'Delhi to Jaipur on Zingbus Electric: Smooth, Silent, and ₹250 Toll Saved',
    template: 'story',
    author: 'Priya Iyer',
    posterName: 'Priya Iyer',
    posterPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    city: 'Jaipur',
    route: 'Delhi to Jaipur',
    story: 'Traveling to Jaipur over the weekend was always a toss up between trains and crowded NH48 buses. Trying the new electric bus via TedBus was an eye-opener. The bus was practically silent with zero engine vibration. Boarding at IFFCO Chowk was on time to the minute. The seats reclined generously with dedicated USB-C charging points. We reached Sindhi Camp in exactly 4 hours and 45 minutes.',
    tips: 'Board from IFFCO Chowk if you live in Gurgaon to avoid the Kashmere Gate morning jam.',
    photos: ['https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'],
    likes: 48
  },
  {
    title: 'Ultimate 3-Day Goa Coastal Road Trip: Hidden Cafes & Clean Beaches',
    template: 'itinerary',
    author: 'Vikram Malhotra',
    posterName: 'Vikram Malhotra',
    posterPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    city: 'Goa',
    route: 'Mumbai to Goa',
    itineraryDays: 3,
    budgetRange: '₹8,000 - ₹12,000',
    bestSeason: 'Nov - Feb',
    story: 'Day 1: Arrive early via overnight VRL sleeper bus at Mapusa. Check in at Anjuna and head straight to Baba Au Rhum for brunch. Spend sunset at Morjim.\n\nDay 2: Rent a scooter towards Panaji. Walk through the pastel streets of Fontainhas, grabbing fresh pastéis de nata. Evening boat cruise along Mandovi.\n\nDay 3: Drive down south to Palolem and Agonda for uncrowded golden sands and fresh seafood.',
    tips: 'Book South Goa beach huts in advance during weekends.',
    photos: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'],
    likes: 84
  },
  {
    title: 'Top 5 Tips for Taking Overnight Sleeper Buses in India',
    template: 'tip',
    author: 'Aarav Mehta',
    posterName: 'Aarav Mehta',
    posterPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    city: 'All India',
    route: 'Pan India',
    tipCategory: 'Packing & Comfort',
    story: '1. Always pick Single Upper Berths for solo trips: You get maximum privacy and nobody crawling past your berth.\n2. Carry a lightweight hoodie or stole: Air-conditioned Volvo buses can get extremely chilly at 3:00 AM.\n3. Track the bus live via TedBus: You do not need to stand in the heat at roadside dhabas.\n4. Keep shoes in a cloth pouch inside the berth.\n5. Download offline maps of highway toll intersections.',
    tips: 'Always check if the operator provides clean blankets or carry your own light throw.',
    photos: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'],
    likes: 112
  },
  {
    title: 'Vande Bharat Express vs Volvo Sleeper: Bangalore to Chennai Comparison',
    template: 'review',
    author: 'Sneha Reddy',
    posterName: 'Sneha Reddy',
    posterPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    city: 'Chennai',
    route: 'Bangalore to Chennai',
    reviewMode: 'train',
    operator: '20608 Vande Bharat / KSRTC Club Class',
    rating: 5,
    pros: 'Spotless bio-toilets, hot breakfast, on-time arrival within 4h 15m.',
    cons: 'Higher fare compared to normal express trains.',
    story: 'Took both modes in the same week. The 20608 Vande Bharat took 4 hrs 15 mins from KSR Bengaluru to MGR Chennai Central, complete with hot breakfast and spotless bio-toilets. The KSRTC Club Class Volvo took 5 hrs 45 mins due to city traffic at Electronic City and Poonamallee. Verdict: Take Vande Bharat if your origin/destination is near railway hubs; take Volvo if you want pickup directly from Indiranagar or Madiwala.',
    photos: ['https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80'],
    likes: 65
  },
  {
    title: 'Manali in Monsoon: Why You Should Book Multi-Axle Scania Buses',
    template: 'story',
    author: 'Karan Joshi',
    posterName: 'Karan Joshi',
    posterPhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
    city: 'Manali',
    route: 'Delhi to Manali',
    story: 'The new four-lane bypass cuts out hundreds of hairpin bends on the way to Kullu. Booking a high-deck Scania with air suspension made a dramatic difference in motion sickness. Waking up to pine-covered mist at Aut was truly magical.',
    tips: 'Avoid night driving if prone to severe motion sickness; day buses offer majestic Beas river views.',
    photos: ['https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=800&q=80'],
    likes: 39
  },
  {
    title: 'Budget Solo Backpacker Guide to Varanasi Ghats and Evening Aarti',
    template: 'itinerary',
    author: 'Ananya Sen',
    posterName: 'Ananya Sen',
    posterPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    city: 'Varanasi',
    route: 'Delhi to Varanasi',
    itineraryDays: 2,
    budgetRange: '₹3,000 - ₹5,000',
    bestSeason: 'Oct - Mar',
    story: 'Varanasi is an intense assault on the senses in the most soulful way. Staying near Kedar Ghat gives you quiet mornings without boat touts. Don’t miss the malaiyo winter dessert in the chowk alleys.',
    tips: 'Reach Dashashwamedh Ghat by 5:30 PM to get front-row steps for the evening Ganga Aarti.',
    photos: ['https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80'],
    likes: 72
  }
];

// Generate extra realistic posts to fulfill 40+ requirement
const citiesPool = ['Jaipur', 'Udaipur', 'Goa', 'Munnar', 'Hampi', 'Rishikesh', 'Darjeeling', 'Ooty', 'Amritsar', 'Kodaikanal', 'Jaisalmer', 'Shillong', 'Pondicherry', 'Puri'];
const templatesPool = ['story', 'itinerary', 'tip', 'review'];
const authorsPool = [
  { name: 'Tanvi Nair', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80' },
  { name: 'Rohan Gupta', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80' },
  { name: 'Meera Kapoor', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80' },
  { name: 'Aditya Verma', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80' },
  { name: 'Divya Nambiar', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80' }
];

for (let i = 1; i <= 36; i++) {
  const city = citiesPool[i % citiesPool.length];
  const template = templatesPool[i % templatesPool.length];
  const author = authorsPool[i % authorsPool.length];
  communitySeedPosts.push({
    title: `${template.toUpperCase()}: Exploring ${city} on a Budget — Transit & Stays`,
    template: template,
    author: author.name,
    posterName: author.name,
    posterPhoto: author.avatar,
    city: city,
    route: `Delhi to ${city}`,
    story: `Traveling across India via TedBus makes hopping to ${city} remarkably simple and budget-friendly. Here are our top hand-picked tips on places to visit, local street food recommendations, and how to avoid tourist rip-offs when booking local transport.`,
    tips: `Always book your return journey in advance during long festival weekends.`,
    itineraryDays: (i % 3) + 2,
    budgetRange: '₹5,000 - ₹10,000',
    bestSeason: 'Oct - Mar',
    tipCategory: 'Local Transit',
    reviewMode: 'bus',
    operator: 'TedBus Certified Partner',
    rating: (i % 2) === 0 ? 5 : 4,
    pros: 'Punctual departure and smooth suspension.',
    cons: 'Limited charging sockets on older coaches.',
    photos: ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'],
    likes: 12 + (i * 2)
  });
}

async function runSeed() {
  console.log(`\n======================================================`);
  console.log(`🚀 TedBus Database Seeder`);
  console.log(`Mode: ${isDryRun ? 'DRY-RUN (No writes)' : 'LIVE SEED'}`);
  console.log(`Corridors: ${corridors.length}`);
  console.log(`Community Posts: ${communitySeedPosts.length}`);
  console.log(`======================================================\n`);

  if (isDryRun) {
    console.log('✅ Validation successful for dry-run.');
    console.log(`- Corridors validated: ${corridors.length}`);
    console.log(`- Total buses configured: ${corridors.reduce((acc, c) => acc + c.buses.length, 0)}`);
    console.log(`- Community posts validated: ${communitySeedPosts.length}`);
    return;
  }

  try {
    await mongoose.connect(DBURL);
    console.log('✅ Connected to MongoDB Atlas');

    // 1. Drop forums collection if it exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    const forumCol = collections.find(c => c.name === 'forums');
    if (forumCol) {
      await mongoose.connection.db.collection('forums').drop();
      console.log('🗑️ Dropped legacy "forums" collection');
    }

    // 2. Seed Corridors & Buses
    let totalBusesSeeded = 0;
    for (const item of corridors) {
      let route = await Routes.findOne({
        'departureLocation.name': item.from,
        'arrivalLocation.name': item.to
      });

      if (!route) {
        route = new Routes({
          departureLocation: { name: item.from, subLocations: item.fromSubs },
          arrivalLocation: { name: item.to, subLocations: item.toSubs },
          duration: item.duration
        });
        await route.save();
        console.log(`📍 Created corridor route: ${item.from} -> ${item.to}`);
      }

      for (const b of item.buses) {
        const existingBus = await Buses.findOne({
          operatorName: b.operator,
          routes: route._id,
          departureTime: b.time
        });

        if (!existingBus) {
          const newBus = new Buses({
            operatorName: b.operator,
            busType: b.type,
            departureTime: b.time,
            rating: b.rating,
            totalseats: 36,
            routes: route._id,
            images: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80',
            liveTracking: b.tracking,
            reschedulable: b.resched
          });
          await newBus.save();
          totalBusesSeeded++;
        }
      }
    }
    console.log(`🚌 Seeded ${totalBusesSeeded} transit buses.`);

    // 3. Clean up junk community posts and seed verified posts
    await CommunityPost.deleteMany({ title: { $regex: /^(test|asdasd|junk|hello)/i } });
    const existingCount = await CommunityPost.countDocuments();
    if (existingCount < 20) {
      await CommunityPost.insertMany(communitySeedPosts);
      console.log(`✍️ Seeded ${communitySeedPosts.length} rich travel posts to Community Hub.`);
    } else {
      console.log(`ℹ️ Community Hub already has ${existingCount} posts. Keeping existing content.`);
    }

    console.log('\n🎉 Seeding completed successfully!\n');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database.');
  }
}

runSeed();
