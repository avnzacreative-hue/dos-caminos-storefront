import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AboutPage, CartPage, CollectionPage, FitPage, HomePage, NotFoundPage, ProductPage, StorefrontLayout } from "./pages/Storefront";
import { STOREFRONT_PATHS } from "@shared/storefrontRoutes";

function Router() {
  return <StorefrontLayout><Switch>
    <Route path={STOREFRONT_PATHS.home} component={HomePage} />
    <Route path={STOREFRONT_PATHS.blanks}><CollectionPage collection="blanks" /></Route>
    <Route path={STOREFRONT_PATHS.archivo}><CollectionPage collection="archivo" /></Route>
    <Route path={STOREFRONT_PATHS.all}><CollectionPage collection="all" /></Route>
    <Route path={STOREFRONT_PATHS.product} component={ProductPage} />
    <Route path={STOREFRONT_PATHS.fit} component={FitPage} />
    <Route path={STOREFRONT_PATHS.about} component={AboutPage} />
    <Route path={STOREFRONT_PATHS.cart} component={CartPage} />
    <Route component={NotFoundPage} />
  </Switch></StorefrontLayout>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
