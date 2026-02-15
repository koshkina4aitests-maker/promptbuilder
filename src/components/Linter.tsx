import { useMemo, useState } from 'react'

type Status = 'error' | 'warning' | 'success'

interface LintResult {
  id: string
  label: string
  status: Status
}

const GOAL_VERBS = /(generate|create|design|write|analyze|summarize|list)/i
const OUTPUT_FORMAT_TERMS = /(format|table|list|diagram|json|code)/i

function Linter() {
  const [promptText, setPromptText] = useState('')
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [results, setResults] = useState<LintResult[]>([])

  const summary = useMemo(() => {
    const errors = results.filter((item) => item.status === 'error').length
    const warnings = results.filter((item) => item.status === 'warning').length
    const successes = results.filter((item) => item.status === 'success').length

    return { errors, warnings, successes }
  }, [results])

  const analyzePrompt = () => {
    const roleDetected = /you are/i.test(promptText)
    const goalDetected = GOAL_VERBS.test(promptText)
    const outputFormatDetected = OUTPUT_FORMAT_TERMS.test(promptText)
    const lengthValid = promptText.trim().length >= 200

    const nextResults: LintResult[] = [
      {
        id: 'role',
        label: roleDetected
          ? 'Role detected'
          : 'Missing role: add a phrase like "You are ..."',
        status: roleDetected ? 'success' : 'error',
      },
      {
        id: 'goal',
        label: goalDetected
          ? 'Goal detected'
          : 'No clear goal detected (try verbs like generate, create, design, write, analyze, summarize, list)',
        status: goalDetected ? 'success' : 'warning',
      },
      {
        id: 'output-format',
        label: outputFormatDetected
          ? 'Output format detected'
          : 'No output format detected (try format, table, list, diagram, JSON, or code)',
        status: outputFormatDetected ? 'success' : 'warning',
      },
      {
        id: 'length',
        label: lengthValid
          ? 'Length check passed (200+ characters)'
          : 'Prompt is too short (minimum 200 characters)',
        status: lengthValid ? 'success' : 'warning',
      },
    ]

    setResults(nextResults)
    setHasAnalyzed(true)
  }

  const statusIcon = (status: Status) => {
    if (status === 'error') return '✖'
    if (status === 'warning') return '⚠'
    return '✔'
  }

  return (
    <section className="tab-content">
      <div className="card">
        <h2>Linter</h2>
        <p className="muted-text">
          Run a quick quality check before sharing prompts with your team.
        </p>

        <div className="form-group">
          <label htmlFor="linterPrompt">Prompt text</label>
          <textarea
            id="linterPrompt"
            value={promptText}
            onChange={(event) => setPromptText(event.target.value)}
            placeholder="Paste your prompt here for analysis"
            rows={12}
          />
        </div>

        <button className="primary-button" type="button" onClick={analyzePrompt}>
          Analyze Prompt
        </button>
      </div>

      <div className="card">
        <h2>Checklist</h2>
        {!hasAnalyzed ? (
          <p className="muted-text">
            Analysis results will appear after you click Analyze Prompt.
          </p>
        ) : (
          <>
            <ul className="status-list">
              {results.map((result) => (
                <li key={result.id} className={`status-item ${result.status}`}>
                  <span className="status-icon" aria-hidden="true">
                    {statusIcon(result.status)}
                  </span>
                  <span>{result.label}</span>
                </li>
              ))}
            </ul>
            <p className="muted-text">
              {summary.successes} passed, {summary.warnings} warning
              {summary.warnings === 1 ? '' : 's'}, {summary.errors} error
              {summary.errors === 1 ? '' : 's'}.
            </p>
          </>
        )}
      </div>
    </section>
  )
}

export default Linter
