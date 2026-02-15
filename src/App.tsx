import { useEffect, useState } from 'react'
import Builder from './components/Builder'
import type { PromptExample } from './components/Examples'
import Examples from './components/Examples'
import Linter from './components/Linter'
import type { PromptFields } from './components/PromptForm'
import type { RolePreset } from './components/RoleSelector'
import Templates from './components/Templates'
import type { PromptTemplate } from './components/Templates'
import examplesData from './data/examples.json'
import rolesData from './data/roles.json'
import templatesData from './data/templates.json'

type TabKey = 'builder' | 'linter' | 'templates' | 'examples'

const LAST_PROMPT_STORAGE_KEY = 'prompt-companion:last-generated-prompt'

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'builder', label: 'Builder' },
  { key: 'linter', label: 'Linter' },
  { key: 'templates', label: 'Templates' },
  { key: 'examples', label: 'Examples' },
]

const roles = rolesData as RolePreset[]
const templates = templatesData as PromptTemplate[]
const examples = examplesData as PromptExample[]

const trimEndPunctuation = (value: string) => value.trim().replace(/[.?!]+$/, '')

const normalizeRoleLine = (roleInput: string) => {
  const trimmedRole = roleInput.trim()
  if (!trimmedRole) {
    return 'You are a helpful AI assistant.'
  }

  const noFinalPunctuation = trimEndPunctuation(trimmedRole)
  if (/^you are\b/i.test(noFinalPunctuation)) {
    return `${noFinalPunctuation}.`
  }

  const withArticle = /^(a|an)\b/i.test(noFinalPunctuation)
    ? noFinalPunctuation
    : `a ${noFinalPunctuation}`

  return `You are ${withArticle}.`
}

const normalizeSentenceValue = (value: string, fallback: string) => {
  const trimmed = trimEndPunctuation(value)
  return `${trimmed || fallback}.`
}

const parseTemplatePrompt = (promptText: string): PromptFields => {
  const lines = promptText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  let role = ''
  let goal = ''
  let context = ''
  let constraints = ''
  let outputFormat = ''

  for (const line of lines) {
    if (/^you are/i.test(line)) {
      role = line
      continue
    }
    if (/^your goal is:/i.test(line)) {
      goal = trimEndPunctuation(line.replace(/^your goal is:/i, '').trim())
      continue
    }
    if (/^context:/i.test(line)) {
      context = trimEndPunctuation(line.replace(/^context:/i, '').trim())
      continue
    }
    if (/^constraints:/i.test(line)) {
      constraints = trimEndPunctuation(line.replace(/^constraints:/i, '').trim())
      continue
    }
    if (/^provide the answer in the following format:/i.test(line)) {
      outputFormat = trimEndPunctuation(
        line
          .replace(/^provide the answer in the following format:/i, '')
          .trim(),
      )
    }
  }

  return { role, goal, context, constraints, outputFormat }
}

function App() {
  const defaultPreset = roles[0]?.roleName ?? 'General'
  const defaultRoleText =
    roles[0]?.defaultRoleText ?? 'You are a helpful AI assistant.'

  const [activeTab, setActiveTab] = useState<TabKey>('builder')
  const [selectedPreset, setSelectedPreset] = useState(defaultPreset)
  const [fields, setFields] = useState<PromptFields>({
    role: defaultRoleText,
    goal: '',
    context: '',
    constraints: '',
    outputFormat: '',
  })
  const [generatedPrompt, setGeneratedPrompt] = useState(() => {
    return window.localStorage.getItem(LAST_PROMPT_STORAGE_KEY) ?? ''
  })

  useEffect(() => {
    if (!generatedPrompt) {
      window.localStorage.removeItem(LAST_PROMPT_STORAGE_KEY)
      return
    }

    window.localStorage.setItem(LAST_PROMPT_STORAGE_KEY, generatedPrompt)
  }, [generatedPrompt])

  const handlePresetChange = (roleName: string) => {
    setSelectedPreset(roleName)
    const matchingPreset = roles.find((preset) => preset.roleName === roleName)
    if (!matchingPreset) {
      return
    }

    setFields((current) => ({
      ...current,
      role: matchingPreset.defaultRoleText,
    }))
  }

  const handleFieldChange = (field: keyof PromptFields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }))
  }

  const handleGeneratePrompt = () => {
    const prompt = [
      normalizeRoleLine(fields.role),
      `Your goal is: ${normalizeSentenceValue(fields.goal, '[describe the goal]')}`,
      `Context: ${normalizeSentenceValue(fields.context, '[provide relevant context]')}`,
      `Constraints: ${normalizeSentenceValue(fields.constraints, '[add constraints]')}`,
      `Provide the answer in the following format: ${normalizeSentenceValue(fields.outputFormat, '[define the output format]')}`,
    ].join('\n')

    setGeneratedPrompt(prompt)
  }

  const handleUseTemplate = (template: PromptTemplate) => {
    const parsed = parseTemplatePrompt(template.promptText)
    setFields(parsed)
    setGeneratedPrompt(template.promptText)

    const matchingPreset = roles.find((preset) =>
      template.promptText.toLowerCase().includes(preset.roleName.toLowerCase()),
    )
    if (matchingPreset) {
      setSelectedPreset(matchingPreset.roleName)
    }

    setActiveTab('builder')
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Prompt Companion – Internal AI Prompt Quality Tool</h1>
        <p>
          Standardize and improve LLM prompts across the organization
        </p>
      </header>

      <nav className="tab-nav" aria-label="Prompt Companion sections">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="content-area">
        {activeTab === 'builder' && (
          <Builder
            presets={roles}
            selectedPreset={selectedPreset}
            fields={fields}
            generatedPrompt={generatedPrompt}
            onPresetChange={handlePresetChange}
            onFieldChange={handleFieldChange}
            onGeneratePrompt={handleGeneratePrompt}
          />
        )}
        {activeTab === 'linter' && <Linter />}
        {activeTab === 'templates' && (
          <Templates templates={templates} onUseTemplate={handleUseTemplate} />
        )}
        {activeTab === 'examples' && <Examples examples={examples} />}
      </main>

      <footer className="app-footer">
        Internal MVP – Prompt standardization initiative
      </footer>
    </div>
  )
}

export default App
