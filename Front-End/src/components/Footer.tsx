export default function Footer() {
  return (
    <footer className="bg-amber-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold">PetAdopt</span>
            </div>
            <p className="text-amber-100 mb-4 max-w-md">
              Connecting loving pets with caring families. Find your perfect companion through our trusted adoption platform.
            </p>
            <p className="text-amber-200 text-sm">
              © 2024 PetAdopt. All rights reserved.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-amber-100">
              <li><a href="/" className="hover:text-white transition">Homepage</a></li>
              <li><a href="/pets" className="hover:text-white transition">My Pets</a></li>
              <li><a href="/applications" className="hover:text-white transition">My Applications</a></li>
              <li><a href="/profile" className="hover:text-white transition">My Profile</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-amber-100">
              <li><a href="#" className="hover:text-white transition">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition">Safety Tips</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-800 mt-8 pt-8 text-center text-amber-200 text-sm">
          <p>
            Made with <span className="text-red-400">♥</span> for pets and their future families
          </p>
        </div>
      </div>
    </footer>
  );
}
