"use client"

import { useState } from "react"
import QueryEditor from "@/components/query-editor"
import ResultsTable from "@/components/results-table"
import QuerySelector from "@/components/query-selector"
import { predefinedQueries } from "@/data/queries"
import styles from "./page.module.css"

export interface Query {
  id: string | number;
  name: string;
  query: string;
  results: QueryResults;
  timestamp?: string;
}

export interface QueryResults {
  columns: string[];
  data: Record<string, string | number>[];
}

export default function Home() {
  const [currentQuery, setCurrentQuery] = useState(predefinedQueries[0].query)
  const [results, setResults] = useState<QueryResults>(predefinedQueries[0].results || { columns: [], data: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [queryHistory, setQueryHistory] = useState<Query[]>([])
  const [savedQueries, setSavedQueries] = useState<Query[]>([])

  const executeQuery = () => {
    setIsLoading(true)

    // Simulate query execution delay
    setTimeout(() => {
      // Find matching predefined query or use default results
      const matchingQuery = predefinedQueries.find((q) => q.query.trim() === currentQuery.trim())

      if (matchingQuery && matchingQuery.results) {
        setResults(matchingQuery.results)
      } else {
        // Use default results for custom queries
        setResults(predefinedQueries[0].results || { columns: [], data: [] })
      }

      // Add to history
      setQueryHistory((prev) => [
        { id: Date.now(), name: `Query ${prev.length + 1}`, query: currentQuery, timestamp: new Date().toLocaleString(),results:results },
        ...prev.slice(0, 9), 
      ])

      setIsLoading(false)
    }, 800)
  }

  const handleQuerySelect = (query: Query) => {
    setCurrentQuery(query.query)
    setResults(query.results)
  }

  const saveCurrentQuery = () => {
    if (currentQuery.trim()) {
      const newSavedQuery = {
        id: Date.now(),
        name: `Query ${savedQueries.length + 1}`,
        query: currentQuery,
        results: results,
      }
      setSavedQueries((prev) => [...prev, newSavedQuery])
    }
  }

  const exportResults = () => {
    if (!results.data.length) return

    const headers = results.columns.join(",")
    const rows = results.data.map((row) => results.columns.map((col) => `"${row[col]}"`).join(",")).join("\n")

    const csv = `${headers}\n${rows}`
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "query_results.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>SQL Query Runner</h1>
        <div className={styles.actions}>
          <button onClick={saveCurrentQuery} className={styles.secondaryButton}>
            Save Query
          </button>
          <button onClick={exportResults} className={styles.secondaryButton}>
            Export Results
          </button>
        </div>
      </header>

      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <QuerySelector
            predefinedQueries={predefinedQueries}
            savedQueries={savedQueries}
            queryHistory={queryHistory}
            onSelectQuery={handleQuerySelect}
          />
        </aside>

        <div className={styles.content}>
          <QueryEditor value={currentQuery} onChange={setCurrentQuery} onExecute={executeQuery} isLoading={isLoading} />

          <ResultsTable results={results} isLoading={isLoading} />
        </div>
      </div>
    </main>
  )
}

