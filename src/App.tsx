import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ThemeProvider from "./components/ThemeProvider";
import Layout from "./components/Layout";
import { BackgroundColorProvider } from "./components/BackgroundColorProvider";
import { UserPreferencesProvider } from "./components/UserPreferencesProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserPreferencesProvider>
      <ThemeProvider>
        <BackgroundColorProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </BackgroundColorProvider>
      </ThemeProvider>
    </UserPreferencesProvider>
  </QueryClientProvider>
);

export default App;
