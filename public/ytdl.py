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
from rich.panel import Panel
from rich.table import Table

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
    console.print(center_text("YouTube Downloader - V2", "bold green"))
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
    # Remove invalid characters
    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    # Replace multiple spaces with single space
    filename = re.sub(r'\s+', ' ', filename)
    # Remove leading/trailing spaces and dots
    filename = filename.strip(' .')
    # Limit length to 100 characters
    if len(filename) > 100:
        filename = filename[:100].rsplit(' ', 1)[0]
    return filename if filename else "video"

def get_format_selector(quality):
    """Get optimized format selector for different qualities"""
    format_selectors = {
        'best': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        'high': 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best',
        'medium': 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best',
        'low': 'bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[height<=480][ext=mp4]/best',
        'audio': 'bestaudio/best'
    }
    return format_selectors.get(quality, format_selectors['medium'])

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
            
            if 'entries' in info:  # Playlist
                return {
                    'title': info.get('title', 'Unknown Playlist'),
                    'uploader': info.get('uploader', 'Unknown'),
                    'count': len(info.get('entries', [])),
                    'type': 'playlist'
                }
            else:  # Single video
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

def download_single_video(url, quality, output_path):
    """Download a single video with progress tracking"""
    try:
        # Create output directory
        Path(output_path).mkdir(parents=True, exist_ok=True)
        
        # Setup yt-dlp options
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'outtmpl': str(Path(output_path) / '%(title)s.%(ext)s'),
            'format': get_format_selector(quality),
            'merge_output_format': 'mp4' if quality != 'audio' else None,
            'writesubtitles': False,
            'writeautomaticsub': False,
        }
        
        # Add audio processing for audio-only downloads
        if quality == 'audio':
            ydl_opts['postprocessors'] = [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]
        
        # Progress tracking
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
            
            ydl_opts['progress_hooks'] = [progress_hook]
            
            # Download the video
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([url])
                progress.update(task, completed=100, description="Download complete!")
                time.sleep(0.5)  # Brief pause to show completion
        
        return True, None
    
    except Exception as e:
        return False, str(e)

def download_playlist(url, quality, output_path):
    """Download playlist"""
    try:
        # Get playlist info first
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
        
        # Create playlist-specific directory
        playlist_name = sanitize_filename(info.get('title', 'Unknown_Playlist'))
        playlist_path = Path(output_path) / playlist_name
        playlist_path.mkdir(parents=True, exist_ok=True)
        
        # Download setup
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'outtmpl': str(playlist_path / '%(playlist_index)s - %(title)s.%(ext)s'),
            'format': get_format_selector(quality),
            'merge_output_format': 'mp4' if quality != 'audio' else None,
            'ignoreerrors': True,  # Continue on errors
        }
        
        if quality == 'audio':
            ydl_opts['postprocessors'] = [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }]
        
        # Progress tracking
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
            
            # Download playlist
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

def show_quality_menu(is_playlist_url=False):
    """Show quality selection menu"""
    table = Table(title="Quality Options", show_header=True, header_style="bold cyan")
    table.add_column("Option", style="dim", width=8)
    table.add_column("Quality", style="green")
    table.add_column("Description", style="dim")
    
    table.add_row("1", "Best", "Highest available quality")
    table.add_row("2", "High", "1080p or best available")
    table.add_row("3", "Medium", "720p (recommended)")
    table.add_row("4", "Low", "480p (faster download)")
    table.add_row("5", "Audio", "MP3 audio only")
    
    console.print(table)
    
    prompt_text = "Select quality option (1-5)" if not is_playlist_url else "Select quality for playlist (1-5)"
    return Prompt.ask(prompt_text, choices=["1", "2", "3", "4", "5"], default="3")

def main():
    """Main application loop"""
    try:
        check_dependencies()
        
        # Setup directory structure
        base_dir = Path.home() / "Downloads" / "YTDL"
        directories = {
            'videos': base_dir / "Videos",
            'audio': base_dir / "Audio", 
            'playlists': base_dir / "Playlists"
        }
        
        for directory in directories.values():
            directory.mkdir(parents=True, exist_ok=True)
        
        # Show interface
        clear_screen()
        show_banner()
        show_credits()
        
        # Check FFmpeg
        if not check_ffmpeg():
            console.print("⚠️  FFmpeg not found - Audio conversion may not work", style="yellow")
            console.print("   Install FFmpeg for full functionality", style="dim")
        
        console.print(f"\n📁 Downloads will be saved to: {base_dir}", style="dim")
        
        # Main loop
        while True:
            try:
                console.print("\n" + "="*50)
                
                # Get URL
                url = Prompt.ask("\n🔗 Enter YouTube URL").strip()
                
                if not url:
                    console.print("❌ Please enter a valid URL", style="red")
                    continue
                
                # Validate URL
                if not validate_url(url):
                    console.print("❌ Invalid YouTube URL", style="red")
                    continue
                
                # Get video/playlist info
                console.print("\n🔍 Analyzing URL...", style="yellow")
                info = get_video_info(url)
                
                if info['type'] == 'unknown':
                    console.print("❌ Could not get video information", style="red")
                    continue
                
                # Display info
                if info['type'] == 'playlist':
                    console.print(Panel(
                        f"📋 [bold cyan]Playlist:[/bold cyan] {info['title']}\n"
                        f"👤 [bold green]Channel:[/bold green] {info['uploader']}\n"
                        f"📹 [bold blue]Videos:[/bold blue] {info['count']}",
                        title="Playlist Information",
                        border_style="cyan"
                    ))
                    is_playlist_url = True
                else:
                    duration_str = format_duration(info.get('duration', 0))
                    console.print(Panel(
                        f"🎬 [bold cyan]Title:[/bold cyan] {info['title']}\n"
                        f"👤 [bold green]Channel:[/bold green] {info['uploader']}\n"
                        f"⏱️  [bold blue]Duration:[/bold blue] {duration_str}",
                        title="Video Information", 
                        border_style="green"
                    ))
                    is_playlist_url = False
                
                # Quality selection
                choice = show_quality_menu(is_playlist_url)
                
                quality_map = {
                    "1": "best",
                    "2": "high", 
                    "3": "medium",
                    "4": "low",
                    "5": "audio"
                }
                
                quality = quality_map[choice]
                
                # Determine output directory
                if is_playlist_url:
                    output_dir = directories['playlists']
                elif quality == 'audio':
                    output_dir = directories['audio']
                else:
                    output_dir = directories['videos']
                
                # Download
                console.print(f"\n🚀 Starting download in {quality} quality...", style="green")
                
                if is_playlist_url:
                    success = download_playlist(url, quality, output_dir)
                else:
                    success, error = download_single_video(url, quality, output_dir)
                    
                    if success:
                        console.print("✅ Download completed successfully!", style="green")
                        console.print(f"📁 Saved to: {output_dir}", style="dim")
                    else:
                        console.print(f"❌ Download failed: {error}", style="red")
                
                # Continue prompt
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
