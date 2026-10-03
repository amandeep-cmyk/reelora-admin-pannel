export const endpoints = {
  auth: {
    sendOtp: "/api/auth/send-otp",
    verifyOtp: "/api/auth/verify-otp",
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
} as const
