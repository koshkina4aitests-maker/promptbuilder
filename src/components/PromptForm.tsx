import type { FormEvent } from 'react'

export interface PromptFields {
  role: string
  goal: string
  context: string
  constraints: string
  outputFormat: string
}

interface PromptFormProps {
  fields: PromptFields
  goalHint: string
  outputFormatHint: string
  onFieldChange: (field: keyof PromptFields, value: string) => void
  onGeneratePrompt: () => void
}

function PromptForm({
  fields,
  goalHint,
  outputFormatHint,
  onFieldChange,
  onGeneratePrompt,
}: PromptFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onGeneratePrompt()
  }

  return (
    <form className="prompt-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="role">Role</label>
        <input
          id="role"
          type="text"
          value={fields.role}
          onChange={(event) => onFieldChange('role', event.target.value)}
          placeholder="Enter the role or persona"
        />
      </div>

      <div className="form-group">
        <label htmlFor="goal">Goal</label>
        <textarea
          id="goal"
          value={fields.goal}
          onChange={(event) => onFieldChange('goal', event.target.value)}
          placeholder={goalHint}
          rows={4}
        />
        <span className="field-hint">Example: {goalHint}</span>
      </div>

      <div className="form-group">
        <label htmlFor="context">Context</label>
        <textarea
          id="context"
          value={fields.context}
          onChange={(event) => onFieldChange('context', event.target.value)}
          placeholder="Add project, domain, or stakeholder context"
          rows={4}
        />
      </div>

      <div className="form-group">
        <label htmlFor="constraints">Constraints</label>
        <textarea
          id="constraints"
          value={fields.constraints}
          onChange={(event) => onFieldChange('constraints', event.target.value)}
          placeholder="Define limits, guardrails, and non-negotiables"
          rows={4}
        />
      </div>

      <div className="form-group">
        <label htmlFor="outputFormat">Output format</label>
        <input
          id="outputFormat"
          type="text"
          value={fields.outputFormat}
          onChange={(event) => onFieldChange('outputFormat', event.target.value)}
          placeholder={outputFormatHint}
        />
        <span className="field-hint">Example: {outputFormatHint}</span>
      </div>

      <button className="primary-button" type="submit">
        Generate Prompt
      </button>
    </form>
  )
}

export default PromptForm
