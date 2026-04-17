/* =============================================
   TAW — STATIC DATA (rewards, events, partners)
   ============================================= */

// ── Rewards Data ──
const rewardsData = {
  'costa': {
    category: 'Food & Drink',
    title: '50% off any beverage',
    points: 600,
    brandName: 'Costa Coffee Bahrain',
    description: 'Enjoy any beverage at 50% off when you redeem your hard-earned points. Valid for all hot and cold drinks across all Costa Coffee locations in Bahrain.',
    expires: '31/12/2026',
    usage: 'One-time Use',
    terms: [
      'One-time use only. Cannot be combined with other offers or loyalty cards.',
      'Valid until Dec 31, 2026, across all participating Costa Coffee outlets in Bahrain.',
      'Redemption is subject to availability and store operating hours.'
    ],
    heroImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFtjGjJBz4rKkpBZxWX4R69lDkfogiml87c2Vl_SzCsHeGqpDS-6b8GfbvIumqJ5PREXi5Hr6vkAbDB0n02QpHp7YAMG1wWUrrD6yrcS1FLPAnRGKvE9VMZnVpOMi6YLyk6rW0dkIdcPXvf8owJIS6BdhGXs24zYgLxHI8GanMJNervJXF9Ap-qyDWPgfwbgOEXpvvZ7LEpLkkek68fg0znlvZehGZt8QTYuPxbjDYGtzkDOPIm_NhsPMxgv45ET9kxJbWF11xK5qB',
    logoHtml: '<div style="background-color: #630D16; color: white; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">COSTA</div>',
    howToUse: 'Present this screen to the barista before ordering. The discount applies to any single beverage on the menu.'
  },
  'jasmis': {
    category: 'Dining',
    title: 'Free appetizer',
    points: 600,
    brandName: "Jasmi's",
    description: "Get a free appetizer of your choice with any main meal purchase. A perfect way to start your dining experience at local favorite Jasmi's.",
    expires: '15/05/2026',
    usage: 'One-time Use',
    terms: [
      'Valid with purchase of any main meal.',
      'Only one redemption per day per user.',
      "Available at selected Jasmi's branches in Bahrain."
    ],
    heroImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBr5rg6vflFvo-fB0JVX2vXLcH8L8scDJ3yOhvnSuL5pg3fy8SPF-DjSZZZiO7S0yCN009FAgDfgeOwzgb_L_QPJTKe9l6mWO2g5FffHugypjMPUAKCNWWMvr9hbVNwzKeXvxFrU0jI3ALemhcUMELASjAEU2qyQR3yNnsX-RQxQyKPIrlgOuliNf5e2-3pAqoricmilnsM8n6iN3R-xHU99X9lLftGSyJ63-9bC8nb8ce4GCyRiOqjdylbfMXYlArWl45_bJZBhA-r',
    logoHtml: '<img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZWPP07ryMiii7qOE_trAEcai39fESiIR-i5shbsivT4nj755_JaMnOB4BwNtAJzqvW0XEqo1j58fC37gORiSJR0NHR2QfMHJihNG4rdhqnZ8QKRzynh7s78DkUBDq7Ea7AZAOE1YrfAhOD_a-wLN7gX966gBbJjajVbsaaDKF1em8pMf2XnLzFbipRm75iHICBo6HOJ6jNOXqRG8_JXk4cXU7bB9hSWcEmezorEyit3loVpBKG-cA-y3rYIcJ_CCB6wvc8e6ZDpyT" alt="Jasmis" />',
    howToUse: "Show this screen to your server before ordering. The free appetizer will be applied with any main meal purchase."
  },
  'dining': {
    category: 'Dining',
    title: '25% off Total Bill',
    points: 800,
    brandName: 'Premium Dining Partner',
    description: 'Enjoy a 25% discount on your entire bill at our premium dining partners across the kingdom. Treat yourself after making a difference in the community!',
    expires: '01/01/2027',
    usage: 'Multi-Use (up to 3x)',
    terms: [
      'Discount applies to food and beverages, excluding taxes.',
      'Maximum discount value is 25 BHD per visit.',
      'Present the QR redemption code before asking for the bill.'
    ],
    heroImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZrnDP-9nWUguc_yRbGaxTBrpzfxRqM_9QD32M5QACeaq5aJXFd2MuEfqK0dV4pLLAYleNVrKq8vNQkVy14glDGEKshTEqaxUbHtHOa5HRT_KyhmlJVAElum-aDlrehBMTwjCPhS5q5bL6RFIxQoUK-1G_dw2ZbjqH5dAQMEYGSp_wYYMLcXblV3sq9ahJZGsURYi_NEGAGzDG-qgs5k4pcVyYo2y9x0EtfQLMopjw3WE8pEQBuCmisi52RuJBQAHlHQY9nHVbnCj_',
    logoHtml: '<div style="background-color: var(--primary); color: white; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;"><span class="material-icons-round" style="font-size:20px;">restaurant</span></div>',
    howToUse: 'Show this screen to your server before asking for the bill. The QR code will be scanned to apply the 25% discount.'
  }
};

// ── Events Data ──
const eventsData = {
  'marine-cleanup': {
    title: 'Marine Cleanup: Malkiya Beach',
    orgName: 'Bahrain Ocean Society',
    orgType: 'Environmental Group',
    orgLogo: '🌊',
    date: 'April 5, 2026',
    time: '9:00 AM — 12:00 PM',
    location: 'Malkiya Beach, Bahrain',
    volunteers: '32 / 40 spots filled',
    points: '+50 Points',
    desc: 'Join us at Malkiya beach to clear plastic waste and marine debris from the coastline. Gloves and garbage bags will be provided.',
    heroImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoXGK4NJKVaXa3tyxKQHvjTJAmN7mOlBKMZJ4mrBd8PmdcmF3BMiUZLkZ3Z5VFfEH_51H4WUQHz60BdasN5V5HmRfUq-PLZ_K9lnoh9qu1_3CITzJyP0syWtGylLMdKehMyDOW2aXdi5mrvjiIYfs8DIlAyYHB2maQpnz7fy699uA-E-Qz37qMuR82wvtQta2GZTsei-M55c8_Y-kWJSmaefRIW3ssSwbjbkDLK7TeVfcJRUCI_qqlxtwHklppN3djBq1NU4r70Lk-',
    mapLabel: 'Malkiya Beach'
  },
  'evening-tea': {
    title: 'Evening Tea at Muharraq Care Home',
    orgName: 'Social Care Society',
    orgType: 'Elderly Support',
    orgLogo: '🫖',
    date: 'Today, April 1',
    time: '6:00 PM — 8:00 PM',
    location: 'Muharraq, Bahrain',
    volunteers: '5 / 10 spots filled',
    points: '+100 Points',
    desc: 'Spend two hours serving tea, talking with the elderly, and bringing a smile to their day. Board games are welcome!',
    heroImg: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80',
    mapLabel: 'Muharraq Care Home'
  },
  'math-help': {
    title: 'Math Help for Secondary Students',
    orgName: 'Bahrain Tutors Association',
    orgType: 'Education',
    orgLogo: '📚',
    date: 'Wednesday, April 3',
    time: '4:00 PM — 6:00 PM',
    location: 'Online Workshop',
    volunteers: '12 / 20 spots filled',
    points: '+150 Points',
    desc: 'Help secondary school students study for their upcoming math exams. We will review algebra, geometry, and calculus basics.',
    heroImg: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    mapLabel: 'Online Link Provided'
  },
  'beach-cleanup': {
    title: 'Coastal Beach Cleanup',
    orgName: 'Bahrain Ocean Society',
    orgType: 'Environmental Group',
    orgLogo: '🌊',
    date: 'Tomorrow, April 2',
    time: '8:00 AM — 11:00 AM',
    location: 'Manama, Bahrain',
    volunteers: '8 / 12 spots filled',
    points: '+200 Points',
    desc: 'Help restore the Manama coastline by participating in our early morning beach cleanup.',
    heroImg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    mapLabel: 'Manama Coastline'
  },
  'food-drive': {
    title: 'Ramadan Food Drive',
    orgName: 'Bahrain Red Crescent',
    orgType: 'Humanitarian Organization',
    orgLogo: '🌙',
    date: 'April 5, 2026',
    time: '4:00 PM — 7:00 PM',
    location: 'Riffa, Bahrain',
    volunteers: '5 / 12 spots left',
    points: '+150 Points',
    desc: 'Prepare and pack food boxes for families in need during the holy month of Ramadan.',
    heroImg: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80',
    mapLabel: 'Riffa Distribution Center'
  },
  'tree-planting': {
    title: 'Tree Planting at Al Areen Wildlife Reserve',
    orgName: 'Bahrain Red Crescent',
    orgType: 'Humanitarian Organization',
    orgLogo: '🌙',
    date: 'April 10, 2026',
    time: '5:00 PM — 8:00 PM',
    location: 'Al Areen, Bahrain',
    volunteers: '24 / 40 spots filled',
    points: '+300 Points',
    desc: "Join us for a meaningful morning of planting native trees at the beautiful Al Areen Wildlife Reserve. Help restore Bahrain's natural greenery and contribute to a sustainable future.",
    heroImg: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
    mapLabel: 'Al Areen Wildlife Reserve'
  },
  'amwaj-cleanup': {
    title: 'Beach Cleanup — Amwaj',
    orgName: 'Amwaj Communities',
    orgType: 'Environmental Group',
    orgLogo: '🌊',
    date: 'April 18, 2026',
    time: '7:00 AM — 10:00 AM',
    location: 'Amwaj Islands, Bahrain',
    volunteers: '12 / 20 spots filled',
    points: '+150 Points',
    desc: "Help keep our island beautiful. We will be cleaning the main public beach at Amwaj to protect marine life. Garbage bags and breakfast provided.",
    heroImg: 'https://images.unsplash.com/photo-1618477461853-cf6ed80f4886?auto=format&fit=crop&w=600&q=80',
    mapLabel: 'Amwaj Public Beach'
  },
  'elderly-visit': {
    title: 'Elderly Care Visit',
    orgName: 'Social Care Society',
    orgType: 'Elderly Support',
    orgLogo: '🫖',
    date: 'April 20, 2026',
    time: '10:00 AM — 12:00 PM',
    location: 'Muharraq, Bahrain',
    volunteers: '5 / 10 spots filled',
    points: '+100 Points',
    desc: "Spend your morning visiting the elderly at the Muharraq Care Home. A little conversation goes a long way to brighten their day.",
    heroImg: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80',
    mapLabel: 'Muharraq Care Home'
  },
  'literacy-workshop': {
    title: 'Literacy Workshop',
    orgName: 'Bahrain Education Initiative',
    orgType: 'Education',
    orgLogo: '📚',
    date: 'April 25, 2026',
    time: '4:00 PM — 6:00 PM',
    location: 'Isa Town Community Center',
    volunteers: '8 / 20 spots filled',
    points: '+120 Points',
    desc: "Assist teachers in running reading exercises for young learners. No prior teaching experience required, just patience and enthusiasm.",
    heroImg: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
    mapLabel: 'Isa Town Center'
  },
  'blood-donation': {
    title: 'Blood Donation Drive',
    orgName: 'Salmaniya Medical Complex',
    orgType: 'Health Services',
    orgLogo: '🩸',
    date: 'April 28, 2026',
    time: '9:00 AM — 2:00 PM',
    location: 'Salmaniya Hospital, Bahrain',
    volunteers: '10 / 30 spots filled',
    points: '+180 Points',
    desc: "Your blood can save a life. Join our weekend massive blood donation drive in coordination with the Ministry of Health. Refreshments provided after donation.",
    heroImg: 'https://images.unsplash.com/photo-1615461066159-fea0960485d5?auto=format&fit=crop&w=600&q=80',
    mapLabel: 'Salmaniya Hospital'
  },
  'meal-prep': {
    title: 'Community Meal Prep',
    orgName: 'Conserving Bounties Society',
    orgType: 'Community',
    orgLogo: '🍲',
    date: 'Tonight',
    time: '6:00 PM — 9:00 PM',
    location: 'Manama Central Kitchen',
    volunteers: '16 / 20 spots filled',
    points: '+250 Points',
    desc: "Help us prep, cook, and pack meals for families in need. We are recovering excess food from hotels and turning it into nutritious meals.",
    heroImg: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80',
    mapLabel: 'Manama Central Kitchen'
  }
};

// ── Partners Data ──
const partnersData = {
  mcdonalds: {
    name: "McDonald's",
    category: 'Quick Service Restaurant',
    rating: '4.8',
    offers: '12',
    heroImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfVFcH9tHoyKH_yxW7XySvetBsODgGCpYCGGpIFytknG5kAumwBVWeqDP9AiFNjlYCToceemSzc_91WfuFnx86Qg9T_UZ34cnwt7lDoo6QrP4kMv5kzudKkuXJ5PW3qevDlCkIHNoxwiHgoNt8_0vYuW0gfq1ihdj0n8OHbA_2xMLxe0bLxpTGZibY3OQb6yWL05X5chU5F9n96ZYVolMKRedMGo3MZm6r0tcpAEwUGlOnhuwLfluDvtMqKJbqrlx4xmMKudAxF5AW',
    logoImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi7lyUus2XH1sdEuX1hNeQnVeaN52Y-NrXzWeCQaVp-oN41FdETNtW49RXJkpxLbS8F8HexN_PWxAGGFWBnNLPF86vqZhMXmxxpKfumSdK9gKSGHBwepSSAlMi34DE-2FO7bJLslsgLu-5-GlVjZvHAJUBq3eGRjff2-jkGvoqSn9-JEoYV-kv1o1IEF4Ci7rX8UXAe13wV-ZPT3WkeI_O2QhY9_4C3351kYgcj3Hpgb3B_YWHcYpQO03DFXinW1iqNsYNY0ucv52Y',
    civicText: "McDonald's Bahrain has been a pillar of our civic tapestry since 2024. For every meal claimed through Taw, they contribute to local community gardens across the Kingdom, fueling the spirit of giving back.",
    rewards: [
      { title: 'Free Appetizer', taw: '350', desc: 'With any meal purchase. Valid at all branches.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAa-2DF20X_XvZK38m3zxANqiDY5wCN0t6_jNZmKJrVegE1XXClu7T_OkaxfVJAlOTelk1h_gwyNLS2Ef_nzun2tMZOnjFvbEdBDytsFrjhWCrP2afqkc9AKwcPNuJzwibUm4jKhM5adg_Br8nC42D30n04FfcMh_LXcOd5SKEMuk4sbmApJSBIsjBjfvnZR4qN55SSxAv-QOmnoz7X9RvHco1zXUqcO57ZSaYEnrYYby5-abPELPuae9bW4SSpLcuExCQouhdue81F' },
      { title: '20% off Family Meal', taw: '850', desc: 'Valid on Share Box items. Perfect for weekend gatherings.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA70PGT329JdoGjNHR4R-mdsTP_NLI0piNox_QuSx1VMbpe-lOsijPnLG0WkCcJiALZnMumfFefvpUcK3oYHuNWLTo4wWpKP4kRc-iYeSHWZjpWU9TGx-ol28cE1FxAoyCgKqxURslvaMJOTTR0oIS8mVYKERuEsVOaaY3QT6Awfvs9HaWCvI4Kzz13qSV0Ul14aJBkAgNsQLJlHKkq4lY81Vhr8f7n6UqWfBcAMpPJAKY-Wt-YTQCvYn_waQiTJT53Qh2IuOHKtHM-' },
      { title: 'Free McFlurry', taw: '500', desc: 'Any flavor available. Limited time offer.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBaeKnvXWax3ZcGLKi76HdMXqYbnqM10JdB3aqat48yE9t1hVKBlq4vMaXVQs4HaVGOGyuRLdT8IFrA89xFEYBnVBS6FsGhLegn2NciafjI4AGjfzHCCELRWFC3uGKISMt25g_bUmFvLEnHHHHqmM1QFHR5x36uwzlozVEjFu10I08yEYOE6ZJYFJHVxPlg0pAyXYMamUcL51ZGATeIuN_35HieqvUunfsdzWCExaj_uMUAF7SLk1EbuKEZ3Eo_PEcJQQSU_5Jd' },
    ],
    branches: '4 locations within 5km of you'
  },
  barns: {
    name: "Barn's",
    category: 'Specialty Coffee',
    rating: '4.9',
    offers: '8',
    heroImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTptBM-8aBu7BS0QfocOMNoq4PzXBzxMn3duWzS91Y6gLAP9-VprawMdQpPRyNkAN8C0BkeQi14pN6qaldwUOIJJuOJscU-ulAWyYViQWvdTNuGCavnlIVeJ_44yghFWoHKpgc3iEKCwd7w7FF3mOz8GP0hhm7P9hF4vS1gTt2Im7FXGdpFHBAYz93f3VfWPuGciTsZbQYRLabgVcy9YjSSCBezBL4TBpCJQvpa9JNA85-6DxJROx_89RTLAFqb_wVdIKvAlsSXX4K',
    logoImg: '',
    logoIcon: 'local_cafe',
    civicText: "Barn's Café supports local youth barista programs through Taw. Every beverage you claim helps fund coffee craft training for young Bahrainis, building community one cup at a time.",
    rewards: [
      { title: 'Free Special Latte', taw: '250', desc: 'Rich espresso with creamy textured milk. Any size.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTptBM-8aBu7BS0QfocOMNoq4PzXBzxMn3duWzS91Y6gLAP9-VprawMdQpPRyNkAN8C0BkeQi14pN6qaldwUOIJJuOJscU-ulAWyYViQWvdTNuGCavnlIVeJ_44yghFWoHKpgc3iEKCwd7w7FF3mOz8GP0hhm7P9hF4vS1gTt2Im7FXGdpFHBAYz93f3VfWPuGciTsZbQYRLabgVcy9YjSSCBezBL4TBpCJQvpa9JNA85-6DxJROx_89RTLAFqb_wVdIKvAlsSXX4K' },
      { title: '50% Off Any Cold Brew', taw: '150', desc: 'Valid Monday–Thursday. Dine-in only.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPU-C1XtloCXOdralqFDiUc3ibXu1fIj-btClXRIrv4oOUeU6TvOBFPG4APE_g_bZ7RoTLxUyryzHxRplWAkaz4zHXhYE1QewsrXDipnD1OU-pBNDFeGgAZjSesEyhKNAuHKnzcKTBHE65OOe0Q-KzraqG2J2nd3s393kVgD7ZCzWNukiuvbvQ4atJ0kUQpnhJ22qzk8exCgKTni0KvYsMvyjHegZ_pu9ooR7IZhobzOhuxyYdQlNzDehAYwlCXTtfeqGa55iPBmBt' },
    ],
    branches: '6 locations across Bahrain'
  },
  odaburger: {
    name: 'Oda Burger',
    category: 'Burger Restaurant · Jid-Ali',
    rating: '4.9',
    offers: '3',
    heroImg: 'Oda Burger.jpg',
    logoImg: 'Oda Burger.jpg',
    civicText: 'Oda Burger is a proud local brand from Jid-Ali, Bahrain. As a Taw partner, they support community events and local youth initiatives, proving that great burgers and a great community go hand in hand.',
    rewards: [
      { title: 'Free Drink', taw: '150', desc: 'Get a free cold drink with any burger order. Valid on delivery and pickup.', img: 'Oda Burger.jpg' },
      { title: 'Double Smash Deal', taw: '400', desc: '2 Double Smash Beef Burgers at a special Taw price.', img: 'Oda Burger.jpg' },
      { title: 'Free Size Upgrade', taw: '200', desc: 'Upgrade any meal to large for free. One per order.', img: 'Oda Burger.jpg' },
    ],
    branches: '1 location in Jid-Ali, Bahrain · Orders via Instagram @oda_burger.s'
  },
  reelcinemas: {
    name: 'Reel Cinemas',
    category: 'Entertainment',
    rating: '4.6',
    offers: '5',
    heroImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-DRDJjbzGxE3oJGXPFFoqdXJM54Qvb6cMcaRy_Qr16nNJF-gqXE1Y7751xTMbBSXT6JpWMCWXXekzqf58rUXI9UmSo25lD2DQzDqtxQd2eYukneyE0Ygi-QMSM2T_gDO5OuOFQQbTcUPu-bU4xkl1ftAcoqMch7NLjpdcUSZNXEfS74wrdXVQyM-o3eZGjJ58rN9KCVBWvZYvi4m2XcH_UU8nQlUStAtZ5hdXfau6MlwRnDM4lLy_29VrnxtIkIkdfpJRaeGnod-5',
    logoImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-1T77y33s7qzZhtJ3WnRb42e_tBbozBNAJg9Zl3aY7_7r4XeyPNkPOfM6jrOHOgI2sIzCvSGGxeyLmqZpm_8Em5bfPiCPV4ordcze9zXP0TSmoWbjXupxbtG_dNP5lVFNmcDel2SWK9gbtIrqsFJkmGM1kTn76C0vY1bQscF37FpJiR46v9-z8CtCalY9x9pCeGWUFbFuN2wz7AmCnlaAY8pARVQk5CLS-zR5V8o8lT4CMX4_W110mgfbih5albqBz7nHJ6NK5fsH',
    civicText: 'Reel Cinemas partners with Taw to make culture accessible. A portion of every redeemed ticket goes toward free cinema screenings for underprivileged children in Bahrain.',
    rewards: [
      { title: 'Buy 1 Get 1 Free', taw: '450', desc: 'Standard 2D movie tickets. Valid weekdays.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-DRDJjbzGxE3oJGXPFFoqdXJM54Qvb6cMcaRy_Qr16nNJF-gqXE1Y7751xTMbBSXT6JpWMCWXXekzqf58rUXI9UmSo25lD2DQzDqtxQd2eYukneyE0Ygi-QMSM2T_gDO5OuOFQQbTcUPu-bU4xkl1ftAcoqMch7NLjpdcUSZNXEfS74wrdXVQyM-o3eZGjJ58rN9KCVBWvZYvi4m2XcH_UU8nQlUStAtZ5hdXfau6MlwRnDM4lLy_29VrnxtIkIkdfpJRaeGnod-5' },
      { title: 'Popcorn + Drink Combo', taw: '200', desc: 'Large popcorn and any cold drink. Valid with any ticket.', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq8kmQSxtw07XupuUof5PPGW3AcZQTR58cbsamB-GH4EXmHiSHHmh76Y7OVj3oMHA3TYQk5R2buaovmT3gRfmj4CexYQPmTllFElaiCy4f1YRPAz3Bf53HK8Oyyr52NeQ4twauRXqHoav_wkdIjEeSKpPvPAbjF2WmJ2C6Ae2z0AiZUbAnWA3vBptZYF_pi2Z100ajCDy1P-OqrLViscZv2b29uaqfFRUfXRDPHBjCUsVKOsJG0Gr9TKQnozrebhYVHs54bwckLqGo' },
    ],
    branches: '2 locations in Bahrain City Centre & Avenues'
  }
};
