interface JobDescriptionInputProps {
  value: string
  onChange: (value: string) => void
}

export function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  const charCount = value.length

  return (
    <div className="flex flex-col gap-3 flex-1">
      <div className="flex items-center justify-between">
        <label
          htmlFor="job-description"
          className="text-[13px] font-medium text-text-secondary"
        >
          Job Description
        </label>
        <span
          className={`text-[11px] tabular-nums ${
            charCount > 0 ? 'text-text-muted' : 'text-transparent'
          }`}
        >
          {charCount.toLocaleString()} characters
        </span>
      </div>

      <textarea
        id="job-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description here..."
        rows={12}
        className="
          w-full resize-none rounded-xl bg-bg-surface border border-border-default
          px-4 py-3.5 text-[14px] leading-relaxed text-text-primary
          placeholder:text-text-muted
          focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
          transition-all duration-200
          font-[inherit] shadow-xs
        "
      />
    </div>
  )
}
