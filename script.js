const flame = document.getElementById('flame');
const statusText = document.getElementById('status');

async function startMic() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const mic = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    mic.connect(analyser);

    const dataArray = new Uint8Array(analyser.fftSize);
    
    function detectBlow() {
      analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const sample = (dataArray[i] - 128) / 128;
        sum += sample * sample;
      }
      const volume = Math.sqrt(sum / dataArray.length);

      // Si el volumen supera un umbral (ajústalo según el micrófono)
      if (volume > 0.05) {
        flame.style.display = 'none';
        statusText.textContent = '¡Apagaste la vela!, ahora reproduce el audio';
      }

      requestAnimationFrame(detectBlow);
    }

    detectBlow();

  } catch (err) {
    console.error('Acceso al micrófono denegado o fallido:', err);
    statusText.textContent = 'Necesitas permitir acceso al micrófono🎙️';
  }
}

startMic();
