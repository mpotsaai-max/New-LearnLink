import React from 'react';
import { GraduationCap, ShieldCheck, Phone, Mail, MapPin, Smartphone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#022448] text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#feae2c] flex items-center justify-center text-[#022448] font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight">LearnLink</span>
            </div>
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Botswana&apos;s premier tutoring network connecting primary, secondary, and tertiary students with top verified educators with mobile money escrow security.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Escrow Protected
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#feae2c] uppercase tracking-wider">Explore Platform</h4>
            <ul className="space-y-2 text-xs text-blue-200/80">
              <li><a href="#tutors" className="hover:text-white transition-colors">Find Mathematics Tutors</a></li>
              <li><a href="#tutors" className="hover:text-white transition-colors">BGCSE & Science Specialists</a></li>
              <li><a href="#tutors" className="hover:text-white transition-colors">Computer Programming Mentors</a></li>
              <li><a href="#tutors" className="hover:text-white transition-colors">ACCA & Finance Educators</a></li>
              <li><a href="#tutors" className="hover:text-white transition-colors">Become a Verified Tutor</a></li>
            </ul>
          </div>

          {/* Mobile Money Escrow */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#feae2c] uppercase tracking-wider">Escrow Payment Options</h4>
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Payments are safely held in LearnLink Escrow until session completion.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <div className="px-3 py-1.5 bg-orange-500/20 text-orange-300 rounded-lg text-xs font-semibold border border-orange-500/30 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" /> OrangeMoney
              </div>
              <div className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg text-xs font-semibold border border-blue-500/30 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" /> Smega (BTC)
              </div>
              <div className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" /> MyZaka (Mascom)
              </div>
            </div>
          </div>

          {/* Contact Botswana Office */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#feae2c] uppercase tracking-wider">Botswana Headquarters</h4>
            <ul className="space-y-2.5 text-xs text-blue-200/80">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#feae2c] shrink-0 mt-0.5" />
                <span>Gaborone Innovation Hub, Plot 69184, Block 8, Gaborone</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#feae2c] shrink-0" />
                <span>+267 391 8000 / +267 71 234 567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#feae2c] shrink-0" />
                <span>support@learnlink.co.bw</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-200/60">
          <p>© 2026 LearnLink Botswana. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Escrow Service</a>
            <a href="#" className="hover:text-white">Tutor Code of Conduct</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
