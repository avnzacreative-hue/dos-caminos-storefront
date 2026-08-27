export const STOREFRONT_PATHS = {
  home: "/",
  blanks: "/collections/blanks",
  archivo: "/collections/archivo",
  all: "/collections/all",
  product: "/products/:handle",
  fit: "/pages/fit",
  about: "/pages/about",
  cart: "/cart",
} as const;

export const REQUIRED_PUBLIC_ROUTE_KEYS = ["home", "blanks", "archivo", "product", "fit", "about", "cart"] as const;
