export type Category = "birthday" | "pickleball" | "jewelry" | "mugs" | "anniversary" | "decor";

export type Listing = {
  /** Real Etsy listing ID; etsy.com/listing/<id> is the source. */
  id: string;
  category: Category;
  title: string;
  shop: string;
  price: number; // USD
  rating: number;
  reviewCount: number;
  /** Paths under /public. */
  images: string[];
  isHandmade: boolean;
  isCustom: boolean;
  materials: string;
  description: string;
  /** Written by our team, not Etsy. Enhanced Search matches buyer intent against these. */
  tags: {
    occasion: string[];
    recipient: string[];
    interests: string[];
    style: string[];
  };
};
