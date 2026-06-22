import { Routes, Route } from "react-router";
import {
  Exchanges,
  Homepage,
  News,
  Cryptocurrencies,
  CryptoDetails,
  Navbar,
} from "./components";

const App = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-950">
      <Navbar />

      <div className="flex min-h-screen flex-col md:pl-72">
        <main className="flex-1 px-4 pb-10 pt-24 sm:px-6 md:px-8 md:pt-8">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/exchanges" element={<Exchanges />} />
            <Route path="/cryptocurrencies" element={<Cryptocurrencies />} />
            <Route path="/crypto/:coinId" element={<CryptoDetails />} />
            <Route path="/news" element={<News />} />
          </Routes>
        </main>

        <footer className="border-t border-zinc-800 bg-zinc-950 px-4 py-6 text-center text-sm text-zinc-300">
          <p>
            Copyright © {currentYear} Shiyanax. All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
