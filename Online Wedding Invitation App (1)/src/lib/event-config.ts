export interface EventConfig {
  id?: string;
  // Event Details
  couple_names: string;
  event_type: string; // e.g., "Silver Anniversary", "Wedding", etc.
  event_date: string;
  event_time: string;
  venue_name: string;
  venue_address: string;
  dress_code: string;
  
  // Design
  primary_color: string;
  accent_color: string;
  hero_image_url: string;
  monogram_icon_url: string | undefined;
  monogram_icon_path: string | undefined;
  
  // Content
  welcome_message: string;
  event_description: string;
  additional_info: string;
  
  // RSVP Settings
  rsvp_deadline: string;
  show_meal_preferences: boolean;
  show_dietary_restrictions: boolean;
  show_song_requests: boolean;
  
  created_at?: string;
  updated_at?: string;
}

export const defaultEventConfig: EventConfig = {
  couple_names: "John & Jane",
  event_type: "Silver Anniversary Celebration",
  event_date: "2026-06-15",
  event_time: "6:00 PM",
  venue_name: "The Grand Ballroom",
  venue_address: "123 Celebration Ave, City, State 12345",
  dress_code: "Formal Attire",
  
  primary_color: '#334155',
  accent_color: '#94a3b8',
  hero_image_url: 'https://images.unsplash.com/photo-1768900044120-650653953a6a?w=1920',
  monogram_icon_url: undefined,
  monogram_icon_path: undefined,
  
  welcome_message: 'Join us for a celebration of love and 25 years together',
  event_description: "We would be honored to have you join us as we celebrate our Silver Anniversary with family and friends.",
  additional_info: "Reception to follow ceremony. Dinner and dancing included.",
  
  rsvp_deadline: "2026-05-15",
  show_meal_preferences: true,
  show_dietary_restrictions: true,
  show_song_requests: false,
};