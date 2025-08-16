import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
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

export default function Header() {
  const [location] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact Us", href: "/contact" },
  ];

  const resourceItems = [
    { name: "Become a Client", href: "/become-client" },
    { name: "Frequently Asked Questions", href: "/faq" },
    { name: "Our Custodian", href: "/custodian" },
    { name: "Disclosures", href: "/disclosures" },
    { name: "Our Location", href: "/location" },
    { name: "Articles", href: "/resources?type=article" },
    { name: "Calculators", href: "/calculators" },
    { name: "Flipbooks", href: "/resources?type=flipbook" },
    { name: "Newsletters", href: "/resources?type=newsletter" },
    { name: "Videos", href: "/resources?type=video" },
  ];

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <ChartLine className="text-white h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Investigoonline</h1>
                <p className="text-xs text-muted-foreground">by IFS Group</p>
              </div>
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
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      {user?.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                      <span className="hidden md:inline">
                        {user?.firstName || user?.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <a href="/api/logout">Logout</a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setGuestModalOpen(true)}
                    className="hidden md:inline-flex"
                  >
                    Guest Access
                  </Button>
                  <Button onClick={() => setClientModalOpen(true)}>
                    Client Login
                  </Button>
                </>
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
                    {!isAuthenticated && (
                      <div className="border-t pt-4 space-y-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setGuestModalOpen(true);
                            setMobileMenuOpen(false);
                          }}
                        >
                          Guest Access
                        </Button>
                        <Button
                          className="w-full"
                          onClick={() => {
                            setClientModalOpen(true);
                            setMobileMenuOpen(false);
                          }}
                        >
                          Client Login
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
