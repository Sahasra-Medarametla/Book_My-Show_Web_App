import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-foreground mb-4">Movies Now Showing</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground cursor-pointer transition-colors">Pushpa 2</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Mufasa</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Baby John</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Sonic 3</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Upcoming Movies</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground cursor-pointer transition-colors">Avatar 3</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Mission Impossible 8</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Deadpool 4</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Jurassic World 4</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-foreground cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Contact Us</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">FAQs</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Terms & Conditions</li>
              <li className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Connect With Us</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold text-foreground mb-2">Download App</h4>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors">
                  App Store
                </button>
                <button className="px-4 py-2 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-colors">
                  Play Store
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="text-2xl font-bold text-gradient">
            book<span className="text-foreground">my</span>show
          </div>
          <p>© 2024 BookMyShow Clone. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
