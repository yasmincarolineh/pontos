// js/utils/media.js - Wrappers for Native Web Browser APIs (Camera / Geolocation)

/**
 * Requests browser current geolocation position.
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export async function getCurrentCoordinates() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      return reject(new Error('Geolocalização não é suportada por este navegador.'));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

/**
 * Requests camera stream access for media capture.
 * @param {HTMLVideoElement} videoElement
 * @returns {Promise<MediaStream>}
 */
export async function startCameraStream(videoElement) {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Acesso à câmera não é suportado por este navegador.');
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false
    });

    if (videoElement) {
      videoElement.srcObject = stream;
      await videoElement.play();
    }

    return stream;
  } catch (err) {
    console.error('Erro ao acessar a câmera:', err.message);
    throw err;
  }
}

/**
 * Stops camera video tracks on stream.
 * @param {MediaStream} stream
 */
export function stopCameraStream(stream) {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
}
