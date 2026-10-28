"""Caleidoscopio generativo en loop perfecto. Uso:
  python3 caleidoscopio.py preview   -> cuadros PNG de prueba
  python3 caleidoscopio.py video     -> caleidoscopio_1080p.mp4
"""
import sys, subprocess
import numpy as np
from PIL import Image

W, H = 1920, 1080
FPS = 30
SECONDS = 30
N_FRAMES = FPS * SECONDS
SEGMENTS = 12  # número de espejos (pétalos)

ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
X = (xs - W / 2) / (H / 2)
Y = (ys - H / 2) / (H / 2)
R = np.sqrt(X * X + Y * Y) + 1e-6
A = np.arctan2(Y, X)
LOGR = np.log(R)
VIGNETTE = np.clip(1.25 - 0.55 * R, 0, 1) ** 1.5

def palette(t, shift):
    # paleta coseno: joyas (magenta, cian, dorado, violeta)
    a = np.array([0.5, 0.5, 0.5], np.float32)
    b = np.array([0.5, 0.5, 0.5], np.float32)
    c = np.array([1.0, 1.0, 1.0], np.float32)
    d = np.array([0.80, 0.10, 0.30], np.float32) + shift
    return a + b * np.cos(2 * np.pi * (c * t[..., None] + d))

def frame(i):
    p = 2 * np.pi * i / N_FRAMES  # fase 0..2π  -> loop perfecto
    wedge = 2 * np.pi / SEGMENTS
    ang = A + p  # rotación global (1 vuelta por loop)
    ang = np.mod(ang, wedge)
    ang = np.abs(ang - wedge / 2)  # espejo dentro de cada gajo
    # zoom que "respira" (vuelve a su tamaño al final del loop)
    scale = R * np.exp(-0.45 * np.sin(p))
    u = LOGR
    sx = np.cos(ang) * scale
    sy = np.sin(ang) * scale
    # patrón: capas de ondas y "gemas" que se mueven en ciclos cerrados
    v = np.sin(sx * 7 + 2 * np.sin(p)) + np.sin(sy * 9 - 3 * np.cos(p))
    v += np.sin((sx + sy) * 5 + p * 3)
    v += 1.5 * np.sin(u * 6 - p * 3 + np.sin(ang * 6 + p * 2) * 2)  # anillos que fluyen hacia afuera
    for k in range(3):
        cx = 0.5 * np.cos(p * (k + 1) + k * 2.1)
        cy = 0.25 + 0.2 * np.sin(p * (k + 1) + k)
        d = np.sqrt((sx - cx) ** 2 + (sy - cy) ** 2)
        v += 1.2 * np.cos(d * 14 - p * 4)
    t = v / 8 + 0.15 * u + i / N_FRAMES  # paleta recorre un ciclo completo
    col = palette(t, np.float32(0.0))
    # líneas brillantes tipo vitral
    lines = np.exp(-np.abs(np.sin(v * 1.6)) * 7)
    col = col * (0.35 + 0.65 * np.abs(np.sin(v * 0.8)))[..., None]
    col += lines[..., None] * np.array([1.0, 0.95, 0.85], np.float32) * 0.6
    # centro luminoso
    col += (np.exp(-R * 6) * 0.8)[..., None]
    col *= VIGNETTE[..., None]
    return (np.clip(col, 0, 1) ** 0.9 * 255).astype(np.uint8)

if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "video"
    if mode == "preview":
        for i in (0, N_FRAMES // 3, 2 * N_FRAMES // 3):
            Image.fromarray(frame(i)).save(f"preview_{i:03d}.png")
    else:
        out = "caleidoscopio_1080p.mp4"
        ff = subprocess.Popen([
            "ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
            "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-an",
            "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-pix_fmt", "yuv420p",
            "-movflags", "+faststart", out], stdin=subprocess.PIPE)
        for i in range(N_FRAMES):
            ff.stdin.write(frame(i).tobytes())
        ff.stdin.close(); ff.wait()
        print("listo:", out)
