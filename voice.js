(function(){
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    window.attachVoiceInput = function(){};
    return;
  }

  if (!document.getElementById('voice-style')) {
    const style = document.createElement('style');
    style.id = 'voice-style';
    style.textContent = `.voice-recording{color:#dc2626!important}
.voice-waves{display:inline-block;position:relative;width:1em;height:1em;}
.voice-waves span{position:absolute;bottom:0;width:2px;height:20%;background:currentColor;animation:voice-wave 1s infinite ease-in-out;}
.voice-waves span:nth-child(1){left:0;animation-delay:-0.45s;}
.voice-waves span:nth-child(2){left:0.3em;animation-delay:-0.3s;}
.voice-waves span:nth-child(3){left:0.6em;animation-delay:-0.15s;}
.voice-waves span:nth-child(4){left:0.9em;}
@keyframes voice-wave{0%,100%{height:20%;}50%{height:100%;}}`;
    document.head.appendChild(style);
  }

  window.attachVoiceInput = function(input, button){
    if (!input || !button) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = true;
    recognition.continuous = true;
    let base = '';
    let recording = false;
    const waveHTML = '<span class="voice-waves"><span></span><span></span><span></span><span></span></span>';
    const originalHTML = button.innerHTML;

    button.addEventListener('click', () => {
      if (recording) {
        recognition.stop();
      } else {
        base = input.value;
        recognition.start();
      }
    });

    recognition.addEventListener('start', () => {
      recording = true;
      button.classList.add('voice-recording');
      button.innerHTML = waveHTML;
    });

    recognition.addEventListener('end', () => {
      recording = false;
      button.classList.remove('voice-recording');
      button.innerHTML = originalHTML;
    });

    recognition.addEventListener('result', e => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) {
          base += res[0].transcript;
        } else {
          interim += res[0].transcript;
        }
      }
      input.value = base + interim;
      input.dispatchEvent(new Event('input')); // adjust height listeners
    });
  };
})();
