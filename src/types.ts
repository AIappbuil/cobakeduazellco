export interface MenuItem {
  id: string;
  name: string;
  category: 'specialty' | 'espresso' | 'manual' | 'pastry';
  price: number;
  description: string;
  tastingNotes: string[];
  intensity: number; // 1-5
  acidity: 'Low' | 'Medium' | 'High' | 'None';
  origin: string;
  imageUrl: string;
  isHotAvailable: boolean;
  isIceAvailable: boolean;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  rating: number; // 1-5
  reviewText: string;
  favoriteDrink: string;
  date: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'indoor' | 'outdoor' | 'slowbar';
}

export interface BookingSubmission {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: 'indoor-main' | 'slow-bar' | 'garden-glasshouse';
  specialRequests?: string;
  pairingClass: boolean; // Virtual Barista pairing private workshop option
}
