// ==UserScript==
// @name         Kleinanzeigen Drag & Drop Auto-JPG
// @match        https://www.kleinanzeigen.de/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @connect      *
// @license      MIT
// @description  Erlaubt das direkte Ziehen (Drag & Drop) von Bildern von anderen Websites (inkl. WebP und AVIF) in die Kleinanzeigen-Bilderbox, indem sie automatisch im Hintergrund in das passende JPG-Format konvertiert werden.
// @version 0.0.1.20260614144406
// @namespace https://greasyfork.org/users/1612835
// ==/UserScript==
 
// Ein Set, um künstlich von uns erzeugte Events zu markieren, damit wir nicht in eine Endlosschleife geraten
const processedEvents = new WeakSet();
 
document.addEventListener("drop", async (e) => {
    // Wenn das Event von unserem eigenen Skript stammt, ignorieren wir es und lassen Kleinanzeigen arbeiten
    if (processedEvents.has(e)) return;
 
    const url = e.dataTransfer.getData("text/uri-list");
    if (!url) return;
 
    // Originales Event sofort stoppen, damit das .webp/avif nicht blockiert
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
 
    const targetElement = e.target;
 
    // Hilfsfunktion für den Dateinamen
    function getCleanFileName(url, targetExt) {
        try {
            const baseName = url.split('/').pop().split('?')[0] || "remote_image";
            const nameWithoutExt = baseName.replace(/\.[^/.]+$/, "");
            return `${nameWithoutExt}.${targetExt}`;
        } catch (err) {
            return `image.${targetExt}`;
        }
    }
 
    // Bild herunterladen
    GM_xmlhttpRequest({
        url,
        responseType: "blob",
        onload: async (res) => {
            const blob = res.response;
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
 
            let finalFile;
 
            if (allowedTypes.includes(blob.type)) {
                const ext = blob.type.split('/')[1] || 'jpg';
                const fileName = getCleanFileName(url, ext);
                finalFile = new File([blob], fileName, { type: blob.type });
            } else if (blob.type.startsWith('image/')) {
                console.log(`Konvertiere Remote-Bild von ${blob.type} zu image/jpeg...`);
                try {
                    const fileName = getCleanFileName(url, 'jpg');
                    finalFile = await convertBlobToJpg(blob, fileName);
                } catch (err) {
                    console.error("Fehler bei der Bildkonvertierung:", err);
                    return;
                }
            } else {
                return;
            }
 
            // Jetzt erstellen wir ein künstliches Daten-Transfer-Objekt
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(finalFile);
 
            // Wir erstellen ein brandneues Drop-Event, das exakt aussieht wie ein echtes Datei-Drop
            const fakeDropEvent = new DragEvent("drop", {
                bubbles: true,
                cancelable: true,
                clientX: e.clientX,
                clientY: e.clientY,
                screenX: e.screenX,
                screenY: e.screenY,
                dataTransfer: dataTransfer
            });
 
            // Wichtig: Dieses Event als "von uns modifiziert" markieren
            processedEvents.add(fakeDropEvent);
 
            // Das manipulierte Event an das originale Element senden
            console.log("Sende konvertiertes JPG-Event an Kleinanzeigen...");
            targetElement.dispatchEvent(fakeDropEvent);
        }
    });
}, true); // Capturing-Phase bleibt aktiv, um Erster zu sein
 
// Hilfsfunktion zur Konvertierung
function convertBlobToJpg(blob, fileName) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(blob);
        const img = new Image();
 
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
 
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
 
            canvas.toBlob((convertedBlob) => {
                URL.revokeObjectURL(url);
                if (convertedBlob) {
                    const file = new File([convertedBlob], fileName, { type: "image/jpeg" });
                    resolve(file);
                } else {
                    reject(new Error("Canvas-Export fehlgeschlagen"));
                }
            }, 'image/jpeg', 0.92);
        };
 
        img.onerror = function() {
            URL.revokeObjectURL(url);
            reject(new Error("Bild konnte nicht geladen werden"));
        };
 
        img.src = url;
    });
}
