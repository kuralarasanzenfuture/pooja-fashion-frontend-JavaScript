Add-Type -AssemblyName System.Drawing

$srcPath = Join-Path $PSScriptRoot "..\src\assets\logo\poojafashion.png"
$bmp = New-Object System.Drawing.Bitmap($srcPath)
$w = $bmp.Width
$h = $bmp.Height

$minX = 564
$maxX = 848
$minY = 110
$maxY = 486

# Emblem top: 110, bottom right before "P": 352
$embTop = 110
$embBottom = 352
$embMinX = 566
$embMaxX = 846

$embW = $embMaxX - $embMinX
$embH = $embBottom - $embTop
Write-Host "Emblem exact bounds: $embW x $embH"

# 1. Clean Square White Background Icon
$sqSize = [Math]::Max($embW, $embH) + 16
$sqWhite = New-Object System.Drawing.Bitmap($sqSize, $sqSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($sqWhite)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.Clear([System.Drawing.Color]::White)

$destX = [int](($sqSize - $embW) / 2)
$destY = [int](($sqSize - $embH) / 2)
$destRect = New-Object System.Drawing.Rectangle($destX, $destY, $embW, $embH)
$srcRect = New-Object System.Drawing.Rectangle($embMinX, $embTop, $embW, $embH)

$g.DrawImage($bmp, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

$outWhite = Join-Path $PSScriptRoot "..\src\assets\logo\pooja_emblem_icon.png"
$sqWhite.Save($outWhite, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved clean square emblem: $outWhite ($sqSize x $sqSize)"

# 2. Transparent Background Version
$sqTrans = New-Object System.Drawing.Bitmap($sqSize, $sqSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $sqSize; $y++) {
    for ($x = 0; $x -lt $sqSize; $x++) {
        $p = $sqWhite.GetPixel($x, $y)
        # Background threshold: light wall pixels
        # Metallic logo has R > B + 20 or brightness < 215
        $brightness = [int]($p.R * 0.299 + $p.G * 0.587 + $p.B * 0.114)
        $diff = [Math]::Abs([int]$p.R - [int]$p.B)
        
        if ($brightness -gt 238 -and $diff -lt 15) {
            # Fully transparent
            $sqTrans.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($brightness -gt 225 -and $diff -lt 25) {
            # Soft anti-aliased edge
            $alpha = [int]([Math]::Max(0, [Math]::Min(255, (238 - $brightness) * 18)))
            $sqTrans.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $p.R, $p.G, $p.B))
        } else {
            # Keep original pixel
            $sqTrans.SetPixel($x, $y, $p)
        }
    }
}

$outTrans = Join-Path $PSScriptRoot "..\src\assets\logo\pooja_emblem_transparent.png"
$sqTrans.Save($outTrans, [System.Drawing.Imaging.ImageFormat]::Png)
$sqTrans.Dispose()
$sqWhite.Dispose()
$bmp.Dispose()

Write-Host "Saved transparent emblem: $outTrans"
