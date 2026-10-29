# auto_worker.ps1
# Versiyon: 1.6.0 - Dynamic Versioning Automation

$promptFile = "prompt.txt"
$intervalMinutes = 10
$logFile = "worker_log.txt"
$historyFile = "PERSISTENT_TERMINAL_LOG.md"
$currentVersion = "1.3.34" # MODAL MEASUREMENT

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] $Message"
    Write-Host $logEntry -ForegroundColor Cyan
    Add-Content -Path $logFile -Value $logEntry
}

function Write-History {
    param([string]$Role, [string]$Content)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $historyEntry = "`n## [$timestamp] $Role`n$Content`n`n---"
    Add-Content -Path $historyFile -Value $historyEntry
}

Write-Log "Otomatik worker baslatildi. Geçmis yükleniyor..."
if (Test-Path $historyFile) {
    $lastLogs = Get-Content $historyFile -Tail 20
    Write-Host "--- SON 5 İSLEM GEÇMİSİ ---" -ForegroundColor Yellow
    $lastLogs | Write-Host
    Write-Host "---------------------------" -ForegroundColor Yellow
}

while($true) {
    if (Test-Path $promptFile) {
        $prompt = Get-Content $promptFile -Raw
        if ($prompt.Trim().Length -gt 0) {
            Write-Log "Yeni görev bulundu, Gemini çalistiriliyor..."
            Write-History "USER PROMPT" $prompt
            $safePrompt = $prompt.Replace('"', '\"')
            
            try {
                $output = gemini --yolo --prompt "$safePrompt" 2>&1
                Write-Host $output
                Write-History "GEMINI RESPONSE" "Görev basariyla islendi."

                if (Test-Path "task_result.txt") {
                    $rapor = Get-Content "task_result.txt" -Raw
                    Write-History "TASK RESULT" $rapor
                    Remove-Item "task_result.txt" -Force
                }

                # CACHE BUSTER & DEPLOYMENT
                Write-Log "Cache-buster uygulaniyor (v$currentVersion)..."
                $ts = Get-Date -Format "HHmmss"
                $content = Get-Content "index.html" -Raw
                $content = $content -replace 'script.js\?v=[\d.]+', "script.js?v=$currentVersion.$ts"
                $content = $content -replace 'style.css\?v=[\d.]+', "style.css?v=$currentVersion.$ts"
                $content = $content -replace 'v[\d.]+\s-\s[\w\s-]+', "v$currentVersion - Modal Measurement Edition"
                $content | Out-File -FilePath "index.html" -Encoding UTF8 -Force

                Write-Log "GitHub Actions deployment islemine birakildi (main push gereklidir)."
            } catch {
                Write-Log "HATA: Görev çalistirilirken sorun olustu."
                Write-History "SYSTEM ERROR" $_.Exception.Message
            }
        }
    }
    Write-Log "Bekleniyor... ($intervalMinutes dk)"
    Start-Sleep -Seconds ($intervalMinutes * 60)
}
