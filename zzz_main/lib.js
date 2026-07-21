async function xxxgetConnectionStatus() {
  if (!navigator.onLine) return false;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch("/favicon.ico", {
      method: "HEAD",
      cache: "no-store",
      signal: controller.signal
    });

    clearTimeout(timeout);
    return res.ok ? true : false;
  } catch {
    return false;
  }
}

/**
 * Simple & reliable check: returns "online" or "offline"
 */
async function getConnectionStatus() {
  if (!navigator.onLine) return false;
  try {
    const c = new AbortController(), t = setTimeout(() => c.abort(), 3000);
    await fetch("https://www.google.com/favicon.ico", {
      method: "HEAD", cache: "no-store", mode: "no-cors", signal: c.signal
    });
    clearTimeout(t);
    return true;
  } catch {
    return false;
  }
}

function snackBar(s) {
  if(s==''){ return; }
  var x = document.getElementById("snackbar");    
  x.innerHTML=s;
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function share_app(){
  if(navigator.share) {
    navigator.share({
      title: document.title,
      //text: 'E-Store App',
      text: document.title,
      url: location.href,
    })
    .then(() => console.log('Successful share'))
    .catch((error) => {
      console.log('Error sharing', error);
      MSG_SHOW(vbOk,"Error sharing:",error,function(){},function(){});
     })
  }
}


async function generateQRWithLogoSimplified(url, logoUrl, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  const size = 300;
  const logoSize = 60;
  
  // Create canvas for QR code
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  
  // Generate QR code
  await QRCode.toCanvas(canvas, url, {
      width: size,
      margin: 2,
      errorCorrectionLevel: 'H'
  });
  
  // Create a new canvas to combine QR and logo
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = size;
  finalCanvas.height = size;
  const ctx = finalCanvas.getContext('2d');
  
  // Draw QR code
  ctx.drawImage(canvas, 0, 0);
  
  // Load and draw logo
  const logo = new Image();
  logo.crossOrigin = 'anonymous';
  logo.src = logoUrl;
  
  await new Promise((resolve) => {
      logo.onload = () => {
          // White background for logo
          const centerX = (size - logoSize) / 2;
          const centerY = (size - logoSize) / 2;
          
          ctx.fillStyle = 'white';
          ctx.fillRect(centerX - 10, centerY - 10, logoSize + 20, logoSize + 20);
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 2;
          ctx.strokeRect(centerX - 10, centerY - 10, logoSize + 20, logoSize + 20);
          
          // Draw logo
          ctx.drawImage(logo, centerX, centerY, logoSize, logoSize);
          
          // Display result
          const img = document.createElement('img');
          img.src = finalCanvas.toDataURL();
          container.appendChild(img);
          
          resolve();
      };
  });
}
/*
// Usage
        generateQRWithLogoSimplified(
            'https://example.com',
            'https://via.placeholder.com/60',
            'qrcode-container'
        );
*/

//--------------------------------------------------------------------------------
/**
 * Generates a QR code image with a centered logo - Chrome Android compatible
 * @param {string} url - The URL or text to encode in the QR code
 * @param {string} logoUrl - URL or base64 string of the logo image
 * @param {Object} options - Optional configuration
 * @returns {Promise<string>} - Returns a promise that resolves to a data URL
 */
async function generateQRWithLogo(url, logoUrl, options = {}) {
    const {
        size = 300,
        logoSize = 60,
        logoBackground = '#ffffff',
        logoBorderRadius = 8,
        errorCorrectionLevel = 'H'
    } = options;

    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        
        // Generate QR code first
        QRCode.toCanvas(canvas, url, {
            width: size,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            },
            errorCorrectionLevel: errorCorrectionLevel
        }, async (error) => {
            if (error) {
                reject(error);
                return;
            }

            try {
                // Convert logo URL to base64 to avoid CORS issues
                const logoBase64 = await convertImageToBase64(logoUrl);
                
                // Create a new canvas for the final composition
                const finalCanvas = document.createElement('canvas');
                finalCanvas.width = size;
                finalCanvas.height = size;
                const ctx = finalCanvas.getContext('2d');
                
                // Draw QR code
                ctx.drawImage(canvas, 0, 0);
                
                // Load logo from base64
                const logo = await loadImageFromBase64(logoBase64);
                
                // Calculate logo position (center)
                const logoX = (size - logoSize) / 2;
                const logoY = (size - logoSize) / 2;
                const padding = 10;
                
                // Draw white background with border
                ctx.save();
                
                // Background
                ctx.fillStyle = logoBackground;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                ctx.shadowBlur = 10;
                roundRect(
                    ctx, 
                    logoX - padding, 
                    logoY - padding, 
                    logoSize + (padding * 2), 
                    logoSize + (padding * 2), 
                    logoBorderRadius
                );
                ctx.fill();
                
                // Reset shadow for border
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                
                // Border
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 2;
                roundRect(
                    ctx, 
                    logoX - padding, 
                    logoY - padding, 
                    logoSize + (padding * 2), 
                    logoSize + (padding * 2), 
                    logoBorderRadius
                );
                ctx.stroke();
                
                ctx.restore();
                
                // Draw the logo
                ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
                
                resolve(finalCanvas.toDataURL('image/png', 1.0));
            } catch (err) {
                console.error('Error adding logo:', err);
                // Return QR code without logo as fallback
                resolve(canvas.toDataURL('image/png', 1.0));
            }
        });
    });
}

/**
 * Convert image URL to base64 to avoid CORS issues
 */
function convertImageToBase64(url) {
    return new Promise((resolve, reject) => {
        // If it's already base64, return as is
        if (url.startsWith('data:image')) {
            resolve(url);
            return;
        }

        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            const reader = new FileReader();
            reader.onloadend = function() {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = () => {
            // If XHR fails, try canvas approach
            tryCanvasConversion(url).then(resolve).catch(reject);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    });
}

/**
 * Fallback method to convert image using canvas
 */
function tryCanvasConversion(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            try {
                resolve(canvas.toDataURL('image/png'));
            } catch (e) {
                reject(new Error('Canvas conversion failed - CORS issue'));
            }
        };
        
        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };
        
        img.src = url;
    });
}

/**
 * Load image from base64 string
 */
function loadImageFromBase64(base64) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load base64 image'));
        img.src = base64;
    });
}

/**
 * Draw rounded rectangle
 */
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}