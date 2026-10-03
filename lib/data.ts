export type PersonStatus = "Active" | "Pending" | "Inactive"

export type Talent = {
  id: string
  name: string
  category: string
  email: string
  phone: string
  registeredOn: string
  genre: string
  location: string
  languages: string
  experience: string
  format: string
  tagline: string
  gender: string
  age: string
  about: string
  photo: string
  photos: string[]
  status: PersonStatus
  payout?: string
}

export type Vendor = {
  id: string
  name: string
  category: string
  email: string
  phone: string
  registeredOn: string
  preferred: string
  city: string
  state: string
  address: string
  about: string
  photo: string
  status: PersonStatus
  payout?: string
}

export type Client = {
  id: string
  name: string
  userType: string
  email: string
  phone: string
  registeredOn: string
  city: string
  state: string
  address: string
  about: string
  photo: string
  preferred: string
  status: PersonStatus
}

export type Product = {
  id: string
  title: string
  vendorId: string
  category: string
  type: "Rent" | "Fixed"
  pricePaise: number
  unit: string
  delivery: string
  location: string
  tagline: string
  description: string
  photo: string
  photos: string[]
  status: "Pending" | "Approved" | "Rejected"
  tags: string[]
}

export type Service = {
  id: string
  title: string
  ownerType: "vendor" | "talent"
  ownerId: string
  ownerName?: string
  category: string
  pricePaise: number
  unit: string
  city: string
  tags: string[]
  description: string
  photo: string
  status: "Active" | "Inactive"
  listingStatus?: string
  ratingAverage?: number
  ratingCount?: number
}

export type Booking = {
  id: string
  kind: "enquiry" | "booking"
  clientId: string
  clientName: string
  talentId?: string
  talentName?: string
  vendorId?: string
  vendorName?: string
  serviceId?: string
  productId?: string
  title: string
  category: string
  requirement: string
  start: string
  end: string
  budgetPaise: number | null
  upfrontPaise?: number
  remainingPaise?: number
  status: string
  tags: string[]
  city: string
  shootLocation?: string
  channel: "Web" | "App"
  payment: "Full online" | "25% online, cash" | "25% online, rest online"
  period: string
  project: string
  quantity?: number
  clientPhone?: string
  clientEmail?: string
  providerPhone?: string
  providerEmail?: string
  teamMemberId?: string
  teamMemberName?: string
}

export type Review = {
  id: string
  serviceId: string
  author: string
  rating: number
  text: string
  date: string
}

export type Category = {
  id: string
  name: string
  group: string
  description: string
  status: "Active" | "Inactive"
}

export type Lead = {
  id: string
  name: string
  leadType: "Talent" | "Vendor" | "Client"
  email: string
  phone: string
  date: string
  source: "Web" | "App"
  status: "Pending" | "Approved" | "Rejected"
}

export type Banner = {
  id: string
  platform: "Web" | "App"
  position: "Top" | "Middle" | "Bottom"
  title: string
  image: string
}

export type Plan = {
  id: string
  name: string
  audience: "Talent" | "Vendor" | "Client"
  duration: string
  pricePaise: number
  createdOn: string
  status: "Active" | "Inactive"
  description: string[]
  platform: "Web" | "App" | "Both"
}

export type Member = {
  id: string
  name: string
  email: string
  phone?: string
  city?: string
  place?: string
  role: string
  password: string
  status: "Active" | "Inactive"
}

export const platform = {
  users: 1436,
  activeTalent: 146,
  activeVendors: 146,
  pendingVendors: 5,
  pendingUsers: 5,
  pendingTalent: 5,
  grossPaise: 486000000,
  appMembershipPaise: 24000000,
  bookingsLastMonth: 186,
  activeUsers: 980,
}

export const bookingTrend = [
  { month: "Jan", successful: 1000, cancelled: 900 },
  { month: "Feb", successful: 1120, cancelled: 920 },
  { month: "Mar", successful: 1000, cancelled: 860 },
  { month: "Apr", successful: 920, cancelled: 880 },
  { month: "May", successful: 1250, cancelled: 930 },
  { month: "Jun", successful: 1080, cancelled: 910 },
  { month: "Jul", successful: 980, cancelled: 890 },
  { month: "Aug", successful: 950, cancelled: 870 },
  { month: "Sep", successful: 1050, cancelled: 910 },
]

export const distribution = {
  Talent: { total: 1212, segment: 1012 },
  Vendor: { total: 292, segment: 146 },
  Client: { total: 1436, segment: 890 },
}

const portfolio = ["/media/hero-1.jpg", "/media/hero-2.jpg", "/media/hero-3.jpg"]
const setShots = ["/media/hero-4.jpg", "/media/hero-5.jpg", "/media/hero-6.jpg"]

export const talentSeed: Talent[] = [
  {
    id: "t1",
    name: "Rohit Verma",
    category: "Actor",
    email: "rohit@reelora.in",
    phone: "+91 9283192701",
    registeredOn: "2025-09-22",
    genre: "Drama, Thriller",
    location: "New Delhi",
    languages: "English, Hindi",
    experience: "6 Yrs",
    format: "Tv Shows, Films",
    tagline: "Lead actor for drama and branded films",
    gender: "Male",
    age: "30",
    about: "Delhi-based actor available for full-day shoots, dialogue scenes and campaign films.",
    photo: "/media/actor.jpg",
    photos: portfolio,
    status: "Active",
  },
  {
    id: "t2",
    name: "Prachi Singh",
    category: "Model",
    email: "prachi@reelora.in",
    phone: "+91 9811122330",
    registeredOn: "2025-08-14",
    genre: "Fashion",
    location: "Mumbai",
    languages: "English, Hindi",
    experience: "4 Yrs",
    format: "Lookbooks, Ads",
    tagline: "Editorial and campaign model",
    gender: "Female",
    age: "26",
    about: "Books fashion, jewellery and lifestyle campaigns across Mumbai and Delhi.",
    photo: "/media/talent-1.jpg",
    photos: setShots,
    status: "Active",
  },
  {
    id: "t3",
    name: "Kabir Malhotra",
    category: "Photographer",
    email: "kabir@framehouse.in",
    phone: "+91 9900011122",
    registeredOn: "2025-07-02",
    genre: "Commercial",
    location: "Bengaluru",
    languages: "English, Kannada",
    experience: "8 Yrs",
    format: "Stills, Product",
    tagline: "Commercial stills and event coverage",
    gender: "Male",
    age: "34",
    about: "Photographer for product launches, weddings and brand lookbooks.",
    photo: "/media/photo.jpg",
    photos: ["/media/photo.jpg", "/media/gear-1.jpg", "/media/hero-2.jpg"],
    status: "Active",
  },
  {
    id: "t4",
    name: "Meera Joshi",
    category: "Makeup",
    email: "meera@glamunit.in",
    phone: "+91 9845012345",
    registeredOn: "2025-06-18",
    genre: "Bridal",
    location: "Hyderabad",
    languages: "English, Telugu, Hindi",
    experience: "7 Yrs",
    format: "Bridal, Film",
    tagline: "Film and bridal makeup",
    gender: "Female",
    age: "31",
    about: "On-set makeup for talent, brides and commercial casts.",
    photo: "/media/makeup.jpg",
    photos: ["/media/makeup.jpg", "/media/talent-3.jpg", "/media/hero-6.jpg"],
    status: "Pending",
  },
  {
    id: "t5",
    name: "Zara Khan",
    category: "Actress",
    email: "zara@reelora.in",
    phone: "+91 9765432108",
    registeredOn: "2025-09-01",
    genre: "Drama",
    location: "Mumbai",
    languages: "Hindi, English",
    experience: "5 Yrs",
    format: "Films, Web",
    tagline: "Screen actress for web and ads",
    gender: "Female",
    age: "28",
    about: "Available for speaking roles, hosted films and short-form ads.",
    photo: "/media/talent-3.jpg",
    photos: setShots,
    status: "Active",
  },
  {
    id: "t6",
    name: "Ishaan Rao",
    category: "Editor",
    email: "ishaan@cutroom.in",
    phone: "+91 9810098100",
    registeredOn: "2025-05-09",
    genre: "Commercial",
    location: "New Delhi",
    languages: "English, Hindi",
    experience: "9 Yrs",
    format: "Ads, Reels",
    tagline: "Offline editor for ads and event films",
    gender: "Male",
    age: "33",
    about: "Cuts campaign films, event highlights and social cuts with a two-day turnaround.",
    photo: "/media/editor.jpg",
    photos: ["/media/editor.jpg", "/media/hero-5.jpg", "/media/app-1.jpg"],
    status: "Active",
  },
]

export const vendorSeed: Vendor[] = [
  {
    id: "v1",
    name: "Framehouse Rentals",
    category: "Camera",
    email: "hello@framehouse.in",
    phone: "+91 9810011100",
    registeredOn: "2025-04-12",
    preferred: "Brands",
    city: "New Delhi",
    state: "Delhi",
    address: "11/22, CP",
    about: "Camera, lens and monitor rentals with same-day pickup in Delhi.",
    photo: "/media/vendor.jpg",
    status: "Active",
  },
  {
    id: "v2",
    name: "Northlight Studios",
    category: "Location",
    email: "book@northlight.in",
    phone: "+91 9820098200",
    registeredOn: "2025-03-20",
    preferred: "Productions",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Bandra West",
    about: "Daylight studio and rooftop locations for stills and small crews.",
    photo: "/media/hero-4.jpg",
    status: "Active",
  },
  {
    id: "v3",
    name: "Crewline",
    category: "Crew",
    email: "desk@crewline.in",
    phone: "+91 9900099000",
    registeredOn: "2025-02-11",
    preferred: "Events",
    city: "Bengaluru",
    state: "Karnataka",
    address: "Indiranagar",
    about: "Supplies camera assistants, gaffers and runners for shoot days.",
    photo: "/media/hero-2.jpg",
    status: "Pending",
  },
  {
    id: "v4",
    name: "Lumos Gear",
    category: "Lights",
    email: "rent@lumos.in",
    phone: "+91 9740011223",
    registeredOn: "2025-01-08",
    preferred: "Ads",
    city: "Hyderabad",
    state: "Telangana",
    address: "Jubilee Hills",
    about: "LED and tungsten packages with a van and a gaffer on request.",
    photo: "/media/gear-2.jpg",
    status: "Active",
  },
  {
    id: "v5",
    name: "Glam Unit",
    category: "Makeup",
    email: "studio@glamunit.in",
    phone: "+91 9845098450",
    registeredOn: "2025-08-01",
    preferred: "Talent",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Andheri East",
    about: "Makeup room and on-set artists for casts up to twelve.",
    photo: "/media/makeup.jpg",
    status: "Active",
  },
]

export const clientSeed: Client[] = [
  {
    id: "c1",
    name: "Manan Shah",
    userType: "Brand",
    email: "manan@northstudio.com",
    phone: "+91 9839839191",
    registeredOn: "2025-09-12",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Lower Parel",
    about: "Books crew and cameras for monthly product films.",
    photo: "/media/talent-4.jpg",
    preferred: "Vendor",
    status: "Active",
  },
  {
    id: "c2",
    name: "Aisha Kapur",
    userType: "Production",
    email: "aisha@kapurfilms.in",
    phone: "+91 9811112223",
    registeredOn: "2025-08-02",
    city: "New Delhi",
    state: "Delhi",
    address: "GK 2",
    about: "Line producer booking talent and locations for ad films.",
    photo: "/media/talent-3.jpg",
    preferred: "Talent",
    status: "Active",
  },
  {
    id: "c3",
    name: "Rohit Bansal",
    userType: "Brand",
    email: "rht@gmail.com",
    phone: "+91 9839839192",
    registeredOn: "2025-09-12",
    city: "Bengaluru",
    state: "Karnataka",
    address: "Koramangala",
    about: "In-house brand team booking stills crews.",
    photo: "/media/singer.jpg",
    preferred: "Vendor",
    status: "Active",
  },
  {
    id: "c4",
    name: "Neelam Iyer",
    userType: "Event",
    email: "neelam@gather.co",
    phone: "+91 9900001111",
    registeredOn: "2025-07-19",
    city: "Hyderabad",
    state: "Telangana",
    address: "Banjara Hills",
    about: "Event company booking stages, light and hosts.",
    photo: "/media/hero-6.jpg",
    preferred: "Vendor",
    status: "Pending",
  },
  {
    id: "c5",
    name: "Dev Malhotra",
    userType: "Individual",
    email: "dev@mail.com",
    phone: "+91 9766001122",
    registeredOn: "2025-06-30",
    city: "New Delhi",
    state: "Delhi",
    address: "Hauz Khas",
    about: "Books photographers and makeup for private events.",
    photo: "/media/actor.jpg",
    preferred: "Talent",
    status: "Active",
  },
]

export const productSeed: Product[] = [
  {
    id: "p1",
    title: "Sony FX3",
    vendorId: "v1",
    category: "Camera",
    type: "Rent",
    pricePaise: 800000,
    unit: "Day",
    delivery: "Pick Up",
    location: "New Delhi",
    tagline: "Full-frame cinema camera with two batteries",
    description: "Sony FX3 body, cage, two batteries and a 128GB card. Picked up from Connaught Place.",
    photo: "/media/gear-1.jpg",
    photos: ["/media/gear-1.jpg", "/media/gear-3.jpg", "/media/hero-1.jpg"],
    status: "Approved",
    tags: ["film", "commercial"],
  },
  {
    id: "p2",
    title: "Aputure 600d kit",
    vendorId: "v4",
    category: "Lights",
    type: "Rent",
    pricePaise: 450000,
    unit: "Day",
    delivery: "Self",
    location: "Hyderabad",
    tagline: "Daylight LED with stand and dome",
    description: "One Aputure 600d, light stand and a soft dome for interview and product days.",
    photo: "/media/gear-2.jpg",
    photos: ["/media/gear-2.jpg", "/media/gear-4.jpg", "/media/hero-5.jpg"],
    status: "Pending",
    tags: ["commercial", "ad"],
  },
  {
    id: "p3",
    title: "Studio A, Bandra",
    vendorId: "v2",
    category: "Location",
    type: "Rent",
    pricePaise: 2500000,
    unit: "Day",
    delivery: "On site",
    location: "Mumbai",
    tagline: "Daylight studio with a cyc wall",
    description: "40x30 studio, green room and parking for two vans. Booked by the day.",
    photo: "/media/hero-4.jpg",
    photos: ["/media/hero-4.jpg", "/media/hero-2.jpg", "/media/hero-3.jpg"],
    status: "Approved",
    tags: ["fashion", "commercial"],
  },
  {
    id: "p4",
    title: "DJI Ronin 4D",
    vendorId: "v1",
    category: "Camera",
    type: "Rent",
    pricePaise: 1200000,
    unit: "Day",
    delivery: "Self",
    location: "New Delhi",
    tagline: "Gimbal camera for moving shots",
    description: "Ronin 4D with a monitor and two batteries. Operator not included.",
    photo: "/media/gear-3.jpg",
    photos: ["/media/gear-3.jpg", "/media/gear-1.jpg", "/media/hero-5.jpg"],
    status: "Pending",
    tags: ["film", "event"],
  },
  {
    id: "p5",
    title: "Lens set, primes",
    vendorId: "v1",
    category: "Camera",
    type: "Rent",
    pricePaise: 600000,
    unit: "Day",
    delivery: "Pick Up",
    location: "New Delhi",
    tagline: "24, 35, 50 and 85mm primes",
    description: "Matched prime set in a padded case. Damage deposit collected offline by admin.",
    photo: "/media/gear-4.jpg",
    photos: ["/media/gear-4.jpg", "/media/gear-1.jpg", "/media/photo.jpg"],
    status: "Approved",
    tags: ["film"],
  },
  {
    id: "p6",
    title: "Makeup room, half day",
    vendorId: "v5",
    category: "Makeup",
    type: "Fixed",
    pricePaise: 700000,
    unit: "Slot",
    delivery: "On site",
    location: "Mumbai",
    tagline: "Chair, lights and one artist",
    description: "Half-day makeup room with one artist. Extra looks billed as a service.",
    photo: "/media/makeup.jpg",
    photos: ["/media/makeup.jpg", "/media/talent-1.jpg", "/media/hero-6.jpg"],
    status: "Rejected",
    tags: ["fashion", "wedding"],
  },
]

export const serviceSeed: Service[] = [
  {
    id: "s1",
    title: "Full camera crew",
    ownerType: "vendor",
    ownerId: "v3",
    category: "Crew",
    pricePaise: 1800000,
    unit: "Day",
    city: "Bengaluru",
    tags: ["commercial", "film"],
    description: "DOP, focus puller and assistant for a 10-hour shoot day.",
    photo: "/media/hero-2.jpg",
    status: "Active",
  },
  {
    id: "s2",
    title: "Wedding photo film",
    ownerType: "talent",
    ownerId: "t3",
    category: "Photographer",
    pricePaise: 3500000,
    unit: "Day",
    city: "Bengaluru",
    tags: ["wedding", "event"],
    description: "Two shooters, same-day highlights and a graded film in ten days.",
    photo: "/media/photo.jpg",
    status: "Active",
  },
  {
    id: "s3",
    title: "Campaign makeup",
    ownerType: "talent",
    ownerId: "t4",
    category: "Makeup",
    pricePaise: 1200000,
    unit: "Day",
    city: "Hyderabad",
    tags: ["fashion", "ad"],
    description: "On-set makeup for up to four looks, including touch-ups between shots.",
    photo: "/media/makeup.jpg",
    status: "Active",
  },
  {
    id: "s4",
    title: "Lead actor, day rate",
    ownerType: "talent",
    ownerId: "t1",
    category: "Actor",
    pricePaise: 2500000,
    unit: "Day",
    city: "New Delhi",
    tags: ["film", "ad"],
    description: "One shoot day with rehearsal. Usage rights quoted separately by admin.",
    photo: "/media/actor.jpg",
    status: "Active",
  },
  {
    id: "s5",
    title: "Studio day, Bandra",
    ownerType: "vendor",
    ownerId: "v2",
    category: "Location",
    pricePaise: 2500000,
    unit: "Day",
    city: "Mumbai",
    tags: ["fashion", "commercial"],
    description: "Studio hire with a house electrician. Gear is booked separately.",
    photo: "/media/hero-4.jpg",
    status: "Active",
  },
  {
    id: "s6",
    title: "Light package with gaffer",
    ownerType: "vendor",
    ownerId: "v4",
    category: "Lights",
    pricePaise: 900000,
    unit: "Day",
    city: "Hyderabad",
    tags: ["commercial", "event"],
    description: "Three LED heads, stands and a gaffer for interviews or small stages.",
    photo: "/media/gear-2.jpg",
    status: "Inactive",
  },
]

export const bookingSeed: Booking[] = [
  {
    id: "b1",
    kind: "booking",
    clientId: "c1",
    clientName: "Manan Shah",
    vendorId: "v1",
    vendorName: "Framehouse Rentals",
    productId: "p1",
    title: "Sony FX3",
    category: "Camera",
    requirement: "Rent",
    start: "2026-09-22",
    end: "2026-09-22",
    budgetPaise: 800000,
    status: "Booked",
    tags: ["film", "commercial"],
    city: "New Delhi",
    channel: "Web",
    payment: "25% online, cash",
    period: "One day",
    project: "Project L",
  },
  {
    id: "b2",
    kind: "booking",
    clientId: "c2",
    clientName: "Aisha Kapur",
    talentId: "t1",
    talentName: "Rohit Verma",
    serviceId: "s4",
    title: "Lead actor, day rate",
    category: "Actor",
    requirement: "Shooting",
    start: "2026-09-12",
    end: "2026-09-12",
    budgetPaise: 2500000,
    status: "Confirmed",
    tags: ["film", "ad"],
    city: "New Delhi",
    channel: "App",
    payment: "Full online",
    period: "1 Day",
    project: "Monsoon spot",
  },
  {
    id: "b3",
    kind: "enquiry",
    clientId: "c1",
    clientName: "Manan Shah",
    vendorId: "v1",
    vendorName: "Framehouse Rentals",
    productId: "p5",
    title: "Lens set, primes",
    category: "Camera",
    requirement: "Rent",
    start: "2026-10-02",
    end: "2026-10-07",
    budgetPaise: 800000,
    status: "Pending",
    tags: ["film"],
    city: "New Delhi",
    channel: "Web",
    payment: "25% online, rest online",
    period: "6 days",
    project: "Lookbook",
  },
  {
    id: "b4",
    kind: "booking",
    clientId: "c5",
    clientName: "Dev Malhotra",
    talentId: "t3",
    talentName: "Kabir Malhotra",
    serviceId: "s2",
    title: "Wedding photo film",
    category: "Photographer",
    requirement: "Event",
    start: "2026-08-16",
    end: "2026-08-16",
    budgetPaise: 3500000,
    status: "Completed",
    tags: ["wedding", "event"],
    city: "Bengaluru",
    channel: "App",
    payment: "25% online, cash",
    period: "1 Day",
    project: "Malhotra wedding",
  },
  {
    id: "b5",
    kind: "booking",
    clientId: "c4",
    clientName: "Neelam Iyer",
    vendorId: "v4",
    vendorName: "Lumos Gear",
    serviceId: "s6",
    title: "Light package with gaffer",
    category: "Lights",
    requirement: "Event",
    start: "2026-08-21",
    end: "2026-08-21",
    budgetPaise: 900000,
    status: "Completed",
    tags: ["event", "commercial"],
    city: "Hyderabad",
    channel: "Web",
    payment: "Full online",
    period: "1 Day",
    project: "Store launch",
  },
  {
    id: "b6",
    kind: "enquiry",
    clientId: "c2",
    clientName: "Aisha Kapur",
    talentId: "t5",
    talentName: "Zara Khan",
    title: "Hosted film",
    category: "Actress",
    requirement: "Shooting",
    start: "2026-09-28",
    end: "2026-09-29",
    budgetPaise: null,
    status: "Pending",
    tags: ["ad", "film"],
    city: "Mumbai",
    channel: "Web",
    payment: "25% online, rest online",
    period: "2 Days",
    project: "Festive ad",
  },
  {
    id: "b7",
    kind: "booking",
    clientId: "c1",
    clientName: "Manan Shah",
    vendorId: "v2",
    vendorName: "Northlight Studios",
    serviceId: "s5",
    productId: "p3",
    title: "Studio day, Bandra",
    category: "Location",
    requirement: "Shooting",
    start: "2026-08-08",
    end: "2026-08-08",
    budgetPaise: 2500000,
    status: "Completed",
    tags: ["fashion", "commercial"],
    city: "Mumbai",
    channel: "App",
    payment: "Full online",
    period: "1 Day",
    project: "Summer drop",
  },
  {
    id: "b8",
    kind: "booking",
    clientId: "c3",
    clientName: "Rohit Bansal",
    vendorId: "v3",
    vendorName: "Crewline",
    serviceId: "s1",
    title: "Full camera crew",
    category: "Crew",
    requirement: "Shooting",
    start: "2026-08-27",
    end: "2026-08-28",
    budgetPaise: 3600000,
    status: "Completed",
    tags: ["commercial", "film"],
    city: "Bengaluru",
    channel: "Web",
    payment: "25% online, rest online",
    period: "2 Days",
    project: "App launch",
  },
  {
    id: "b9",
    kind: "booking",
    clientId: "c2",
    clientName: "Aisha Kapur",
    talentId: "t4",
    talentName: "Meera Joshi",
    serviceId: "s3",
    title: "Campaign makeup",
    category: "Makeup",
    requirement: "Shooting",
    start: "2026-08-12",
    end: "2026-08-12",
    budgetPaise: 1200000,
    status: "Completed",
    tags: ["fashion", "ad"],
    city: "Hyderabad",
    channel: "App",
    payment: "25% online, cash",
    period: "1 Day",
    project: "Jewellery film",
  },
  {
    id: "b10",
    kind: "enquiry",
    clientId: "c4",
    clientName: "Neelam Iyer",
    vendorId: "v2",
    vendorName: "Northlight Studios",
    title: "Rooftop hold",
    category: "Location",
    requirement: "Event",
    start: "2026-09-18",
    end: "2026-09-18",
    budgetPaise: 1500000,
    status: "Cancelled",
    tags: ["event"],
    city: "Mumbai",
    channel: "Web",
    payment: "25% online, rest online",
    period: "1 Day",
    project: "Brand dinner",
  },
  {
    id: "b11",
    kind: "booking",
    clientId: "c5",
    clientName: "Dev Malhotra",
    talentId: "t2",
    talentName: "Prachi Singh",
    title: "Family portraits",
    category: "Model",
    requirement: "Shooting",
    start: "2026-09-05",
    end: "2026-09-05",
    budgetPaise: 600000,
    status: "Booked",
    tags: ["wedding", "fashion"],
    city: "Mumbai",
    channel: "App",
    payment: "Full online",
    period: "Half day",
    project: "Family set",
  },
  {
    id: "b12",
    kind: "booking",
    clientId: "c3",
    clientName: "Rohit Bansal",
    vendorId: "v1",
    vendorName: "Framehouse Rentals",
    productId: "p4",
    title: "DJI Ronin 4D",
    category: "Camera",
    requirement: "Rent",
    start: "2026-08-04",
    end: "2026-08-05",
    budgetPaise: 2400000,
    status: "Completed",
    tags: ["commercial", "event"],
    city: "New Delhi",
    channel: "Web",
    payment: "25% online, cash",
    period: "2 Days",
    project: "Store walkthrough",
  },
]

export const reviewSeed: Review[] = [
  {
    id: "r1",
    serviceId: "s2",
    author: "Dev Malhotra",
    rating: 5,
    text: "Crew arrived on time and the highlight film was ready before the guests left the city.",
    date: "2026-08-20",
  },
  {
    id: "r2",
    serviceId: "s2",
    author: "Neelam Iyer",
    rating: 4,
    text: "Strong stills. The evening set needed one extra light, which we added on site.",
    date: "2026-07-11",
  },
  {
    id: "r3",
    serviceId: "s4",
    author: "Aisha Kapur",
    rating: 5,
    text: "Rohit held the dialogue scenes and stayed for the extra hour without a fuss.",
    date: "2026-09-14",
  },
  {
    id: "r4",
    serviceId: "s3",
    author: "Aisha Kapur",
    rating: 5,
    text: "Looks stayed through a long outdoor day. Touch-ups were quick between setups.",
    date: "2026-08-13",
  },
  {
    id: "r5",
    serviceId: "s1",
    author: "Rohit Bansal",
    rating: 4,
    text: "Camera team was ready at call time. We would book the same crew again.",
    date: "2026-08-29",
  },
  {
    id: "r6",
    serviceId: "s5",
    author: "Manan Shah",
    rating: 5,
    text: "Studio was clean, power was stable, and the cyc wall needed almost no patching.",
    date: "2026-08-09",
  },
  {
    id: "r7",
    serviceId: "s6",
    author: "Neelam Iyer",
    rating: 4,
    text: "Gaffer shaped the stage fast. Van parking at the venue was the only delay.",
    date: "2026-08-22",
  },
  {
    id: "r8",
    serviceId: "s4",
    author: "Manan Shah",
    rating: 4,
    text: "Clear on camera and easy with the brand script. Booked for the next spot.",
    date: "2026-06-02",
  },
]

export const categorySeed: Category[] = [
  { id: "cat1", name: "Camera", group: "Gear", description: "Bodies, kits and monitors for rent.", status: "Active" },
  { id: "cat2", name: "Lights", group: "Gear", description: "LED, tungsten and stands.", status: "Active" },
  { id: "cat3", name: "Lenses", group: "Gear", description: "Primes, zooms and filters.", status: "Active" },
  { id: "cat4", name: "Sound", group: "Gear", description: "Recorders, mics and booms.", status: "Active" },
  { id: "cat5", name: "Crew", group: "Crew", description: "Camera, light and production crew.", status: "Active" },
  { id: "cat6", name: "Makeup", group: "Crew", description: "Artists and makeup rooms.", status: "Active" },
  { id: "cat7", name: "Location", group: "Location", description: "Studios, rooftops and venues.", status: "Active" },
  { id: "cat8", name: "Talent", group: "Talent", description: "People who can be booked directly.", status: "Active" },
  { id: "cat9", name: "Actress", group: "Talent", description: "Speaking and non-speaking roles.", status: "Active" },
  { id: "cat10", name: "Model", group: "Talent", description: "Fashion, catalogue and campaign.", status: "Active" },
  { id: "cat11", name: "Photographer", group: "Talent", description: "Stills shooters.", status: "Active" },
  { id: "cat12", name: "Event", group: "Event", description: "Stages, hosts and event packages.", status: "Inactive" },
]

export const leadSeed: Lead[] = [
  { id: "l1", name: "Rohit Verma", leadType: "Talent", email: "rohit@reelora.in", phone: "+91 9283192701", date: "2026-09-22", source: "Web", status: "Pending" },
  { id: "l2", name: "Crewline", leadType: "Vendor", email: "desk@crewline.in", phone: "+91 9900099000", date: "2026-09-18", source: "App", status: "Pending" },
  { id: "l3", name: "Neelam Iyer", leadType: "Client", email: "neelam@gather.co", phone: "+91 9900001111", date: "2026-09-11", source: "Web", status: "Approved" },
  { id: "l4", name: "Meera Joshi", leadType: "Talent", email: "meera@glamunit.in", phone: "+91 9845012345", date: "2026-08-30", source: "App", status: "Pending" },
  { id: "l5", name: "Lumos Gear", leadType: "Vendor", email: "rent@lumos.in", phone: "+91 9740011223", date: "2026-08-02", source: "Web", status: "Rejected" },
]

export const bannerSeed: Banner[] = [
  { id: "bn1", platform: "Web", position: "Top", title: "Discover Talent, Create Experiences", image: "/media/promo.jpg" },
  { id: "bn2", platform: "App", position: "Top", title: "Discover Talent, Create Experiences", image: "/media/promo.jpg" },
]

export const planSeed: Plan[] = [
  {
    id: "m1",
    name: "Gold",
    audience: "Talent",
    duration: "12 Months",
    pricePaise: 120000,
    createdOn: "2025-04-12",
    status: "Active",
    platform: "Both",
    description: [
      "Profile highlighted in talent search",
      "Unlimited active service slots",
      "Priority in admin booking follow-up",
      "Membership badge on the public profile",
    ],
  },
  {
    id: "m2",
    name: "Silver",
    audience: "Talent",
    duration: "6 Months",
    pricePaise: 70000,
    createdOn: "2025-04-12",
    status: "Active",
    platform: "App",
    description: [
      "Listed in talent search",
      "Up to three active services",
      "Standard booking follow-up",
      "Basic profile badge",
    ],
  },
  {
    id: "m3",
    name: "Gold",
    audience: "Vendor",
    duration: "12 Months",
    pricePaise: 150000,
    createdOn: "2025-05-01",
    status: "Active",
    platform: "Web",
    description: [
      "Unlimited product listings",
      "Featured row on the marketplace",
      "Lower queue time for product approval",
      "Vendor badge on every listing",
    ],
  },
  {
    id: "m4",
    name: "Plus",
    audience: "Client",
    duration: "12 Months",
    pricePaise: 80000,
    createdOn: "2025-06-01",
    status: "Active",
    platform: "Both",
    description: [
      "Saved crews and repeat booking",
      "Early access to new vendors",
      "Booking history export for accounts",
      "Priority support from the admin desk",
    ],
  },
]

export const memberSeed: Member[] = [
  { id: "a1", name: "Rohit Desk", email: "rht@reelora.in", role: "Lead Requests", password: "229382wiw", status: "Active" },
  { id: "a2", name: "Anika Shah", email: "anika@reelora.in", role: "Bookings", password: "book4411", status: "Inactive" },
  { id: "a3", name: "Farhan Ali", email: "farhan@reelora.in", role: "Vendor Management", password: "vendor90", status: "Active" },
  { id: "a4", name: "Leela Nair", email: "leela@reelora.in", role: "Full access", password: "desk2201", status: "Active" },
]

export const LAST_MONTH = { from: "2026-08-01", to: "2026-08-31" }

export function ownerName(
  service: Service,
  talents: Talent[],
  vendors: Vendor[],
) {
  if (service.ownerType === "talent") {
    return talents.find((item) => item.id === service.ownerId)?.name ?? "Talent"
  }
  return vendors.find((item) => item.id === service.ownerId)?.name ?? "Vendor"
}
