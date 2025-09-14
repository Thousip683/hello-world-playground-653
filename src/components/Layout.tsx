import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Home, BarChart3, Users, Menu, X } from "lucide-react";
import { ProfileDropdown } from "@/components/ProfileDropdown";

interface LayoutProps {
  children: ReactNode;
  type?: "citizen" | "admin";
}

export const Layout = ({ children, type = "citizen" }: LayoutProps) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const citizenNavItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/report", label: "Report Issue", icon: FileText },
    { path: "/district-reports", label: "District Reports", icon: BarChart3 },
    { path: "/dashboard", label: "My Reports", icon: Users },
    { path: "/help", label: "Help", icon: Users },
  ];

  const adminNavItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: Home },
    { path: "/admin/issues", label: "All Issues", icon: FileText },
    { path: "/admin/assign", label: "Assignments", icon: Users },
    { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ];

  const navItems = type === "admin" ? adminNavItems : citizenNavItems;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b shadow-card sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to={type === "admin" ? "/admin/dashboard" : "/"} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                {type === "admin" ? "CivicReport Admin" : "CivicReport"}
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4">
              <nav className="flex items-center space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.path}
                      asChild
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className="transition-smooth"
                    >
                      <Link to={item.path} className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    </Button>
                  );
                })}
              </nav>
              
              <ProfileDropdown type={type} />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2 md:hidden">
              <ProfileDropdown type={type} />
              <button
                className="p-2 rounded hover:bg-muted transition"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-card border-b shadow-card absolute top-16 left-0 w-full z-40 animate-in fade-in slide-in-from-top-4">
            <nav className="flex flex-col px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    } transition`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              {type === "admin" && (
                <div className="flex flex-col space-y-2 mt-2">
                  <span className="text-xs text-muted-foreground pl-2">Admin Panel</span>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                      View Citizen Site
                    </Link>
                  </Button>
                </div>
              )}
              {type === "citizen" && (
                <Button variant="outline" size="sm" asChild className="w-full mt-2">
                  <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)}>
                    Staff Login
                  </Link>
                </Button>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-muted/30 border-t mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-3">CivicReport</h3>
              <p className="text-sm text-muted-foreground">
                Connecting citizens with local authorities for better community service.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/help" className="text-muted-foreground hover:text-foreground transition-smooth">Help & FAQ</Link></li>
                <li><Link to="/report" className="text-muted-foreground hover:text-foreground transition-smooth">Report Issue</Link></li>
                <li><Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-smooth">Track Reports</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Phone: (555) 123-CITY</p>
                <p>Email: help@civicreport.gov</p>
                <p>Hours: Mon-Fri 8AM-5PM</p>
              </div>
            </div>
          </div>
          <div className="border-t pt-6 mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2024 CivicReport System. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 sm:mt-0">
              <Link to="/privacy" className="hover:text-foreground transition-smooth">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-foreground transition-smooth">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};