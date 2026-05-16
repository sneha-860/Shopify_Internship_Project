const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');
const Review = require('./models/Review');
const Order = require('./models/Order');

const products = [
  {
    name: "Noir Absolu",
    brand: "Maison Élite",
    tagline: "Dark. Mysterious. Unforgettable.",
    description: "A rich oriental fragrance with deep notes of oud, black amber, and midnight rose. Perfect for evenings that demand presence and power.",
    price: 2999,
    sizes: [{ size: "30ml", price: 1999 }, { size: "50ml", price: 2999 }, { size: "100ml", price: 4999 }],
    category: "Oriental",
    badge: "Bestseller",
    rating: 4.7,
    reviewCount: 3,
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600'
    ]
  },
  {
    name: "Blanc de Soie",
    brand: "Lumière Paris",
    tagline: "Soft. Powdery. Eternally elegant.",
    description: "A delicate floral with notes of white peony, iris, and warm sandalwood. The scent of quiet luxury.",
    price: 3499,
    sizes: [{ size: "30ml", price: 2499 }, { size: "50ml", price: 3499 }, { size: "100ml", price: 5999 }],
    category: "Floral",
    badge: "New",
    rating: 4.5,
    reviewCount: 3,
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600',
      'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600'
    ]
  },
  {
    name: "Ambre Soleil",
    brand: "Désert Luxe",
    tagline: "Warm. Golden. Sun-drenched.",
    description: "An amber-forward fragrance layered with vanilla, cedarwood, and a hint of spiced saffron. A scent that lingers like a golden sunset.",
    price: 2499,
    sizes: [{ size: "30ml", price: 1499 }, { size: "50ml", price: 2499 }, { size: "100ml", price: 3999 }],
    category: "Amber",
    badge: "Limited",
    rating: 4.8,
    reviewCount: 3,
    images: [
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600',
      'https://images.unsplash.com/photo-1600612253971-8b28a2177f6f?w=600',
      'https://images.unsplash.com/photo-1601295452898-1dd1e1f99b91?w=600'
    ]
  },
  {
    name: "Vert Sauvage",
    brand: "Forêt Noire",
    tagline: "Fresh. Wild. Untamed.",
    description: "A green aromatic with notes of bergamot, crushed fig leaves, vetiver, and damp earth. For those who wear nature.",
    price: 1999,
    sizes: [{ size: "30ml", price: 1299 }, { size: "50ml", price: 1999 }, { size: "100ml", price: 3499 }],
    category: "Fresh",
    badge: "",
    rating: 4.3,
    reviewCount: 3,
    images: [
      'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=600',
      'https://images.unsplash.com/photo-1616949793459-e25ec15e2a23?w=600',
      'https://images.unsplash.com/photo-1583445095369-9c651e7e5d34?w=600'
    ]
  },
  {
    name: "Rose Eternelle",
    brand: "Maison Élite",
    tagline: "Bold. Romantic. Timeless.",
    description: "A modern rose fragrance enriched with oud, musk, and a whisper of patchouli. Not your grandmother's rose.",
    price: 3999,
    sizes: [{ size: "30ml", price: 2799 }, { size: "50ml", price: 3999 }, { size: "100ml", price: 6499 }],
    category: "Floral",
    badge: "Bestseller",
    rating: 4.9,
    reviewCount: 3,
    images: [
      'https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=600',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600',
      'https://images.unsplash.com/photo-1600528622304-1e6f5ec33100?w=600'
    ]
  },
  {
    name: "Citrus Atelier",
    brand: "Lumiere Paris",
    tagline: "Bright. Crisp. Effortlessly modern.",
    description: "A sparkling fresh fragrance with notes of Sicilian lemon, neroli, basil, and clean musk. Designed for warm afternoons and polished everyday wear.",
    price: 2199,
    sizes: [{ size: "30ml", price: 1399 }, { size: "50ml", price: 2199 }, { size: "100ml", price: 3699 }],
    category: "Fresh",
    badge: "New",
    rating: 4.4,
    reviewCount: 3,
    images: [
      'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600',
      'https://images.unsplash.com/photo-1600612253971-8b28a2177f6f?w=600',
      'https://images.unsplash.com/photo-1583445095369-9c651e7e5d34?w=600'
    ]
  },
  {
    name: "Velvet Oud",
    brand: "Arabesque House",
    tagline: "Smoky. Plush. Commanding.",
    description: "A deep oriental blend of aged oud, saffron, suede, and black vanilla. It opens boldly and settles into a refined, velvety trail.",
    price: 4599,
    sizes: [{ size: "30ml", price: 3199 }, { size: "50ml", price: 4599 }, { size: "100ml", price: 7499 }],
    category: "Oriental",
    badge: "Premium",
    rating: 4.9,
    reviewCount: 3,
    images: [
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600',
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600',
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600'
    ]
  },
  {
    name: "Jasmine Veil",
    brand: "Maison Bloom",
    tagline: "Radiant. Creamy. Feminine.",
    description: "An airy floral built around jasmine sambac, tuberose petals, peach skin, and cashmere woods. Soft enough for daytime, memorable enough for evenings.",
    price: 2799,
    sizes: [{ size: "30ml", price: 1799 }, { size: "50ml", price: 2799 }, { size: "100ml", price: 4699 }],
    category: "Floral",
    badge: "",
    rating: 4.6,
    reviewCount: 3,
    images: [
      'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600',
      'https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=600'
    ]
  },
  {
    name: "Golden Resin",
    brand: "Desert Luxe",
    tagline: "Honeyed. Textured. Addictive.",
    description: "A rich amber scent with labdanum, benzoin, honeyed resin, tonka bean, and cedar. Smooth, warm, and long lasting.",
    price: 3299,
    sizes: [{ size: "30ml", price: 2299 }, { size: "50ml", price: 3299 }, { size: "100ml", price: 5499 }],
    category: "Amber",
    badge: "Bestseller",
    rating: 4.7,
    reviewCount: 3,
    images: [
      'https://images.unsplash.com/photo-1601295452898-1dd1e1f99b91?w=600',
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600',
      'https://images.unsplash.com/photo-1600612253971-8b28a2177f6f?w=600'
    ]
  },
  {
    name: "Marine Iris",
    brand: "Coastal Notes",
    tagline: "Clean. Mineral. Serene.",
    description: "A fresh aquatic perfume with sea salt, iris, white tea, driftwood, and transparent musk. Minimal, cool, and quietly luxurious.",
    price: 2399,
    sizes: [{ size: "30ml", price: 1599 }, { size: "50ml", price: 2399 }, { size: "100ml", price: 4099 }],
    category: "Fresh",
    badge: "",
    rating: 4.2,
    reviewCount: 3,
    images: [
      'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=600',
      'https://images.unsplash.com/photo-1616949793459-e25ec15e2a23?w=600',
      'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=600'
    ]
  },
  {
    name: "Saffron Dusk",
    brand: "Nocturne Labs",
    tagline: "Spiced. Ambered. Magnetic.",
    description: "A twilight oriental with saffron, pink pepper, incense, amberwood, and smoked praline. Built for nights that need a little drama.",
    price: 3799,
    sizes: [{ size: "30ml", price: 2599 }, { size: "50ml", price: 3799 }, { size: "100ml", price: 6299 }],
    category: "Oriental",
    badge: "Limited",
    rating: 4.8,
    reviewCount: 3,
    images: [
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600',
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600'
    ]
  },
  {
    name: "Peony Muse",
    brand: "Maison Bloom",
    tagline: "Soft. Luminous. Charming.",
    description: "A graceful floral with pink peony, lychee, rosewater, sheer musk, and sandalwood. Light, romantic, and easy to wear.",
    price: 2599,
    sizes: [{ size: "30ml", price: 1699 }, { size: "50ml", price: 2599 }, { size: "100ml", price: 4299 }],
    category: "Floral",
    badge: "Gift Pick",
    rating: 4.4,
    reviewCount: 3,
    images: [
      'https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=600',
      'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600'
    ]
  },
  {
    name: "Vanilla Ember",
    brand: "Atelier Somme",
    tagline: "Creamy. Smoky. Comforting.",
    description: "A glowing amber vanilla layered with roasted tonka, myrrh, cedar smoke, and soft musk. Cozy without becoming too sweet.",
    price: 3099,
    sizes: [{ size: "30ml", price: 2099 }, { size: "50ml", price: 3099 }, { size: "100ml", price: 5199 }],
    category: "Amber",
    badge: "",
    rating: 4.6,
    reviewCount: 3,
    images: [
      'https://images.unsplash.com/photo-1600612253971-8b28a2177f6f?w=600',
      'https://images.unsplash.com/photo-1601295452898-1dd1e1f99b91?w=600',
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600'
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/perfume_shop');
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});

    const createdProducts = await Product.insertMany(products);

    const reviews = [];
    createdProducts.forEach(product => {
      reviews.push(
        {
          productId: product._id,
          author: "Priya S.",
          rating: 5,
          title: "Absolutely divine!",
          body: "This scent lasts all day and I get compliments everywhere I go.",
          date: new Date('2024-01-15')
        },
        {
          productId: product._id,
          author: "James L.",
          rating: 4,
          title: "Sophisticated scent",
          body: "Very elegant packaging and the fragrance itself is quite complex. Perfect for rainy days.",
          date: new Date('2024-02-10')
        },
        {
          productId: product._id,
          author: "Elena R.",
          rating: 5,
          title: "My new signature",
          body: "I've searching for a scent like this for years. It's balanced and truly luxurious.",
          date: new Date('2024-03-05')
        }
      );
    });

    await Review.insertMany(reviews);
    console.log(`Seeded ${createdProducts.length} products and ${reviews.length} reviews.`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDB();
