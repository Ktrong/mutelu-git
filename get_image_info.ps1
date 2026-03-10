
$projectRoot = "c:\LocalDevine\www\Iucrative"
$files = Get-ChildItem -Path $projectRoot -Include *.png, *.jpg, *.jpeg, *.webp, *.svg, *.gif -Recurse -Exclude node_modules, .next

Add-Type -AssemblyName System.Drawing

$results = foreach ($file in $files) {
    try {
        if ($file.Extension -eq ".svg") {
            # SVGs are text files, they don't have binary dimensions in the same way
            # For now, we'll mark them as SVG
            [PSCustomObject]@{
                Path = $file.FullName.Replace($projectRoot, "")
                Width = "N/A (SVG)"
                Height = "N/A (SVG)"
                HorizontalResolution = "N/A"
                VerticalResolution = "N/A"
            }
        } else {
            $img = [System.Drawing.Image]::FromFile($file.FullName)
            [PSCustomObject]@{
                Path = $file.FullName.Replace($projectRoot, "")
                Width = $img.Width
                Height = $img.Height
                HorizontalResolution = $img.HorizontalResolution
                VerticalResolution = $img.VerticalResolution
            }
            $img.Dispose()
        }
    } catch {
        [PSCustomObject]@{
            Path = $file.FullName.Replace($projectRoot, "")
            Width = "Error"
            Height = "Error"
            HorizontalResolution = "Error"
            VerticalResolution = "Error"
        }
    }
}

$results | ConvertTo-Json
