(function(){
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    window.attachVoiceInput = function(){};
    return;
  }

  if (!document.getElementById('voice-style')) {
    const style = document.createElement('style');
    style.id = 'voice-style';
    style.textContent = `.voice-recording{background-color:#dc2626!important;color:#fff!important}`;
    document.head.appendChild(style);
  }

  window.attachVoiceInput = function(textarea, button){
    if (!textarea || !button) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.interimResults = true;
    recognition.continuous = true;
    let base = '';
    let recording = false;

    button.addEventListener('click', () => {
      if (recording) {
        recognition.stop();
      } else {
        base = textarea.value;
        recognition.start();
      }
    });

    recognition.addEventListener('start', () => {
      recording = true;
      button.classList.add('voice-recording');
    });

    recognition.addEventListener('end', () => {
      recording = false;
      button.classList.remove('voice-recording');
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
      textarea.value = base + interim;
      textarea.dispatchEvent(new Event('input')); // adjust height listeners
    });
  };
})();
