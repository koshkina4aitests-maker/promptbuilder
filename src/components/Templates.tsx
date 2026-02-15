export interface PromptTemplate {
  title: string
  category: string
  whenToUse: string
  promptText: string
}

interface TemplatesProps {
  templates: PromptTemplate[]
  onUseTemplate: (template: PromptTemplate) => void
}

function Templates({ templates, onUseTemplate }: TemplatesProps) {
  return (
    <section className="tab-content">
      <div className="card">
        <h2>Templates</h2>
        <p className="muted-text">
          Select a template to prefill the Builder with a proven prompt pattern.
        </p>
      </div>

      <div className="grid two-columns">
        {templates.map((template) => (
          <article
            key={template.title}
            className="card template-card"
            role="button"
            tabIndex={0}
            onClick={() => onUseTemplate(template)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onUseTemplate(template)
              }
            }}
          >
            <div className="card-header">
              <h3>{template.title}</h3>
              <span className="chip">{template.category}</span>
            </div>
            <p>
              <strong>When to use:</strong> {template.whenToUse}
            </p>
            <pre className="preview-box">
              <code>{template.promptText}</code>
            </pre>
            <button
              className="secondary-button"
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onUseTemplate(template)
              }}
            >
              Use in Builder
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Templates
