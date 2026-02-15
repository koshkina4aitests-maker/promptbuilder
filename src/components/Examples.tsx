import { useState } from 'react'

export interface PromptExample {
  title: string
  badPrompt: string
  goodPrompt: string
  explanation: string
}

interface ExamplesProps {
  examples: PromptExample[]
}

function Examples({ examples }: ExamplesProps) {
  const [copiedTitle, setCopiedTitle] = useState<string>('')

  const copyText = async (title: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedTitle(title)
      window.setTimeout(() => setCopiedTitle(''), 1500)
    } catch {
      setCopiedTitle('')
    }
  }

  return (
    <section className="tab-content">
      <div className="card">
        <h2>Good vs Bad Examples</h2>
        <p className="muted-text">
          Compare weak prompts against improved versions that apply the standard
          structure.
        </p>
      </div>

      <div className="grid">
        {examples.map((example) => (
          <article key={example.title} className="card">
            <div className="card-header">
              <h3>{example.title}</h3>
              <button
                className="secondary-button"
                type="button"
                onClick={() => copyText(example.title, example.goodPrompt)}
              >
                Copy good example
              </button>
            </div>

            <div className="comparison-grid">
              <div className="comparison bad">
                <h4>Bad prompt</h4>
                <pre className="preview-box">
                  <code>{example.badPrompt}</code>
                </pre>
              </div>
              <div className="comparison good">
                <h4>Good prompt</h4>
                <pre className="preview-box">
                  <code>{example.goodPrompt}</code>
                </pre>
              </div>
            </div>

            <p>{example.explanation}</p>
            {copiedTitle === example.title && (
              <p className="status-inline success">Good prompt copied.</p>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

export default Examples
