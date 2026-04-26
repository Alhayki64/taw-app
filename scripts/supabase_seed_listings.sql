-- Seed 5 realistic listings for Tawwa Volunteer App
-- Copy and paste this into the Supabase SQL Editor to insert the listings

INSERT INTO opportunities (
  title, 
  description, 
  category, 
  location, 
  points, 
  image_url, 
  is_urgent, 
  date, 
  org_name, 
  time_range, 
  spots, 
  spots_filled, 
  status
)
VALUES
(
  'Beach Cleanup — Amwaj Islands',
  'Join us to clean up the beautiful shores of Amwaj Islands. Equipment will be provided. Help us keep Bahrain clean and protect marine life.',
  'Environment',
  'Amwaj Islands, Bahrain',
  150,
  'https://images.unsplash.com/photo-1618477461853-cf6ed80fabe9?auto=format&fit=crop&q=80&w=600',
  false,
  '2026-05-10',
  'Bahrain Environment Society',
  '8:00 AM - 12:00 PM',
  20,
  0,
  'active'
),
(
  'Blood Donation Drive',
  'Donate blood and save lives. The Bahrain Red Crescent is organizing a blood donation drive at Salmaniya Medical Complex. Every drop counts in helping patients in need.',
  'Community',
  'Salmaniya Medical Complex',
  300,
  'https://images.unsplash.com/photo-1615461500146-212390d46d99?auto=format&fit=crop&q=80&w=600',
  true,
  '2026-05-02',
  'Bahrain Red Crescent',
  '9:00 AM - 3:00 PM',
  50,
  12,
  'active'
),
(
  'Ramadan Food Packing',
  'Help us pack and distribute food boxes to families in need during the holy month. A rewarding community effort for a great cause.',
  'Community',
  'Isa Town Community Center',
  100,
  'https://images.unsplash.com/photo-1594916898835-430c457388aa?auto=format&fit=crop&q=80&w=600',
  false,
  '2026-05-01',
  'Kaaf Humanitarian',
  'Ongoing',
  30,
  5,
  'active'
),
(
  'Youth Coding Workshop Assistant',
  'Assist instructors in teaching basic coding skills to youth aged 10-14. Basic programming knowledge is a plus but not required. Empower the next generation!',
  'Education',
  'Bahrain Polytechnic',
  200,
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600',
  false,
  '2026-05-17',
  'Bahrain Coding Academy',
  '4:00 PM - 7:00 PM',
  10,
  2,
  'active'
),
(
  'Tree Planting Initiative',
  'Contribute to a greener Bahrain by helping us plant native trees in the Sakhir area. Bring comfortable clothes and a hat. Let''s grow a forest together!',
  'Environment',
  'Sakhir, Bahrain',
  150,
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
  true,
  '2026-05-01',
  'National Initiative for Agricultural Development',
  '7:00 AM - 10:00 AM',
  25,
  8,
  'active'
);
