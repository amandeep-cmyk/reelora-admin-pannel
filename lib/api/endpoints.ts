export const endpoints = {
  auth: {
    login: "/api/auth/login",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
    me: "/api/auth/me",
  },
  bookings: {
    status: (id: string) => `/api/bookings/${id}/status`,
  },
  reviews: {
    list: "/api/reviews",
  },
  admin: {
    dashboard: "/api/admin/dashboard",
    people: "/api/admin/people",
    personActive: (id: string) => `/api/admin/people/${id}/active`,
    services: "/api/admin/services",
    service: (id: string) => `/api/admin/services/${id}`,
    bookings: "/api/admin/bookings",
    assignBooking: (id: string) => `/api/admin/bookings/${id}/assign`,
    team: "/api/admin/team",
    categories: "/api/admin/categories",
    category: (id: string) => `/api/admin/categories/${id}`,
  },
  marketing: {
    banners: "/api/marketing/banners",
    banner: (id: string) => `/api/marketing/banners/${id}`,
    events: "/api/marketing/events",
    event: (id: string) => `/api/marketing/events/${id}`,
    talents: "/api/marketing/talents",
    talent: (id: string) => `/api/marketing/talents/${id}`,
  },
} as const
