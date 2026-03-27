// components/Downloader.js
import { useState } from 'react';

export default function Downloader() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchInfo = async () => {
    setLoading(true);
    const res = await fetch(`https://your-backend-url.onrender.com/info?url=${url}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Video Downloader
        </h1>
        
        <div className="flex gap-2 mb-12">
          <input 
            className="flex-1 bg-zinc-900 border border-zinc-800 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Paste video link here (YouTube, Twitter, etc.)"
            onChange={(e) => setUrl(e.target.value)}
          />
          <button 
            onClick={fetchInfo}
            className="bg-blue-600 hover:bg-blue-500 px-8 rounded-xl font-bold transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Fetch'}
          </button>
        </div>

        {data && (
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 animate-in fade-in duration-500">
            <div className="flex gap-6 mb-8">
              <img src={data.thumbnail} className="w-48 rounded-lg shadow-2xl" />
              <div>
                <h2 className="text-xl font-semibold mb-2">{data.title}</h2>
                <p className="text-zinc-400">Duration: {data.duration}s</p>
              </div>
            </div>

            <div className="grid gap-3">
              {data.formats.filter(f => f.url).slice(0, 10).map((f, i) => (
                <div key={i} className="flex items-center justify-between bg-zinc-800/50 p-4 rounded-lg hover:bg-zinc-800 transition-colors">
                  <span>{f.resolution} ({f.ext}) - {f.note || 'Video'}</span>
                  <a 
                    href={f.url} 
                    target="_blank" 
                    className="text-blue-400 hover:underline font-medium"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
