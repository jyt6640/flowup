import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "./ui";

type NavbarProps = {
  readonly onStart?: () => void;
};

export const Navbar = ({ onStart }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="animate-fade-down relative z-30 px-5 py-4 sm:px-8 sm:py-5 lg:px-10">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-ink-soft lg:flex" aria-label="주요 메뉴">
          <a className="inline-flex items-center gap-1 transition hover:text-ink" href="#preview">
            Toolkit
            <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
          <Link className="transition hover:text-ink" to="/create">
            Plans
          </Link>
          <Link className="transition hover:text-ink" to="/interview-results">
            News
          </Link>
        </nav>
        <div className="hidden lg:block">
          <Button onClick={onStart}>Start Free</Button>
        </div>
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/55 text-ink shadow-sm backdrop-blur lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
        </button>
      </div>
      {menuOpen && (
        <div className="glass-surface mx-auto mt-3 max-w-[1280px] rounded-app-md p-4 lg:hidden">
          <nav className="flex flex-col gap-1 text-sm text-ink-soft" aria-label="모바일 메뉴">
            <a className="rounded-app-sm px-3 py-2.5 hover:bg-white/50" href="#preview" onClick={closeMenu}>
              Toolkit
            </a>
            <Link className="rounded-app-sm px-3 py-2.5 hover:bg-white/50" to="/create" onClick={closeMenu}>
              Plans
            </Link>
            <Link className="rounded-app-sm px-3 py-2.5 hover:bg-white/50" to="/interview-results" onClick={closeMenu}>
              News
            </Link>
            <Button className="mt-2 w-full" onClick={onStart}>
              Start Free
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
