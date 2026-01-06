import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useDynamicImage } from "@/hooks/useDynamicImage";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChartLine, ChevronDown, Menu, User } from "lucide-react";
import GuestAccessModal from "./modals/GuestAccessModal";
import ClientLoginModal from "./modals/ClientLoginModal";
import defaultLogo from "@assets/image_1763735441524.jpeg";

export default function Header() {
  const [location] = useLocation();
  const { isAuthenticated, user, isGuestUser, isRegisteredUser, logout } = useAuth();
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Dynamic logo from CMS with fallback to bundled asset
  const logoSrc = useDynamicImage('global', 'logo', defaultLogo);

  // Check roles directly from user object (more efficient and reliable)
  const isSuperAdmin = user?.role === 'super_admin';
  const hasContentAccess = user?.role === 'super_admin' || user?.role === 'content_manager';

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact Us", href: "/contact" },
  ];

  const resourceItems = [
    
    { name: "Frequently Asked Questions", href: "/faq" },
    
    { name: "Disclosures", href: "/disclosures" },
    
    { name: "Articles", href: "/resources?type=article" },
    { name: "Calculators", href: "/calculators" },
    { name: "Flipbooks", href: "/resources?type=flipbook" },
    { name: "Newsletters", href: "/resources?type=newsletter" },
    //{ name: "Videos", href: "/resources?type=video" },
  ];

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 sm:h-24">
            {/* Logo */}
            <Link href="/" className="flex items-center min-w-0">
              <img 
                src={logoSrc} 
                alt="IFS Wealth Management" 
                className="h-16 sm:h-20 w-auto object-contain"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location === item.href
                      ? "text-primary bg-blue-50"
                      : "text-muted-foreground hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Resources Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-gray-900 hover:bg-gray-50"
                  >
                    Resources <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  {resourceItems.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link href={item.href} className="w-full">
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 px-2 sm:px-3" data-testid="user-menu">
                      {user?.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt="Profile"
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                      <span className="hidden lg:inline text-sm truncate max-w-24">
                        {user?.firstName || user?.email}
                        {isGuestUser && <span className="text-xs text-muted-foreground"> (Guest)</span>}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {isRegisteredUser && (
                      <>
                        <DropdownMenuItem>
                          <Link href="/" data-testid="link-home">Home</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href="/profile" data-testid="link-profile">Profile</Link>
                        </DropdownMenuItem>
                        {isSuperAdmin && (
                          <DropdownMenuItem>
                            <Link href="/admin-dashboard" data-testid="link-admin-dashboard">Admin Dashboard</Link>
                          </DropdownMenuItem>
                        )}
                        {hasContentAccess && (
                          <>
                            <DropdownMenuItem>
                              <Link href="/content-management" data-testid="link-content-management">Content Management</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link href="/resource-management" data-testid="link-resource-management">Resource Management</Link>
                            </DropdownMenuItem>
                          </>
                        )}
                      </>
                    )}
                    {isGuestUser && (
                      <DropdownMenuItem>
                        <Link href="/register" data-testid="link-upgrade-account">Upgrade to Full Account</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <button onClick={logout} className="w-full text-left" data-testid="button-logout">Logout</button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="default"
                      className="text-xs sm:text-sm px-2 sm:px-4"
                      size="sm"
                      data-testid="button-access-menu"
                    >
                      <User className="h-4 w-4 mr-1" />
                      Access
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setGuestModalOpen(true)} data-testid="menu-guest-access">
                      Guest Access
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setClientModalOpen(true)} data-testid="menu-login">
                      Login
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild data-testid="menu-register">
                      <Link href="/register" className="w-full">
                        Register
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Mobile menu button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <div className="flex flex-col space-y-4 mt-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">Resources</p>
                      {resourceItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    {isAuthenticated ? (
                      <div className="border-t pt-4 space-y-2">
                        {isRegisteredUser && (
                          <>
                            <Button variant="outline" className="w-full" asChild>
                              <Link href="/" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-home">
                                Home
                              </Link>
                            </Button>
                            <Button variant="outline" className="w-full" asChild>
                              <Link href="/profile" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-profile">
                                Profile
                              </Link>
                            </Button>
                            {isSuperAdmin && (
                              <Button variant="outline" className="w-full" asChild>
                                <Link href="/admin-dashboard" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-admin-dashboard">
                                  Admin Dashboard
                                </Link>
                              </Button>
                            )}
                            {hasContentAccess && (
                              <>
                                <Button variant="outline" className="w-full" asChild>
                                  <Link href="/content-management" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-content-management">
                                    Content Management
                                  </Link>
                                </Button>
                                <Button variant="outline" className="w-full" asChild>
                                  <Link href="/resource-management" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-resource-management">
                                    Resource Management
                                  </Link>
                                </Button>
                              </>
                            )}
                          </>
                        )}
                        {isGuestUser && (
                          <Button variant="outline" className="w-full" asChild>
                            <Link href="/register" onClick={() => setMobileMenuOpen(false)} data-testid="mobile-link-upgrade">
                              Upgrade to Full Account
                            </Link>
                          </Button>
                        )}
                        <Button 
                          variant="destructive" 
                          className="w-full" 
                          onClick={logout}
                          data-testid="mobile-button-logout"
                        >
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="border-t pt-4 space-y-2">
                        <p className="text-sm font-medium text-gray-900 mb-2">Account Access</p>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            setGuestModalOpen(true);
                            setMobileMenuOpen(false);
                          }}
                          data-testid="mobile-button-guest"
                        >
                          Guest Access
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            setClientModalOpen(true);
                            setMobileMenuOpen(false);
                          }}
                          data-testid="mobile-button-login"
                        >
                          Login
                        </Button>
                        <Button
                          variant="default"
                          className="w-full justify-start"
                          asChild
                          data-testid="mobile-button-register"
                        >
                          <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                            Register
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>

      <GuestAccessModal open={guestModalOpen} onOpenChange={setGuestModalOpen} />
      <ClientLoginModal open={clientModalOpen} onOpenChange={setClientModalOpen} />
    </>
  );
}
