export const environment = {
  production: true,
  urlApi: 'https://malia-be.gosumania.it/api/',

  REGISTER: 'auth/register',
  LOGIN: 'auth/login',
  USER_PROFILE: 'auth/authentication-profile',
  REFRESH: 'auth/refresh',
  LOGOUT: 'auth/logout',
  GET_ALL: 'auth/get-all',

  CUSTOMER_GET_ALL: 'customer/get-all',
  CUSTOMER_CREATE_OR_UPDATE: 'customer/create-or-update',
  CUSTOMER_GET_BY_ID: 'customer/get-by-id',
  CUSTOMER_DELETE: 'customer/delete',
  CUSTOMER_GET_ALL_WITH_PAGINATION: 'customer/get-all-with-pagination',
  CUSTOMER_GET_ALL_WITH_PAGINATION_SEARCH: 'customer/get-all-with-pagination-search',


  PRODUCT_GET_ALL: 'product/get-all',
  PRODUCT_CREATE_OR_UPDATE: 'product/create-or-update',
  PRODUCT_GET_BY_ID: 'product/get-by-id',
  PRODUCT_DELETE: 'product/delete',
  PRODUCT_GET_ALL_WITH_PAGINATION: 'product/get-all-with-pagination',
  PRODUCT_GET_ALL_WITH_PAGINATION_SEARCH: 'product/get-all-with-pagination-search',


  CLOTHING_SIZE_TYPE_GET_ALL: 'clothing-size-type/get-all',
  CLOTHING_SIZE_GET_ALL: 'clothing-size/get-all',
  CLOTHING_NUMBER_SIZE_GET_ALL: 'clothing-number-size/get-all',
  CLOTHING_CHILDREN_SIZE_GET_ALL: 'clothing-children-size/get-all',
  PRODUCT_TYPE_GET_ALL: 'product-type/get-all',
  SHOE_SIZE_GET_ALL: 'shoe-size/get-all',
  UTILITY_UPLOAD_IMAGE: 'image/upload',

  COLOR_GET_ALL: 'color/get-all',
  COLOR_CREATE_OR_UPDATE: 'color/create-or-update',
  COLOR_DELETE: 'color/delete',
  COLOR_GET_ALL_WITH_PAGINATION: 'color/get-all-with-pagination',
  COLOR_GET_ALL_WITH_PAGINATION_SEARCH: 'color/get-all-with-pagination-search',

  PROVIDER_GET_ALL: 'provider/get-all',
  PROVIDER_CREATE_OR_UPDATE: 'provider/create-or-update',
  PROVIDER_GET_BY_ID: 'provider/get-by-id',
  PROVIDER_DELETE: 'provider/delete',
  PROVIDER_GET_ALL_WITH_PAGINATION: 'provider/get-all-with-pagination',
  PROVIDER_GET_ALL_WITH_PAGINATION_SEARCH: 'provider/get-all-with-pagination-search',
  DELIVERY_GET_ALL: 'delivery/get-all',
  ORDER_TYPE_GET_ALL: 'order-type/get-all',
  PAYMENT_METHODS_GET_ALL: 'payment-method/get-all',
  SEASON_TYPE_GET_ALL: 'season-type/get-all',
  SEASON_GET_ALL: 'season/get-all',

  ORDER_GET_ALL: 'order/get-all',
  ORDER_CREATE_OR_UPDATE: 'order/create-or-update',
  ORDER_GET_BY_ID: 'order/get-by-id',
  ORDER_DELETE: 'order/delete',
  ORDER_GET_ALL_WITH_PAGINATION: 'order/get-all-with-pagination',
  ORDER_GET_ALL_WITH_PAGINATION_SEARCH: 'order/get-all-with-pagination-search',
  ORDER_GET_TOTAL_PIECES_AND_AMOUNTS: 'order/get-total-pieces-and-amounts',
  ORDER_GET_ALL_WITH_PAGINATION_SEARCH_PROVIDER: 'order/get-all-with-pagination-search-provider',
  ORDER_GET_ALL_PROVIDER_XLSX: 'order/get-all-filter-provider-xlsx',
  ORDER_GET_TOTAL_PIECES_AND_AMOUNTS_PDF: 'order/get-total-pieces-and-amounts-pdf',
  ORDER_GET_TOTAL_PIECES_AND_AMOUNTS_PROVIDER: 'order/get-total-pieces-and-amounts-provider',

  ORDER_PRODUCT_GET_ORDER_PRODUCT_STATS: 'order-product/get-order-product-stats',
  ORDER_PRODUCT_GET_WITH_PAGINATION_ORDER_PRODUCT_STATS: 'order-product/get-with-pagination-order-product-stats',
};
