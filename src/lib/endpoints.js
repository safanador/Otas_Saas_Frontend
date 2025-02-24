
const API_BASE_URL = /*process.env.NEXT_PUBLIC_API_BASE_URL || */'http://localhost:3000/api/v1';

const endpoints = {
  // Obtener roles por agencia
  getRolesByAgency: (agencyId) => `${API_BASE_URL}/agencies/${agencyId}/roles`,

  // Obtener detalles de un usuario
  getUserDetails: (userId) => `${API_BASE_URL}/users/${userId}`,

  // Crear un nuevo usuario
  createUser: () => `${API_BASE_URL}/users`,

  // Actualizar un usuario
  updateUser: (userId) => `${API_BASE_URL}/users/${userId}`,

  // Eliminar un usuario
  deleteUser: (userId) => `${API_BASE_URL}/users/${userId}`,

  // Obtener todas las agencias
  getAgencies: () => `${API_BASE_URL}/agencies`,

  // Obtener detalles de una agencia
  getAgencyDetails: (agencyId) => `${API_BASE_URL}/agencies/${agencyId}`,

  // Crear una nueva agencia
  createAgency: () => `${API_BASE_URL}/agencies`,

  // Actualizar una agencia
  updateAgency: (agencyId) => `${API_BASE_URL}/agencies/${agencyId}`,

  // Eliminar una agencia
  deleteAgency: (agencyId) => `${API_BASE_URL}/agencies/${agencyId}`,

  // Auth

  // Roles

  // Images

  // Users

  // Permissions

  // Agencies

  // Plans


  // SUBSCRIPTIONS //

  // Create Subscriptions
  createSubscription: () => `${API_BASE_URL}/subscriptions`,

  // Get Subscriptions
  getSubscriptions: () => `${API_BASE_URL}/subscriptions`,

  // Get Subscription
  getOneSubscription: (subscriptionId) => `${API_BASE_URL}/subscriptions/${subscriptionId}`,

  // Update Subscriptions
  updateSubscription: (subscriptionId) => `${API_BASE_URL}/subscriptions/${subscriptionId}`,
  
  // Delete Subscriptions
  deleteSubscription: (subscriptionId) => `${API_BASE_URL}/subscriptions/${subscriptionId}`,


  // PAYMENTS //

  // Create Payment
  createPayment: () => `${API_BASE_URL}/payments`,

  // Get All Payments
  getAllPayments: () => `${API_BASE_URL}/payments`,

  // Get One Payment
  getOnePayment: (paymentId) => `${API_BASE_URL}/payments/${paymentId}`,

  // Update Payment Status
  updatePayment: (paymentId) => `${API_BASE_URL}/payments/${paymentId}/status`,
  
  // Delete Payment
  deletePayment: (paymentId) => `${API_BASE_URL}/payments/${paymentId}`,

};

export default endpoints;