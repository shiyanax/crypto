import { useState } from "react";
import { Link, NavLink } from "react-router";
import { BarChart3, Home, Landmark, Menu, Newspaper, X } from "lucide-react";

import icon from "../assets/cryptocurrency.svg";
import { Button } from "./ui/button";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/cryptocurrencies", label: "Cryptocurrencies", icon: BarChart3 },
  { to: "/exchanges", label: "Exchanges", icon: Landmark },
  { to: "/news", label: "News", icon: Newspaper },
];

const navLinkClass = ({ isActive }) =>
  `group flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-zinc-800 !text-white"
      : "!text-zinc-300 hover:bg-zinc-800 hover:!text-white"
  }`;

const Logo = ({ onClick }) => (
  <Link to="/" className="flex items-center gap-3" onClick={onClick}>
    <img src={icon} alt="Shiyanax" className="h-10 w-10" />
    <span className="text-2xl font-bold tracking-normal !text-white">
      Shiyanax
    </span>
  </Link>
);

const NavItems = ({ onClick }) => (
  <nav className="mt-8 space-y-2">
    {navItems.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        end={to === "/"}
        className={navLinkClass}
        onClick={onClick}
      >
        {({ isActive }) => (
          <>
            <Icon
              className={`h-5 w-5 shrink-0 text-current group-hover:!text-white ${
                isActive ? "!text-white" : "!text-zinc-300"
              }`}
            />
            <span
              className={`text-current group-hover:!text-white ${
                isActive ? "!text-white" : "!text-zinc-300"
              }`}
            >
              {label}
            </span>
          </>
        )}
      </NavLink>
    ))}
  </nav>
);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 border-r border-zinc-800 bg-[#09090b] p-5 md:block">
        <Logo onClick={() => setMenuOpen(false)} />
        <NavItems onClick={() => setMenuOpen(false)} />
      </aside>

      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-zinc-800 bg-[#09090b] px-4 md:hidden">
        <Logo onClick={() => setMenuOpen(false)} />
        <Button
          variant="ghost"
          size="icon"
          className="!text-white hover:bg-zinc-800 hover:!text-white"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </header>

      <div
        className={`fixed inset-0 z-50 bg-[#09090b] p-5 transition-transform duration-300 md:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Logo onClick={() => setMenuOpen(false)} />
          <Button
            variant="ghost"
            size="icon"
            className="!text-white hover:bg-zinc-800 hover:!text-white"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <NavItems onClick={() => setMenuOpen(false)} />
      </div>
    </>
  );
};

export default Navbar;
