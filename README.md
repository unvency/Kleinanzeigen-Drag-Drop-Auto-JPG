Since this is only for a German website, this README is only in German.
# Kleinanzeigen-Drag-Drop-Auto-JPG (Javascript für Tampermonkey)
Schluss mit der Fehlermeldung "Ungültiges Dateiformat"! Wer viel auf Kleinanzeigen verkauft, kennt das Problem: Man möchte ein Bild von einer anderen Website oder einer Bildersuche direkt in das Upload-Feld ziehen, aber Kleinanzeigen blockiert den Upload, weil moderne Formate wie .webp oder .avif genutzt werden.

Dieses Skript löst das Problem elegant im Hintergrund.
Hinweis: Beim ersten Drop von einer neuen Website fragt Tampermonkey einmalig nach der Erlaubnis für die Domain (@connect *). Klicke einfach auf "Immer erlauben", damit das Skript in Zukunft völlig unbemerkt im Hintergrund arbeiten kann. Beim ersten Drop musst du die Website dann einmal neu laden, damit die Imagedropbox wieder funktioniert.

Vorteile:
Automatische Konvertierung: Erkennt unzulässige Formate (WebP, AVIF, etc.) beim Drop, lädt sie im Hintergrund herunter und konvertiert sie blitzschnell in echtes .jpg.

Kein Qualitätsverlust: Behält eine hohe Bildqualität bei und sorgt dafür, dass transparente Hintergründe automatisch weiß gefüllt werden (keine schwarzen Flächen).

Unberührte Originale: Erlaubte Formate wie Standard-JPGs, PNGs oder GIFs werden ohne Verzögerung direkt durchgereicht.

Kompatibel mit dem Chat & Anzeigen-Editor: Funktioniert überall dort auf Kleinanzeigen, wo Bilder hochgeladen werden können.
