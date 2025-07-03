import yt_dlp
import os
import sys
import time
import platform
import subprocess
import re
import threading
from pathlib import Path
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TaskProgressColumn, TimeRemainingColumn
from rich.prompt import Prompt, Confirm
from rich.text import Text

# Initialize rich console
console = Console()

def clear_screen():
    """Clear the terminal screen"""
    os.system('cls' if platform.system() == 'Windows' else 'clear')

def center_text(text, style=""):
    """Center text based on terminal width"""
    width = console.width
    return Text(text, style=style, justify="center")

def show_banner():
    """Display YTDL ASCII art"""
    console.print("\n")
    console.print(center_text(
        r"""
██    ██ ████████ ██████  ██      
 ██  ██     ██    ██   ██ ██      
  ████      ██    ██   ██ ██      
   ██       ██    ██   ██ ██      
   ██       ██    ██████  ███████
        """, 
        "bold cyan"
    ))

def show_credits():
    """Display centered credits"""
    console.print(center_text("YTDL YouTube Downloader V2", "bold green"))
    console.print(center_text("Developed with ♥ by Bhavesh Patil", "bright_red"))
    console.print(center_text("GitHub: https://github.com/iambhvsh", "dim"))
    console.print(center_text("Press `Ctrl+C` to exit anytime", "yellow"))

def check_dependencies():
    """Check and install dependencies"""
    required_packages = ['rich', 'yt-dlp']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        console.print(f"Installing missing dependencies: {', '.join(missing_packages)}", style="yellow")
        try:
            subprocess.check_call([
                sys.executable, '-m', 'pip', 'install', '--upgrade'
            ] + missing_packages, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            console.print("Dependencies installed successfully!", style="green")
            time.sleep(1)
        except subprocess.CalledProcessError:
            console.print("Failed to install dependencies. Please install manually.", style="red")
            sys.exit(1)

def check_ffmpeg():
    """Check if ffmpeg is installed"""
    try:
        result = subprocess.run(['ffmpeg', '-version'], 
                              capture_output=True, text=True, timeout=5)
        return result.returncode == 0
    except (subprocess.SubprocessError, FileNotFoundError, subprocess.TimeoutExpired):
        return False

def sanitize_filename(filename):
    """Sanitize filename to be safe for all operating systems"""
    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    filename = re.sub(r'\s+', ' ', filename)
    filename = filename.strip(' .')
    if len(filename) > 100:
        filename = filename[:100].rsplit(' ', 1)[0]
    return filename if filename else "video"

def get_available_formats(url):
    """Get available formats for a video"""
    try:
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'listformats': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            formats = info.get('formats', [])
            
            video_formats = []
            audio_formats = []
            
            for f in formats:
                if f.get('vcodec') != 'none' and f.get('acodec') != 'none':
                    height = f.get('height', 0)
                    if height and height >= 144:
                        video_formats.append({
                            'format_id': f['format_id'],
                            'ext': f.get('ext', 'mp4'),
                            'height': height,
                            'fps': f.get('fps', 0),
                            'filesize': f.get('filesize', 0),
                            'vcodec': f.get('vcodec', 'unknown'),
                            'acodec': f.get('acodec', 'unknown'),
                            'quality': f.get('quality', 0)
                        })
                elif f.get('acodec') != 'none' and f.get('vcodec') == 'none':
                    audio_formats.append({
                        'format_id': f['format_id'],
                        'ext': f.get('ext', 'mp3'),
                        'abr': f.get('abr', 0),
                        'acodec': f.get('acodec', 'unknown'),
                        'filesize': f.get('filesize', 0)
                    })
            
            video_formats.sort(key=lambda x: x['height'], reverse=True)
            audio_formats.sort(key=lambda x: x['abr'], reverse=True)
            
            return video_formats, audio_formats
            
    except Exception as e:
        console.print(f"Error getting formats: {str(e)}", style="red")
        return [], []

def get_fallback_format_selector(quality):
    """Get fallback format selectors that work with most videos"""
    selectors = {
        'best': 'best[ext=mp4]/best',
        'high': 'best[height<=1080]/best',
        'medium': 'best[height<=720]/best', 
        'low': 'best[height<=480]/best',
        'audio': 'bestaudio[ext=m4a]/bestaudio'
    }
    return selectors.get(quality, 'best')

def validate_url(url):
    """Validate if URL is a valid YouTube URL"""
    youtube_patterns = [
        r'(?:https?://)?(?:www\.)?youtube\.com/watch\?v=[\w-]+',
        r'(?:https?://)?(?:www\.)?youtube\.com/playlist\?list=[\w-]+',
        r'(?:https?://)?youtu\.be/[\w-]+',
        r'(?:https?://)?(?:www\.)?youtube\.com/channel/[\w-]+',
        r'(?:https?://)?(?:www\.)?youtube\.com/user/[\w-]+',
        r'(?:https?://)?(?:www\.)?youtube\.com/@[\w-]+',
    ]
    
    for pattern in youtube_patterns:
        if re.match(pattern, url, re.IGNORECASE):
            return True
    return False

def is_playlist(url):
    """Check if URL is a playlist"""
    try:
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': True,
            'skip_download': True,
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return 'entries' in info and len(info.get('entries', [])) > 1
    except Exception:
        return False

def get_video_info(url):
    """Get video/playlist information"""
    try:
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': True,
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            if 'entries' in info:
                return {
                    'title': info.get('title', 'Unknown Playlist'),
                    'uploader': info.get('uploader', 'Unknown'),
                    'count': len(info.get('entries', [])),
                    'type': 'playlist'
                }
            else:
                return {
                    'title': info.get('title', 'Unknown Video'),
                    'uploader': info.get('uploader', 'Unknown'),
                    'duration': info.get('duration', 0),
                    'type': 'video'
                }
    except Exception as e:
        console.print(f"Error getting video info: {str(e)}", style="red")
        return {'title': 'Unknown', 'uploader': 'Unknown', 'type': 'unknown'}

def format_duration(seconds):
    """Format duration in seconds to human readable format"""
    if not seconds:
        return "Unknown"
    
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60
    
    if hours > 0:
        return f"{hours}h {minutes}m {secs}s"
    elif minutes > 0:
        return f"{minutes}m {secs}s"
    else:
        return f"{secs}s"

def format_filesize(bytes_size):
    """Format file size in bytes to human readable format"""
    if not bytes_size:
        return "Unknown"
    
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes_size < 1024.0:
            return f"{bytes_size:.1f} {unit}"
        bytes_size /= 1024.0
    return f"{bytes_size:.1f} TB"

def show_available_qualities(url):
    """Show available qualities for a video and let user choose"""
    console.print("\n🔍 Analyzing available qualities...", style="yellow")
    
    video_formats, audio_formats = get_available_formats(url)
    
    if not video_formats and not audio_formats:
        console.print("❌ Could not retrieve available formats", style="red")
        return {'selector': get_fallback_format_selector('medium'), 'type': 'video'}
    
    console.print("\nAvailable Quality Options:")
    
    options = {}
    option_count = 1
    
    # Add video formats
    seen_heights = set()
    for fmt in video_formats:
        height = fmt['height']
        if height not in seen_heights and height >= 144:
            seen_heights.add(height)
            quality_name = f"{height}p"
            if height >= 1080:
                quality_name += " (HD)"
            elif height >= 720:
                quality_name += " (HD)"
            
            size_info = format_filesize(fmt['filesize']) if fmt['filesize'] else "Unknown size"
            
            console.print(f"{option_count}. {quality_name} - {fmt['ext'].upper()} - {size_info}")
            
            options[str(option_count)] = {
                'type': 'video',
                'format_id': fmt['format_id'],
                'selector': f"best[height<={height}]/best"
            }
            option_count += 1
            
            if option_count > 6:
                break
    
    # Add audio option
    if audio_formats:
        best_audio = audio_formats[0]
        bitrate = f"{best_audio['abr']}kbps" if best_audio['abr'] else "Unknown bitrate"
        size_info = format_filesize(best_audio['filesize']) if best_audio['filesize'] else "Unknown size"
        
        console.print(f"{option_count}. Audio Only - MP3 - {bitrate} - {size_info}")
        
        options[str(option_count)] = {
            'type': 'audio',
            'format_id': best_audio['format_id'],
            'selector': 'bestaudio'
        }
    
    # Get user choice
    valid_choices = list(options.keys())
    choice = Prompt.ask(f"Select quality option ({'/'.join(valid_choices)})", 
                       choices=valid_choices, default=valid_choices[0] if valid_choices else "1")
    
    return options.get(choice, {'selector': 'best', 'type': 'video'})

def download_single_video(url, format_choice, output_path):
    """Download a single video with progress tracking"""
    try:
        Path(output_path).mkdir(parents=True, exist_ok=True)
        
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'outtmpl': str(Path(output_path) / '%(title)s.%(ext)s'),
            'format': format_choice['selector'],
            'merge_output_format': 'mp4' if format_choice['type'] != 'audio' else None,
            'writesubtitles': False,
            'writeautomaticsub': False,
            'ignoreerrors': False,
        }
        
        if format_choice['type'] == 'audio':
            ydl_opts['postprocessors'] = [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(bar_width=None),
            TaskProgressColumn(),
            TimeRemainingColumn(),
            console=console,
            transient=False
        ) as progress:
            
            task = progress.add_task("Preparing download...", total=100)
            
            def progress_hook(d):
                if d['status'] == 'downloading':
                    filename = Path(d.get('filename', '')).name
                    total = d.get('total_bytes') or d.get('total_bytes_estimate')
                    downloaded = d.get('downloaded_bytes', 0)
                    
                    if total:
                        percentage = (downloaded / total) * 100
                        progress.update(task, 
                                      description=f"Downloading: {filename[:30]}...",
                                      completed=percentage)
                    else:
                        progress.update(task, 
                                      description=f"Downloading: {filename[:30]}...")
                
                elif d['status'] == 'finished':
                    progress.update(task, 
                                  description="Processing...", 
                                  completed=90)
                
                elif d['status'] == 'error':
                    progress.update(task, 
                                  description="Error occurred", 
                                  completed=0)
            
            ydl_opts['progress_hooks'] = [progress_hook]
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])
                progress.update(task, completed=100, description="Download complete!")
                time.sleep(0.5)
        
        return True, None
    
    except Exception as e:
        error_msg = str(e)
        if "Requested format is not available" in error_msg:
            error_msg = "Selected quality is not available for this video. Please try a different quality."
        elif "Private video" in error_msg:
            error_msg = "This video is private or restricted."
        elif "Video unavailable" in error_msg:
            error_msg = "This video is not available."
        else:
            error_msg = "Download failed. Please check your internet connection and try again."
        
        return False, error_msg

def download_playlist(url, quality_selector, output_path):
    """Download playlist with enhanced progress tracking"""
    try:
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            if 'entries' not in info:
                console.print("❌ Not a valid playlist", style="red")
                return False
            
            entries = [entry for entry in info['entries'] if entry]
            total_videos = len(entries)
            
            console.print(f"📋 Playlist: {info.get('title', 'Unknown')}", style="cyan")
            console.print(f"📹 Videos found: {total_videos}", style="green")
        
        playlist_name = sanitize_filename(info.get('title', 'Unknown_Playlist'))
        playlist_path = Path(output_path) / playlist_name
        playlist_path.mkdir(parents=True, exist_ok=True)
        
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'outtmpl': str(playlist_path / '%(playlist_index)s - %(title)s.%(ext)s'),
            'format': quality_selector,
            'merge_output_format': 'mp4',
            'ignoreerrors': True,
        }
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(bar_width=None),
            TaskProgressColumn(),
            TimeRemainingColumn(),
            console=console,
            transient=False
        ) as progress:
            
            overall_task = progress.add_task("Starting playlist download...", total=total_videos)
            current_task = progress.add_task("Preparing...", total=100)
            
            completed_count = 0
            current_video = ""
            
            def progress_hook(d):
                nonlocal completed_count, current_video
                
                if d['status'] == 'downloading':
                    filename = Path(d.get('filename', '')).name
                    current_video = filename[:40]
                    
                    total = d.get('total_bytes') or d.get('total_bytes_estimate')
                    downloaded = d.get('downloaded_bytes', 0)
                    
                    if total:
                        percentage = (downloaded / total) * 100
                        progress.update(current_task, 
                                      description=f"Downloading: {current_video}...",
                                      completed=percentage)
                    
                    progress.update(overall_task, 
                                  description=f"Playlist: {completed_count}/{total_videos} - {current_video}...")
                
                elif d['status'] == 'finished':
                    completed_count += 1
                    progress.update(overall_task, completed=completed_count)
                    progress.update(current_task, completed=100, description="Processing...")
            
            ydl_opts['progress_hooks'] = [progress_hook]
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])
                
                progress.update(overall_task, completed=total_videos, 
                              description=f"Playlist complete! ({completed_count}/{total_videos})")
                progress.update(current_task, completed=100, description="All downloads finished!")
        
        console.print(f"✅ Playlist download complete!", style="green")
        console.print(f"📁 Saved to: {playlist_path}", style="dim")
        return True
        
    except Exception as e:
        console.print(f"❌ Playlist download error: {str(e)}", style="red")
        return False

def main():
    """Main application loop"""
    try:
        check_dependencies()
        
        base_dir = Path.home() / "Downloads" / "YTDL"
        directories = {
            'videos': base_dir / "Videos",
            'audio': base_dir / "Audio", 
            'playlists': base_dir / "Playlists"
        }
        
        for directory in directories.values():
            directory.mkdir(parents=True, exist_ok=True)
        
        clear_screen()
        show_banner()
        show_credits()
        
        if not check_ffmpeg():
            console.print("⚠️  FFmpeg not found - Audio conversion may not work properly", style="yellow")
            console.print("   Install FFmpeg for full functionality", style="dim")
        
        console.print(f"\n📁 Downloads will be saved to: {base_dir}", style="dim")
        
        while True:
            try:
                console.print("\n" + "="*50)
                
                url = Prompt.ask("\n🔗 Enter YouTube URL").strip()
                
                if not url:
                    console.print("❌ Please enter a valid URL", style="red")
                    continue
                
                if not validate_url(url):
                    console.print("❌ Invalid YouTube URL", style="red")
                    continue
                
                console.print("\n🔍 Analyzing URL...", style="yellow")
                info = get_video_info(url)
                
                if info['type'] == 'unknown':
                    console.print("❌ Could not get video information", style="red")
                    continue
                
                if info['type'] == 'playlist':
                    console.print(f"\n📋 Playlist: {info['title']}")
                    console.print(f"👤 Channel: {info['uploader']}")
                    console.print(f"📹 Videos: {info['count']}")
                    
                    console.print("\nPlaylist Quality Options:")
                    console.print("1. Best Available Quality")
                    console.print("2. 720p (Recommended)")
                    console.print("3. 480p (Faster)")
                    console.print("4. Audio Only (MP3)")
                    
                    choice = Prompt.ask("Select quality (1-4)", choices=["1", "2", "3", "4"], default="2")
                    
                    quality_map = {
                        "1": "best",
                        "2": "best[height<=720]/best",
                        "3": "best[height<=480]/best",
                        "4": "bestaudio"
                    }
                    
                    quality_selector = quality_map[choice]
                    output_dir = directories['playlists']
                    
                    console.print(f"\n🚀 Starting playlist download...", style="green")
                    success = download_playlist(url, quality_selector, output_dir)
                    
                else:
                    duration_str = format_duration(info.get('duration', 0))
                    console.print(f"\n🎬 Title: {info['title']}")
                    console.print(f"👤 Channel: {info['uploader']}")
                    console.print(f"⏱️  Duration: {duration_str}")
                    
                    format_choice = show_available_qualities(url)
                    
                    if format_choice['type'] == 'audio':
                        output_dir = directories['audio']
                    else:
                        output_dir = directories['videos']
                    
                    console.print(f"\n🚀 Starting download...", style="green")
                    success, error = download_single_video(url, format_choice, output_dir)
                    
                    if success:
                        console.print("✅ Download completed successfully!", style="green")
                        console.print(f"📁 Saved to: {output_dir}", style="dim")
                    else:
                        console.print(f"❌ Download failed: {error}", style="red")
                
                if not Confirm.ask("\n🔄 Download another video/playlist?", default=True):
                    break
                    
            except KeyboardInterrupt:
                console.print("\n\n👋 Download interrupted by user", style="yellow")
                break
            except Exception as e:
                console.print(f"\n❌ Unexpected error: {str(e)}", style="red")
                
        console.print("\n✨ Thank you for using YTDL!", style="cyan")
        console.print("🔗 GitHub: https://github.com/iambhvsh", style="dim")
        
    except KeyboardInterrupt:
        console.print("\n\n👋 Goodbye!", style="cyan")
    except Exception as e:
        console.print(f"\n💥 Critical error: {str(e)}", style="red")
        sys.exit(1)

if __name__ == "__main__":
    main()
