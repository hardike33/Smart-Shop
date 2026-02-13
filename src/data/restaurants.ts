// Food images
import vegThali from '@/assets/food/veg-thali.jpg';
import paneerButterMasala from '@/assets/food/paneer-butter-masala.jpg';
import rajmaChawal from '@/assets/food/rajma-chawal.jpg';
import chapati from '@/assets/food/chapati.jpg';
import jeeraRice from '@/assets/food/jeera-rice.jpg';
import grilledVegSalad from '@/assets/food/grilled-veg-salad.jpg';
import chickenProteinSalad from '@/assets/food/chicken-protein-salad.jpg';
import vegWrap from '@/assets/food/veg-wrap.jpg';
import paneerWrap from '@/assets/food/paneer-wrap.jpg';
import fruitBowl from '@/assets/food/fruit-bowl.jpg';
import homeVegMeals from '@/assets/food/home-veg-meals.jpg';
import chickenCurryRice from '@/assets/food/chicken-curry-rice.jpg';
import rasamRice from '@/assets/food/rasam-rice.jpg';
import curdRice from '@/assets/food/curd-rice.jpg';
import eggOmelette from '@/assets/food/egg-omelette.jpg';
import chickenBiryani from '@/assets/food/chicken-biryani.jpg';
import muttonBiryani from '@/assets/food/mutton-biryani.jpg';
import vegBiryani from '@/assets/food/veg-biryani.jpg';
import chicken65 from '@/assets/food/chicken-65.jpg';
import boiledEggs from '@/assets/food/boiled-eggs.jpg';
import plainDosa from '@/assets/food/plain-dosa.jpg';
import masalaDosa from '@/assets/food/masala-dosa.jpg';
import onionUttapam from '@/assets/food/onion-uttapam.jpg';
import idli from '@/assets/food/idli.jpg';
import vada from '@/assets/food/vada.jpg';
import biryaniHD from '@/assets/food/biryani-hd.png';
import southIndianHD from '@/assets/food/south-indian-hd.png';
import northIndianThaliHD from '@/assets/food/north-indian-thali-hd.png';
import freshBitesHD from '@/assets/food/fresh-bites-hd.png';
import mamasHomeFoodHD from '@/assets/food/mamas-home-food-hd.png';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  isPopular?: boolean;
  category: string;
}

export interface RestaurantData {
  id: string;
  name: string;
  emoji: string;
  imageUrl?: string;
  rating: number;
  reviewCount: number;
  cuisines: string[];
  deliveryTime: string;
  deliveryFee: number;
  distance: string;
  isHomeMade: boolean;
  priceRange: 1 | 2 | 3;
  menu: MenuItem[];
}

export const restaurantsData: RestaurantData[] = [
  {
    id: '1',
    name: 'Sharma Kitchen',
    emoji: '🍛',
    imageUrl: 'https://images.unsplash.com/photo-1626777553767-463df4740f95',
    rating: 4.5,
    reviewCount: 234,
    cuisines: ['Home-Made', 'North Indian', 'Thali'],
    deliveryTime: '25-30 min',
    deliveryFee: 0,
    distance: '1.5 km',
    isHomeMade: true,
    priceRange: 1,
    menu: [
      {
        id: '1-1',
        name: 'Veg Thali',
        description: 'Roti, rice, dal, mixed veg curry, curd & pickle',
        price: 120,
        image: vegThali,
        isVeg: true,
        isPopular: true,
        category: 'Thali',
      },
      {
        id: '1-2',
        name: 'Paneer Butter Masala',
        description: 'Creamy paneer curry with rich gravy',
        price: 150,
        image: paneerButterMasala,
        isVeg: true,
        isPopular: true,
        category: 'Main Course',
      },
      {
        id: '1-3',
        name: 'Rajma Chawal',
        description: 'Home-style rajma with steamed rice',
        price: 110,
        image: rajmaChawal,
        isVeg: true,
        isPopular: true,
        category: 'Main Course',
      },
      {
        id: '1-4',
        name: 'Chapati (2 pcs)',
        description: 'Fresh homemade wheat flatbread',
        price: 30,
        image: chapati,
        isVeg: true,
        category: 'Breads',
      },
      {
        id: '1-5',
        name: 'Jeera Rice',
        description: 'Aromatic cumin flavored basmati rice',
        price: 80,
        image: jeeraRice,
        isVeg: true,
        category: 'Rice',
      },
    ],
  },
  {
    id: '2',
    name: 'Fresh Bites Cafe',
    emoji: '🥗',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    rating: 4.3,
    reviewCount: 189,
    cuisines: ['Healthy', 'Salads', 'Wraps'],
    deliveryTime: '25-30 min',
    deliveryFee: 0,
    distance: '2.1 km',
    isHomeMade: false,
    priceRange: 2,
    menu: [
      {
        id: '2-1',
        name: 'Grilled Veg Salad',
        description: 'Fresh veggies with light dressing',
        price: 140,
        image: grilledVegSalad,
        isVeg: true,
        isPopular: true,
        category: 'Salads',
      },
      {
        id: '2-2',
        name: 'Chicken Protein Salad',
        description: 'High-protein, low-oil meal',
        price: 180,
        image: chickenProteinSalad,
        isVeg: false,
        isPopular: true,
        category: 'Salads',
      },
      {
        id: '2-3',
        name: 'Veg Wrap',
        description: 'Stuffed with fresh veggies & sauce',
        price: 120,
        image: vegWrap,
        isVeg: true,
        isPopular: true,
        category: 'Wraps',
      },
      {
        id: '2-4',
        name: 'Paneer Wrap',
        description: 'Delicious paneer with fresh vegetables',
        price: 150,
        image: paneerWrap,
        isVeg: true,
        category: 'Wraps',
      },
      {
        id: '2-5',
        name: 'Fresh Fruit Bowl',
        description: 'Seasonal fresh cut fruits',
        price: 90,
        image: fruitBowl,
        isVeg: true,
        category: 'Healthy',
      },
    ],
  },
  {
    id: '3',
    name: "Mama's Home Food",
    emoji: '🍲',
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',
    rating: 4.8,
    reviewCount: 456,
    cuisines: ['Home-Made', 'Comfort Food'],
    deliveryTime: '30-35 min',
    deliveryFee: 0,
    distance: '0.8 km',
    isHomeMade: true,
    priceRange: 1,
    menu: [
      {
        id: '3-1',
        name: 'Home Veg Meals',
        description: 'Rice, sambar, poriyal & curd',
        price: 100,
        image: homeVegMeals,
        isVeg: true,
        isPopular: true,
        category: 'Meals',
      },
      {
        id: '3-2',
        name: 'Chicken Curry + Rice',
        description: 'Mild-spiced home-style chicken',
        price: 160,
        image: chickenCurryRice,
        isVeg: false,
        isPopular: true,
        category: 'Meals',
      },
      {
        id: '3-3',
        name: 'Rasam Rice',
        description: 'Tangy and spicy comfort food',
        price: 80,
        image: rasamRice,
        isVeg: true,
        category: 'Rice',
      },
      {
        id: '3-4',
        name: 'Curd Rice',
        description: 'Cool and refreshing yogurt rice',
        price: 70,
        image: curdRice,
        isVeg: true,
        category: 'Rice',
      },
      {
        id: '3-5',
        name: 'Egg Omelette (2 eggs)',
        description: 'Fluffy omelette with onions & chili',
        price: 60,
        image: eggOmelette,
        isVeg: false,
        category: 'Extras',
      },
    ],
  },
  {
    id: '4',
    name: 'Biryani House',
    emoji: '🍚',
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-1c459288350e',
    rating: 4.6,
    reviewCount: 567,
    cuisines: ['Biryani', 'Mughlai'],
    deliveryTime: '35-40 min',
    deliveryFee: 0,
    distance: '0.8 km',
    isHomeMade: false,
    priceRange: 2,
    menu: [
      {
        id: '4-1',
        name: 'Chicken Biryani',
        description: 'Aromatic basmati rice with tender chicken',
        price: 180,
        image: chickenBiryani,
        isVeg: false,
        isPopular: true,
        category: 'Biryani',
      },
      {
        id: '4-2',
        name: 'Mutton Biryani',
        description: 'Rich and flavorful mutton biryani',
        price: 240,
        image: muttonBiryani,
        isVeg: false,
        isPopular: true,
        category: 'Biryani',
      },
      {
        id: '4-3',
        name: 'Veg Biryani',
        description: 'Fragrant rice with mixed vegetables',
        price: 140,
        image: vegBiryani,
        isVeg: true,
        isPopular: true,
        category: 'Biryani',
      },
      {
        id: '4-4',
        name: 'Chicken 65',
        description: 'Spicy crispy fried chicken appetizer',
        price: 120,
        image: chicken65,
        isVeg: false,
        category: 'Starters',
      },
      {
        id: '4-5',
        name: 'Boiled Egg (2 pcs)',
        description: 'Simple protein side',
        price: 30,
        image: boiledEggs,
        isVeg: false,
        category: 'Extras',
      },
    ],
  },
  {
    id: '5',
    name: 'South Express',
    emoji: '🥞',
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976',
    rating: 4.4,
    reviewCount: 321,
    cuisines: ['South Indian', 'Dosa'],
    deliveryTime: '20-25 min',
    deliveryFee: 0,
    distance: '3.2 km',
    isHomeMade: false,
    priceRange: 1,
    menu: [
      {
        id: '5-1',
        name: 'Plain Dosa',
        description: 'Crispy golden crepe with chutney & sambar',
        price: 50,
        image: plainDosa,
        isVeg: true,
        category: 'Dosa',
      },
      {
        id: '5-2',
        name: 'Masala Dosa',
        description: 'Crispy dosa with spiced potato filling',
        price: 70,
        image: masalaDosa,
        isVeg: true,
        isPopular: true,
        category: 'Dosa',
      },
      {
        id: '5-3',
        name: 'Onion Uttapam',
        description: 'Thick savory pancake topped with onions',
        price: 80,
        image: onionUttapam,
        isVeg: true,
        category: 'Uttapam',
      },
      {
        id: '5-4',
        name: 'Idli (2 pcs)',
        description: 'Soft steamed rice cakes with chutney',
        price: 40,
        image: idli,
        isVeg: true,
        isPopular: true,
        category: 'Tiffin',
      },
      {
        id: '5-5',
        name: 'Vada (1 pc)',
        description: 'Crispy savory donut-shaped fritter',
        price: 30,
        image: vada,
        isVeg: true,
        category: 'Tiffin',
      },
    ],
  },
];

export const getRestaurantById = (id: string): RestaurantData | undefined => {
  return restaurantsData.find((r) => r.id === id);
};
