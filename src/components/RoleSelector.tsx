export interface RolePreset {
  roleName: string
  defaultRoleText: string
  goalHint: string
  outputFormatHint: string
}

interface RoleSelectorProps {
  presets: RolePreset[]
  selectedPreset: string
  onPresetChange: (roleName: string) => void
}

function RoleSelector({
  presets,
  selectedPreset,
  onPresetChange,
}: RoleSelectorProps) {
  return (
    <div className="form-group">
      <label htmlFor="rolePreset">Role preset</label>
      <select
        id="rolePreset"
        value={selectedPreset}
        onChange={(event) => onPresetChange(event.target.value)}
      >
        {presets.map((preset) => (
          <option key={preset.roleName} value={preset.roleName}>
            {preset.roleName}
          </option>
        ))}
      </select>
    </div>
  )
}

export default RoleSelector
