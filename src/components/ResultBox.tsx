import { useState } from 'react'

interface ResultBoxProps {
  prompt: string
}

function ResultBox({ prompt }: ResultBoxProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')

  const handleCopy = async () => {
    if (!prompt) {
      return
    }

    try {
      await navigator.clipboard.writeText(prompt)
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 1600)
    } catch {
      setCopyState('error')
      window.setTimeout(() => setCopyState('idle'), 2000)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Generated prompt</h2>
        <button
          className="secondary-button"
          type="button"
          onClick={handleCopy}
          disabled={!prompt}
        >
          Copy to clipboard
        </button>
      </div>

      {prompt ? (
        <pre className="result-box">
          <code>{prompt}</code>
        </pre>
      ) : (
        <p className="muted-text">
          Your generated prompt will appear here after clicking Generate Prompt.
        </p>
      )}

      {copyState === 'copied' && (
        <p className="status-inline success">Prompt copied to clipboard.</p>
      )}
      {copyState === 'error' && (
        <p className="status-inline error">Copy failed. Please copy manually.</p>
      )}
    </div>
  )
}

export default ResultBox
