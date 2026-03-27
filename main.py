from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import yt_dlp
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/extract")
def extract_video(url: str = Query(..., description="The video URL")):
    # Options to bypass simple bot detection
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'format': 'best',
        # 'cookiefile': 'cookies.txt', # UNCOMMENT THIS LATER (See step 3)
        'http_headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        }
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Extract only the useful data for the UI
            formats = []
            for f in info.get('formats', []):
                # Filter for links that actually work and have audio+video combined
                if f.get('url') and f.get('vcodec') != 'none':
                    formats.append({
                        'id': f.get('format_id'),
                        'ext': f.get('ext'),
                        'res': f.get('resolution') or f.get('format_note'),
                        'url': f.get('url'),
                        'size': f.get('filesize_approx') or f.get('filesize'),
                        'type': 'Video'
                    })
                elif f.get('acodec') != 'none' and f.get('vcodec') == 'none':
                    formats.append({
                        'id': f.get('format_id'),
                        'ext': f.get('ext'),
                        'res': 'Audio Only',
                        'url': f.get('url'),
                        'size': f.get('filesize_approx') or f.get('filesize'),
                        'type': 'Audio'
                    })

            return {
                "title": info.get('title'),
                "thumbnail": info.get('thumbnail'),
                "duration": info.get('duration_string'),
                "uploader": info.get('uploader'),
                "formats": formats[::-1][:15] # Return top 15 formats
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
