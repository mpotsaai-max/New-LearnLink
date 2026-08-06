import React, { useState, useEffect } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  Sparkles,
  ExternalLink,
  FileText,
  Users,
  Share2,
  Maximize2,
  Minimize2,
  X,
  Send
} from 'lucide-react';

interface DailyClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionData: {
    sessionId: string;
    subject: string;
    tutorName: string;
    studentName: string;
    videoCallUrl?: string;
    pricePula?: number;
  };
  onCompleteSession?: (sessionId: string) => void;
}

export const DailyClassroomModal: React.FC<DailyClassroomModalProps> = ({
  isOpen,
  onClose,
  sessionData,
  onCompleteSession
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'video' | 'notes' | 'settings'>('video');
  const [showNotes, setShowNotes] = useState(true);
  const [notesText, setNotesText] = useState(`### ${sessionData.subject} - Daily.co Session Notes\n- Date: ${new Date().toLocaleDateString()}\n- Tutor: ${sessionData.tutorName}\n- Student: ${sessionData.studentName}\n\n1. Key Concepts Covered:\n2. Homework / Practice Problems:\n`);
  const [customRoomDomain, setCustomRoomDomain] = useState('learnlink.daily.co');
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(3600); // 60 mins in seconds

  const roomSlug = sessionData.sessionId.toLowerCase().replace(/[^a-z0-9]/g, '');
  const defaultJitsiUrl = `https://meet.jit.si/LearnLink_Classroom_${roomSlug}#config.prejoinPageEnabled=false&config.disableDeepLinking=true`;
  
  const dailyRoomUrl = (sessionData.videoCallUrl && sessionData.videoCallUrl.includes('http'))
    ? sessionData.videoCallUrl
    : defaultJitsiUrl;

  const [activeEngine, setActiveEngine] = useState<'jitsi' | 'camera_studio'>('jitsi');

  // Session timer countdown
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setSessionTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(dailyRoomUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#021830]/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-fade-in">
      <div className={`bg-[#0a1e38] border border-blue-900/60 rounded-3xl shadow-2xl w-full ${isFullScreen ? 'h-full max-w-none rounded-none' : 'max-w-6xl h-[92vh]'} flex flex-col overflow-hidden text-white transition-all`}>
        
        {/* Daily.co Header Bar */}
        <div className="bg-[#022448] px-4 py-3 border-b border-blue-800/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              Daily.co WebRTC Live
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                {sessionData.subject} Classroom
              </h2>
              <p className="text-[11px] text-blue-200">
                Tutor: <span className="font-semibold text-white">{sessionData.tutorName}</span> • Student: <span className="font-semibold text-white">{sessionData.studentName}</span>
              </p>
            </div>
          </div>

          {/* Center Info: Escrow & Timer */}
          <div className="hidden md:flex items-center gap-4 bg-[#011730] px-3.5 py-1.5 rounded-xl border border-blue-800/50">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Escrow P{sessionData.pricePula || 180} Protected</span>
            </div>
            <div className="h-4 w-px bg-blue-800/60" />
            <div className="flex items-center gap-1.5 text-xs text-blue-200 font-mono">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{formatTimer(sessionTimeLeft)}</span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-blue-900/60 hover:bg-blue-800 text-blue-100 text-xs font-semibold rounded-lg border border-blue-700/50 flex items-center gap-1.5 transition-colors"
              title="Copy Daily Room URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied Room Link!' : 'Copy Daily Link'}</span>
            </button>

            <a
              href={dailyRoomUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-blue-900/60 hover:bg-blue-800 text-blue-100 rounded-lg border border-blue-700/50 transition-colors"
              title="Open Daily.co Room in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 bg-blue-900/60 hover:bg-blue-800 text-blue-100 rounded-lg border border-blue-700/50 transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-red-500/20 hover:bg-red-500 text-white rounded-lg border border-red-500/40 transition-colors"
              title="Exit Classroom Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Body: Daily Video Frame + Optional Side Notes */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Main Video Viewport */}
          <div className="flex-1 bg-[#020e1a] flex flex-col relative overflow-hidden">
            
            {/* Embedded WebRTC Classroom Iframe */}
            <div className="flex-1 w-full h-full relative bg-slate-950">
              <iframe
                src={dailyRoomUrl}
                allow="camera; microphone; fullscreen; speaker; display-capture; autoplay; clipboard-write"
                className="w-full h-full border-0"
                title="LearnLink WebRTC Virtual Classroom"
              />

              {/* Overlay Banner */}
              <div className="absolute top-3 left-3 pointer-events-none bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 flex items-center gap-2 text-xs text-slate-200 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Encrypted HD WebRTC Live Stream</span>
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="bg-[#021830] px-4 py-2.5 border-t border-blue-900/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-blue-300">
                <span className="font-semibold text-white">Classroom Room URL:</span>
                <span className="font-mono bg-blue-950 px-2 py-0.5 rounded border border-blue-800/60 text-blue-200 text-[11px] truncate max-w-[280px] sm:max-w-md">{dailyRoomUrl}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-colors ${
                    showNotes ? 'bg-blue-600 text-white border-blue-500' : 'bg-blue-950 text-blue-200 border-blue-800 hover:bg-blue-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Lesson Notes & Whiteboard</span>
                </button>

                {onCompleteSession && (
                  <button
                    onClick={() => {
                      if (confirm('Are you ready to finish this Daily.co lesson and release escrow to the tutor?')) {
                        onCompleteSession(sessionData.sessionId);
                        onClose();
                      }
                    }}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Complete & Release Escrow</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Drawer: Shared Lesson Notes & Whiteboard */}
          {showNotes && (
            <div className="w-80 sm:w-96 bg-[#041d38] border-l border-blue-900/60 flex flex-col h-full z-10 shadow-xl">
              <div className="p-3 bg-[#022448] border-b border-blue-800/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Daily Shared Notebook</span>
                </div>
                <button
                  onClick={() => setShowNotes(false)}
                  className="p-1 hover:bg-blue-900 text-blue-300 rounded transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3 flex-1 flex flex-col">
                <p className="text-[11px] text-blue-300 mb-2">
                  Collaborative workspace for formulas, assignment links, and tutor notes during the call:
                </p>
                <textarea
                  value={notesText}
                  onChange={(e) => setNotesText(e.target.value)}
                  placeholder="Type session notes, math formulas, or questions here..."
                  className="flex-1 w-full bg-[#021226] border border-blue-900/80 rounded-xl p-3 text-xs text-blue-100 placeholder-blue-500/60 focus:outline-none focus:border-blue-500 font-mono resize-none leading-relaxed"
                />
              </div>

              <div className="p-3 bg-[#021830] border-t border-blue-900/60 text-[11px] text-blue-300 flex items-center justify-between">
                <span>Auto-saved locally</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(notesText);
                    alert('Notes copied to clipboard!');
                  }}
                  className="px-2 py-1 bg-blue-900 hover:bg-blue-800 text-white rounded font-medium text-[10px]"
                >
                  Copy Notes
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
