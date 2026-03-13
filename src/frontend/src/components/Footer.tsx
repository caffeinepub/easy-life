import { Link } from "@tanstack/react-router";

export default function Footer() {
  const year = new Date().getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <span className="font-display text-2xl font-semibold text-background/90">
              Easy<span style={{ color: "oklch(72 0.14 75)" }}>Life</span>
            </span>
            <p className="mt-3 text-sm text-background/60 max-w-xs leading-relaxed">
              Premium products curated for modern living. Quality, style, and
              convenience — all in one place.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-background/80 uppercase tracking-wider mb-3">
              Shop
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                to="/products"
                data-ocid="footer.link"
                className="text-sm text-background/60 hover:text-background/90 transition-colors"
              >
                All Products
              </Link>
              <Link
                to="/products"
                data-ocid="footer.link"
                className="text-sm text-background/60 hover:text-background/90 transition-colors"
              >
                Electronics
              </Link>
              <Link
                to="/products"
                data-ocid="footer.link"
                className="text-sm text-background/60 hover:text-background/90 transition-colors"
              >
                Clothing
              </Link>
              <Link
                to="/products"
                data-ocid="footer.link"
                className="text-sm text-background/60 hover:text-background/90 transition-colors"
              >
                Home & Garden
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-background/80 uppercase tracking-wider mb-3">
              Help
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                to="/account"
                data-ocid="footer.link"
                className="text-sm text-background/60 hover:text-background/90 transition-colors"
              >
                My Account
              </Link>
              <Link
                to="/about"
                data-ocid="footer.link"
                className="text-sm text-background/60 hover:text-background/90 transition-colors"
              >
                About Us
              </Link>
              <span className="text-sm text-background/60">
                Orders & Shipping
              </span>
              <Link
                to="/refund-policy"
                data-ocid="footer.link"
                className="text-sm text-background/60 hover:text-background/90 transition-colors"
              >
                Returns
              </Link>
              <span className="text-sm text-background/60">
                Contact Support
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-background/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-background/40">
            © {year} Easy Life. All rights reserved.
          </p>
          <p className="text-xs text-background/40">
            Built with ♥ using{" "}
            <a
              href={utm}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-background/60 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
