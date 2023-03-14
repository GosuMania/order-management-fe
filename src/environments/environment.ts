// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // urlApi: 'http://127.0.0.1:5000/',
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

  PRODUCT_GET_ALL: 'product/get-all',
  PRODUCT_CREATE_OR_UPDATE: 'product/create-or-update',
  PRODUCT_GET_BY_ID: 'product/get-by-id',
  PRODUCT_DELETE: 'product/delete',
  PRODUCT_GET_ALL_WITH_PAGINATION: 'product/get-all-with-pagination',

  COLOR_GET_ALL: 'color/get-all',
  CLOTHING_SIZE_GET_ALL: 'clothing-size/get-all',
  PRODUCT_TYPE_GET_ALL: 'product-type/get-all',
  SHOE_SIZE_GET_ALL: 'shoe-size/get-all',
  UTILITY_UPLOAD_IMAGE: 'image/upload',

  PROVIDER_GET_ALL: 'provider/get-all',
  PROVIDER_CREATE_OR_UPDATE: 'provider/create-or-update',
  PROVIDER_GET_BY_ID: 'provider/get-by-id',
  PROVIDER_DELETE: 'provider/delete',
  PROVIDER_GET_ALL_WITH_PAGINATION: 'provider/get-all-with-pagination',

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
