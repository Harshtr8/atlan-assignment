"use client"

import type React from "react"

import { useState, useRef } from "react"
import styles from "./query-editor.module.css"

interface QueryEditorProps {
  value: string
  onChange: (value: string) => void
  onExecute: () => void
  isLoading: boolean
}

export default function QueryEditor({ value, onChange, onExecute, isLoading }: QueryEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const [editorHeight, setEditorHeight] = useState("200px")

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault()
      if (!editorRef.current) return;
      
      const start = editorRef.current.selectionStart
      const end = editorRef.current.selectionEnd

      // Insert tab at cursor position
      const newValue = value.substring(0, start) + "  " + value.substring(end)
      onChange(newValue)

      // Move cursor after the inserted tab
      setTimeout(() => {
        if (!editorRef.current) return;
        editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 2
      }, 0)
    } else if (e.key === "Enter" && e.ctrlKey) {
      onExecute()
    }
  }

  const resizeEditor = (newHeight: string) => {
    setEditorHeight(newHeight)
  }

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <h2>SQL Query</h2>
        <div className={styles.editorControls}>
          <button
            className={styles.resizeButton}
            onClick={() => resizeEditor(editorHeight === "200px" ? "400px" : "200px")}
          >
            {editorHeight === "200px" ? "Expand" : "Collapse"}
          </button>
          <button className={styles.executeButton} onClick={onExecute} disabled={isLoading}>
            {isLoading ? "Running..." : "Run Query"}
          </button>
        </div>
      </div>

      <div className={styles.editorWrapper} style={{ height: editorHeight }}>
        <textarea
          ref={editorRef}
          className={styles.editor}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your SQL query here..."
          spellCheck={false}
        />
      </div>

      <div className={styles.editorFooter}>
        <span className={styles.hint}>Press Ctrl+Enter to run query</span>
      </div>
    </div>
  )
}

