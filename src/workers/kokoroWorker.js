// Runs Kokoro TTS off the main thread, so a slow/underpowered device never
// freezes the UI while loading the model or generating audio — it just
// takes longer, and the rest of the app stays responsive.

let tts = null

self.onmessage = async (e) => {
  const { type, id, payload } = e.data

  try {
    if (type === 'load') {
      if (!tts) {
        const [{ KokoroTTS }, { env }] = await Promise.all([
          import('kokoro-js'),
          import('@huggingface/transformers'),
        ])
        // Multi-threaded WASM needs cross-origin isolation (COOP/COEP
        // headers), which this app doesn't set — force single-threaded.
        env.backends.onnx.wasm.numThreads = 1
        tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
          dtype: 'q8',
          device: 'wasm',
          progress_callback: (data) => {
            if (data.status === 'progress' && data.total) {
              self.postMessage({ type: 'progress', percent: Math.round((data.loaded / data.total) * 100) })
            }
          },
        })
      }
      self.postMessage({ type: 'done', id })
    } else if (type === 'generate') {
      if (!tts) throw new Error('Premium voice not loaded')
      const { text, voice } = payload
      const audio = await tts.generate(text, { voice })
      const wav = audio.toWav()
      self.postMessage({ type: 'done', id, wav }, [wav])
    }
  } catch (err) {
    self.postMessage({ type: 'error', id, message: err?.message || String(err) })
  }
}
