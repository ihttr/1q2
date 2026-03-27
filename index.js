import { useState } from 'react';
import { Download, Link as LinkIcon, Film, Music, Youtube } from 'lucide-react';

export default function NexusDL() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://your-backend.onrender.com/extract?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      setVideoData(data);
    } catch (err) {
      alert("Error fetching video. Try another link.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-cyan-500/30 font-sans">
      {/* Navbar */}
      <nav className="border-b border-zinc-800/50 p-5 flex justify-between items-center bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-cyan-500 w-8 h-8 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Download size={18} className="text-black stroke-[3px]" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic">NexusDL</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
            Download <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Anything.</span>
          </h1>
          <p className="text-zinc-500 text-lg font-medium">Fast, free, and secure video downloader for the modern web.</p>
        </div>

        {/* Search Bar */}
        <div className="relative group max-w-2xl mx-auto mb-16">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition duration-500"></div>
          <div className="relative flex gap-2 bg-zinc-900 border border-zinc-800 p-2 rounded-2xl">
            <div className="flex items-center pl-4 text-zinc-500">
              <LinkIcon size={20} />
            </div>
            <input 
              className="w-full bg-transparent p-4 focus:outline-none font-medium" 
              placeholder="Paste URL (YouTube, Twitter, TikTok...)" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button 
              onClick={handleFetch}
              disabled={loading}
              className="bg-zinc-100 text-black px-8 rounded-xl font-bold hover:bg-cyan-400 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Analyze'}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {videoData && (
          <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-5 duration-700">
            <div className="space-y-4">
              <img src={videoData.thumbnail} className="w-full rounded-2xl shadow-2xl border border-zinc-800" alt="Thumbnail" />
              <h2 className="text-2xl font-bold leading-tight">{videoData.title}</h2>
              <div className="flex gap-4 text-zinc-400 text-sm">
                <span className="bg-zinc-800 px-3 py-1 rounded-full text-zinc-300">⏱ {videoData.duration}</span>
                <span className="bg-zinc-800 px-3 py-1 rounded-full text-zinc-300">👤 {videoData.uploader}</span>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 h-[500px] overflow-y-auto">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Film className="text-cyan-400" size={20} /> Available Formats
              </h3>
              <div className="space-y-3">
                {videoData.formats.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/40 hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-all">
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        {f.type === 'Audio' ? <Music size={14} /> : <Film size={14} />}
                        {f.res}
                      </div>
                      <div className="text-xs text-zinc-500 uppercase">{f.ext} • {f.size ? (f.size / 1024 / 1024).toFixed(1) + 'MB' : 'Unknown size'}</div>
                    </div>
                    <a 
                      href={f.url} 
                      target="_blank" 
                      className="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-black px-4 py-2 rounded-lg font-bold text-sm transition-all"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
