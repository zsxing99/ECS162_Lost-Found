// define a set of MACROs
const DEV_ENVIRONMENT = true;

export const useProxy = DEV_ENVIRONMENT ? true : false;
export const proxyUrl = DEV_ENVIRONMENT ? "http://localhost:8080/" : '';

export const photoStorageLink = "http://ecs162.org:3000/images/wxiwang/";

export const prefix = DEV_ENVIRONMENT ? "https://lost-found-162.glitch.me" : '';
export const uploadService = "/upload";
export const searchService = "/search";
export const postService = "/post";
export const loginService = "/auth/google";