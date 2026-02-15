import PromptForm, { type PromptFields } from './PromptForm'
import ResultBox from './ResultBox'
import RoleSelector, { type RolePreset } from './RoleSelector'

interface BuilderProps {
  presets: RolePreset[]
  selectedPreset: string
  fields: PromptFields
  generatedPrompt: string
  onPresetChange: (roleName: string) => void
  onFieldChange: (field: keyof PromptFields, value: string) => void
  onGeneratePrompt: () => void
}

function Builder({
  presets,
  selectedPreset,
  fields,
  generatedPrompt,
  onPresetChange,
  onFieldChange,
  onGeneratePrompt,
}: BuilderProps) {
  const activePreset =
    presets.find((preset) => preset.roleName === selectedPreset) ?? presets[0]

  return (
    <section className="tab-content">
      <div className="card">
        <h2>Builder</h2>
        <p className="muted-text">
          Build prompts with a standardized structure for consistent output
          quality.
        </p>

        <RoleSelector
          presets={presets}
          selectedPreset={selectedPreset}
          onPresetChange={onPresetChange}
        />

        <PromptForm
          fields={fields}
          goalHint={activePreset.goalHint}
          outputFormatHint={activePreset.outputFormatHint}
          onFieldChange={onFieldChange}
          onGeneratePrompt={onGeneratePrompt}
        />
      </div>

      <ResultBox prompt={generatedPrompt} />
    </section>
  )
}

export default Builder
