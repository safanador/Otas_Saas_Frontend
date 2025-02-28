
const API_BASE_URL = /*process.env.NEXT_PUBLIC_API_BASE_URL || */'http://localhost:3000/api/v1';

const endpoints = {
  
  // Login
  auth_login: () => `${API_BASE_URL}/auth/login`,

  // Logout
  auth_logout: () => `${API_BASE_URL}/auth/logout`,



  // Create Role
  role_create: () => `${API_BASE_URL}/roles`,

  // Get Role
  role_getAll: () => `${API_BASE_URL}/roles`,

  // Get One Role
  role_getOne: (roleId) => `${API_BASE_URL}/roles/${roleId}`,

  // Update Role
  role_update: (roleId) => `${API_BASE_URL}/roles/${roleId}`,

  // Delete Role
  role_delete: (roleId) => `${API_BASE_URL}/roles/${roleId}`,



  // Upload Image
  images_upload: () => `${API_BASE_URL}/images/upload`,

  // Delete Image
  images_delete: (imageId) => `${API_BASE_URL}/images/${imageId}`,



  // Create User
  user_create: () => `${API_BASE_URL}/auth/register`,

  // Get User
  user_getAll: () => `${API_BASE_URL}/users`,

  // Get Users by agency
  user_getAllByAgency: (agencyId) => `${API_BASE_URL}/users/agency/${agencyId}`,

  // Get One User
  user_getOne: (userId) => `${API_BASE_URL}/users/${userId}`,

  // Update User
  user_update: (userId) => `${API_BASE_URL}/users/${userId}`,

  // Delete User
  user_delete: (userId) => `${API_BASE_URL}/users/${userId}`,

  // Toogle Status User
  user_toogleStatus: (userId) => `${API_BASE_URL}/users/${userId}/toggle-status`,



  permissions_getAll: () => `${API_BASE_URL}/permissions`,



  // Create Agency
  agency_create: () => `${API_BASE_URL}/agencies`,

  // Get Agency
  agency_getAll: () => `${API_BASE_URL}/agencies`,

  // Get One Agency
  agency_getOne: (agencyId) => `${API_BASE_URL}/agencies/${agencyId}`,

  // Update Agency
  agency_update: (agencyId) => `${API_BASE_URL}/agencies/${agencyId}`,

  // Delete Agency
  agency_delete: (agencyId) => `${API_BASE_URL}/agencies/${agencyId}`,

  // Toogle Status Agency
  agency_toogleStatus: (agencyId) => `${API_BASE_URL}/agencies/${agencyId}/toggle-state`,



  // Create Plan
  plan_create: () => `${API_BASE_URL}/plans`,

  // Get Plan
  plan_getAll: () => `${API_BASE_URL}/plans`,

  // Get Plan
  plan_getOne: (planId) => `${API_BASE_URL}/plans/${planId}`,

  // Update Plan
  plan_update: (planId) => `${API_BASE_URL}/plans/${planId}`,

  // Delete Plan
  plan_delete: (planId) => `${API_BASE_URL}/plans/${planId}`,



  // Create Subscriptions
  subscription_create: () => `${API_BASE_URL}/subscriptions`,

  // Get Subscriptions
  subscription_getAll: () => `${API_BASE_URL}/subscriptions`,

  // Get Subscription
  subscription_getOne: (subscriptionId) => `${API_BASE_URL}/subscriptions/${subscriptionId}`,

  // Update Subscriptions
  subscription_update: (subscriptionId) => `${API_BASE_URL}/subscriptions/${subscriptionId}`,
  
  // Delete Subscriptions
  subscription_delete: (subscriptionId) => `${API_BASE_URL}/subscriptions/${subscriptionId}`,



  // Create Payment
  payment_create: () => `${API_BASE_URL}/payments`,

  // Get All Payments
  payment_getAll: () => `${API_BASE_URL}/payments`,

  // Get One Payment
  payment_getOne: (paymentId) => `${API_BASE_URL}/payments/${paymentId}`,

  // Update Payment Status
  payment_update: (paymentId) => `${API_BASE_URL}/payments/${paymentId}/status`,
  
  // Delete Payment
  payment_delete: (paymentId) => `${API_BASE_URL}/payments/${paymentId}`,

};

export default endpoints;