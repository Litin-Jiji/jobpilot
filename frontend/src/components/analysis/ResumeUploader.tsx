import { useCallback, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react'

interface ResumeUploaderProps {
  file: File | null
  onFileSelect: (file: File | null) => void
}

export function ResumeUploader({ file, onFileSelect }: ResumeUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile?.type === 'application/pdf') {
        onFileSelect(droppedFile)
      }
    },
    [onFileSelect],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0]
      if (selected) onFileSelect(selected)
    },
    [onFileSelect],
  )

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-[13px] font-medium text-text-secondary">
        Resume
      </label>

      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`
              relative cursor-pointer rounded-xl border-2 border-dashed
              transition-all duration-200 group flex-1
              flex flex-col items-center justify-center gap-3 py-12 px-6
              ${isDragging
                ? 'border-primary bg-primary-subtle'
                : 'border-border-default hover:border-border-hover hover:bg-bg-elevated'
              }
            `}
          >
            <div
              className={`
                w-10 h-10 rounded-xl flex items-center justify-center
                transition-colors duration-200
                ${isDragging
                  ? 'bg-primary/10 text-primary'
                  : 'bg-bg-elevated text-text-muted group-hover:text-text-secondary'
                }
              `}
            >
              <Upload className="w-5 h-5" />
            </div>
            <div className="text-center">
              <p className="text-[13px] font-medium text-text-primary mb-1">
                Upload Resume
              </p>
              <p className="text-[12px] text-text-muted">
                Drag & drop your PDF here or{' '}
                <span className="text-primary font-medium">browse files</span>
              </p>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleChange}
              className="hidden"
              aria-label="Upload resume PDF"
            />
          </motion.div>
        ) : (
          <motion.div
            key="file-info"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-bg-surface border border-border-default"
          >
            <div className="w-9 h-9 rounded-lg bg-primary-subtle flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-text-primary truncate">
                {file.name}
              </p>
              <p className="text-[11px] text-text-muted mt-0.5">
                {formatSize(file.size)} · PDF
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onFileSelect(null)
                }}
                className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors border-0 bg-transparent cursor-pointer"
                aria-label="Remove file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
