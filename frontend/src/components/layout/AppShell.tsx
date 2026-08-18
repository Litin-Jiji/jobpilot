import { type ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  LayoutDashboard,
  FileSearch,
  FolderOpen,
  Menu,
  X,
} from 'lucide-react'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/analyze', label: 'Analyze', icon: FileSearch },
  { path: '/applications', label: 'Applications', icon: FolderOpen },
]

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary">
      {/* ─── Top Navigation ─── */}
      <header className="sticky top-0 z-50 border-b border-border-default bg-bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto max-w-[1200px] flex items-center justify-between px-6 h-14">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 no-underline group"
          >
            <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-primary-subtle">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight text-text-primary">
              JobPilot
            </span>
            <span className="text-[10px] font-semibold text-primary bg-primary-subtle px-1.5 py-0.5 rounded-full leading-none">
              AI
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path)
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13px] font-medium
                    no-underline transition-colors duration-150
                    ${isActive
                      ? 'text-text-primary'
                      : 'text-text-muted hover:text-text-secondary'
                    }
                  `}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg bg-bg-elevated border border-border-default"
                      style={{ zIndex: -1 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Status / Avatar */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 text-[12px] text-text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              Online
            </div>
            <div className="w-7 h-7 rounded-full bg-bg-elevated border border-border-default flex items-center justify-center text-[11px] font-semibold text-text-secondary">
              U
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors border-0 bg-transparent cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border-default overflow-hidden bg-bg-surface"
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive =
                    item.path === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(item.path)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium
                        no-underline transition-colors
                        ${isActive
                          ? 'text-text-primary bg-bg-elevated'
                          : 'text-text-muted hover:text-text-secondary hover:bg-bg-hover'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
