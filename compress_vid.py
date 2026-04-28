import sys
import subprocess

try:
    import imageio_ffmpeg
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "imageio-ffmpeg"])
    import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

input_vid = r"assets\videos\SnapInsta.to_AQM9oo8mAvKHARghKYc8P6mZMcs3pYA9CpumJRaqv14DqrzmBoeLYUxNM7TfWoWXyG_sNA49vvc0QUmLiFmUWNRsz4ZDkuOajzDuLlk.mp4"
output_vid = r"assets\videos\hero_compressed.mp4"

# Compress video: scale width to 720 (keep aspect ratio), remove audio, trim to first 10 seconds, lower framerate to 24, crf 26.
cmd = [
    ffmpeg_exe, "-y", "-i", input_vid,
    "-t", "10", 
    "-vf", "scale=-2:720,fps=24", 
    "-c:v", "libx264", 
    "-crf", "26", 
    "-preset", "faster", 
    "-pix_fmt", "yuv420p",
    "-an", 
    output_vid
]

print("Running FFmpeg compression...")
subprocess.run(cmd, check=True)
print("Compression complete!")
