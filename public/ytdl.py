import yt_dlp
import os
import sys
import time
import platform
import subprocess
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
    console.print(center_text("Developed with ♥ by Bhavesh Patil", "bright_red"))
    console.print(center_text("GitHub: https://github.com/iambhvsh", "dim"))
    console.print(center_text("Press `Q` to exit anytime", "yellow"))

def check_dependencies():
    """Check and install dependencies"""
    try:
        import rich
    except ImportError:
        console.print("Installing required dependencies...", style="yellow")
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'rich', 'yt-dlp'], 
                            stdout=subprocess.DEVNULL, 
                            stderr=subprocess.DEVNULL)
        console.print("Dependencies installed successfully!", style="green")
        time.sleep(1)

def check_ffmpeg():
    """Check if ffmpeg is installed"""
    try:
        subprocess.run(['ffmpeg', '-version'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return True
    except (subprocess.SubprocessError, FileNotFoundError):
        return False

def get_supported_format(quality):
    """Device-compatible format selection"""
    return {
        'best': 'bestvideo[ext=mp4][vcodec^=avc1]+bestaudio/best[ext=mp4]',
        'medium': 'bestvideo[height<=720][ext=mp4][vcodec^=avc1]+bestaudio/best[height<=720][ext=mp4]',
        'low': 'bestvideo[height<=480][ext=mp4][vcodec^=avc1]+bestaudio/best[height<=480][ext=mp4]',
        'audio': 'bestaudio/best'
    }.get(quality, 'bestvideo[ext=mp4][vcodec^=avc1]+bestaudio/best[ext=mp4]')

def check_exit(input_text):
    """Check if user wants to exit"""
    if input_text and input_text.lower() in ('q', 'quit', 'exit'):
        console.print("\nExiting YTDL. Goodbye!", style="cyan")
        sys.exit(0)
    return input_text

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
            return 'entries' in info and len(info['entries']) > 1
    except:
        return False

def get_video_info(url):
    """Get video title and author"""
    try:
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return {
                'title': info.get('title', 'Unknown'),
                'uploader': info.get('uploader', 'Unknown')
            }
    except:
        return {'title': 'Unknown', 'uploader': 'Unknown'}

def download_with_progress(url, quality, output_path):
    """Minimal progress display downloader"""
    os.makedirs(output_path, exist_ok=True)
    
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'outtmpl': os.path.join(output_path, '%(title)s.%(ext)s'),
        'merge_output_format': 'mp4',
        'format': get_supported_format(quality),
        'windowsfilenames': True,
    }

    if quality == 'audio':
        ydl_opts.update({
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
        })

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(bar_width=None),
        TaskProgressColumn(),
        TimeRemainingColumn(),
        transient=False
    ) as progress:
        try:
            task = progress.add_task("Analyzing...", total=100)
            
            def update_progress(d):
                if d['status'] == 'downloading':
                    progress.update(task, description=f"Downloading: {d.get('filename', '').split('/')[-1]}", 
                                  completed=d.get('downloaded_bytes', 0),
                                  total=d.get('total_bytes') or d.get('total_bytes_estimate', 100))
                elif d['status'] == 'finished':
                    progress.update(task, description="Processing video...", completed=95)
            
            ydl_opts['progress_hooks'] = [update_progress]
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                progress.update(task, completed=100, description="Complete")
            
            title = info.get('title', 'video').replace(' ', '_')[:50]
            ext = 'mp3' if quality == 'audio' else 'mp4'
            return os.path.join(output_path, f"{title}.{ext}"), None
        
        except Exception as e:
            return None, str(e)

def download_playlist(url, quality, output_path):
    """Download all videos in a playlist"""
    try:
        # First get playlist info
        ydl_opts = {
            'quiet': True,
            'extract_flat': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            if 'entries' not in info:
                console.print("Not a valid playlist", style="red")
                return
                
            videos = len(info['entries'])
            console.print(f"Found {videos} videos in playlist: {info.get('title', 'Unknown')}", style="green")
        
        # Now download each video
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(bar_width=None),
            TaskProgressColumn(),
            TimeRemainingColumn(),
            transient=False
        ) as progress:
            overall_task = progress.add_task(f"Playlist Progress (0/{videos})", total=videos)
            
            ydl_opts = {
                'quiet': True,
                'no_warnings': True,
                'outtmpl': os.path.join(output_path, '%(title)s.%(ext)s'),
                'merge_output_format': 'mp4' if quality != 'audio' else None,
                'format': get_supported_format(quality),
                'windowsfilenames': True,
            }
            
            if quality == 'audio':
                ydl_opts.update({
                    'postprocessors': [{
                        'key': 'FFmpegExtractAudio',
                        'preferredcodec': 'mp3',
                        'preferredquality': '192',
                    }],
                })
            
            # Custom callback to track both individual video and overall progress
            completed_videos = 0
            current_video_title = "Unknown video"
            
            def my_hook(d):
                nonlocal completed_videos, current_video_title
                
                if d['status'] == 'downloading':
                    progress.update(overall_task, description=f"Playlist: {completed_videos}/{videos} - {current_video_title[:30]}")
                
                elif d['status'] == 'finished':
                    completed_videos += 1
                    progress.update(overall_task, completed=completed_videos)
                    
            ydl_opts['progress_hooks'] = [my_hook]
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                # We need to process entries one by one to track progress
                for i, entry in enumerate(info['entries']):
                    if not entry:
                        continue
                    
                    video_url = entry.get('url')
                    if not video_url:
                        continue
                        
                    try:
                        # Get video title first
                        info_opts = {'quiet': True, 'no_warnings': True}
                        with yt_dlp.YoutubeDL(info_opts) as info_ydl:
                            video_info = info_ydl.extract_info(video_url, download=False)
                            current_video_title = video_info.get('title', f"Video {i+1}")
                        
                        # Download the video
                        ydl.download([video_url])
                    except Exception as e:
                        console.print(f"Error downloading video {i+1}: {str(e)}", style="red")
                    
                    # Check for keyboard input to exit
                    if sys.stdin in select.select([sys.stdin], [], [], 0)[0]:
                        key = sys.stdin.read(1)
                        if key.lower() == 'q':
                            console.print("\nExiting playlist download...", style="yellow")
                            return
            
            console.print(f"✔️ Playlist download complete! ({completed_videos}/{videos} videos)", style="green")
            
    except Exception as e:
        console.print(f"❌Error: {str(e)}", style="red")

def main():
    check_dependencies()
    
    # Set download path to user's Downloads/ytdl folder with proper subfolders
    base_dir = os.path.join(os.path.expanduser("~"), "Downloads", "ytdl")
    videos_dir = os.path.join(base_dir, "Videos")
    audios_dir = os.path.join(base_dir, "Audios")
    playlists_dir = os.path.join(base_dir, "Playlists")
    
    # Create all directories
    for directory in [base_dir, videos_dir, audios_dir, playlists_dir]:
        os.makedirs(directory, exist_ok=True)
    
    clear_screen()
    show_banner()
    show_credits()

    if not check_ffmpeg():
        console.print("FFmpeg not found - MP3 conversion may not work", style="yellow")

    while True:
        try:
            # Use custom prompt function that checks for 'q'
            url_input = Prompt.ask("\nEnter YouTube URL (or 'q' to quit)")
            check_exit(url_input)
            url = url_input

            # Auto-detect if URL is a playlist
            is_playlist_url = is_playlist(url)
            
            if is_playlist_url:
                console.print("\nPlaylist detected!", style="cyan")
                console.print("1. Download videos in best quality")
                console.print("2. Download videos in medium quality")
                console.print("3. Download videos in low quality")
                console.print("4. Download playlist as audio (MP3)")
                
                choice_input = Prompt.ask("\nSelect option (or 'q' to quit)", choices=["1", "2", "3", "4", "q"], default="2")
                check_exit(choice_input)
                choice = choice_input
                
                quality_map = {
                    "1": "best", 
                    "2": "medium", 
                    "3": "low", 
                    "4": "audio"
                }
                
                quality = quality_map[choice]
                
                # Store in Playlists folder
                playlist_output_folder = playlists_dir
                
                download_playlist(url, quality, playlist_output_folder)
            else:
                # Get video info and display minimal details
                info = get_video_info(url)
                console.print(f"\nTitle: {info['title']}", style="cyan")
                console.print(f"Channel: {info['uploader']}", style="green")
                
                console.print("\n1. Best quality")
                console.print("2. Medium quality")
                console.print("3. Low quality")
                console.print("4. Audio only (MP3)")
                
                choice_input = Prompt.ask("\nSelect option (or 'q' to quit)", choices=["1", "2", "3", "4", "q"], default="1")
                check_exit(choice_input)
                choice = choice_input
                
                quality_map = {
                    "1": "best", 
                    "2": "medium", 
                    "3": "low", 
                    "4": "audio"
                }
                
                quality = quality_map[choice]
                
                # Use proper subfolder based on quality
                if quality == "audio":
                    output_folder = audios_dir  # Store audio files in Audios folder
                else:
                    output_folder = videos_dir  # Store video files in Videos folder
                
                result, error = download_with_progress(url, quality, output_folder)

                if error:
                    console.print(f"❌Error: {error}", style="red")
                else:
                    console.print("Download complete!", style="green")
                    console.print(f"Saved to: {result}", style="dim")

            continue_input = Prompt.ask("\nDownload another? (y/n/q)", choices=["y", "n", "q"], default="y")
            check_exit(continue_input)
            if continue_input.lower() != "y":
                break

        except KeyboardInterrupt:
            console.print("\nOperation canceled", style="yellow")
            break

    console.print("\nThanks for using YTDL!", style="cyan")

# Add import for keyboard input checking
import select

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        console.print(f"Critical error: {str(e)}", style="red")
        sys.exit(1)