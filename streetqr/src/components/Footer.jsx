import React from 'react';
import {
  FaLinkedin,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaFacebook,
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-neutral-100 pt-16 border-t border-gray-200 text-gray-800 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 pb-12">
          {/* Qzaar Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-4xl font-extrabold text-emerald-600 mb-4">Qzaar</h2>
            <p className="text-sm text-gray-600 max-w-xs">
              Empowering Indian street food vendors with modern tools. Go digital, get orders, grow your business.
            </p>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-bold uppercase mb-3 tracking-wider">About</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#" className="hover:text-emerald-600 no-underline">Who We Are</a></li>
              <li><a href="#" className="hover:text-emerald-600 no-underline">Careers</a></li>
              <li><a href="#" className="hover:text-emerald-600 no-underline">Blog</a></li>
              <li><a href="#" className="hover:text-emerald-600 no-underline">Contact</a></li>
            </ul>
          </div>

          {/* Vendors */}
          <div>
            <h3 className="text-sm font-bold uppercase mb-3 tracking-wider">Vendors</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#" className="hover:text-emerald-600 no-underline">Get Started</a></li>
              <li><a href="#" className="hover:text-emerald-600 no-underline">Qzaar App</a></li>
              <li><a href="#" className="hover:text-emerald-600 no-underline">FAQs</a></li>
              <li><a href="#" className="hover:text-emerald-600 no-underline">Support</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold uppercase mb-3 tracking-wider">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="#" className="hover:text-emerald-600 no-underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-emerald-600 no-underline">Terms of Service</a></li>
              <li><a href="#" className="hover:text-emerald-600 no-underline">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-t border-gray-300 my-6" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Social Media */}
          <div className="flex space-x-4">
            <a href="#"><FaFacebook className="text-2xl hover:text-blue-600" /></a>
            <a href="#"><FaInstagram className="text-2xl hover:text-pink-500" /></a>
            <a href="#"><FaTwitter className="text-2xl hover:text-sky-500" /></a>
            <a href="#"><FaYoutube className="text-2xl hover:text-red-600" /></a>
            <a href="#"><FaLinkedin className="text-2xl hover:text-emerald-600" /></a>
          </div>

          {/* App Store Links */}
          <div className="flex gap-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Available_on_the_App_Store_%28black%29_SVG.svg"
              alt="App Store"
              className="h-10"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Google Play"
              className="h-10"
            />
          </div>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-500 text-center mt-6 pb-4">
          © {new Date().getFullYear()} Qzaar Technologies Pvt. Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
