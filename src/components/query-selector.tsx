"use client"

import { useState } from "react"
import styles from "./query-selector.module.css"
import { Query } from "@/app/page"

interface QuerySelectorProps {
  predefinedQueries: Query[]
  savedQueries: Query[]
  queryHistory: Query[]
  onSelectQuery: (query: Query) => void
}

export default function QuerySelector({
  predefinedQueries,
  savedQueries,
  queryHistory,
  onSelectQuery,
}: QuerySelectorProps) {
  const [activeTab, setActiveTab] = useState("predefined")

  return (
    <div className={styles.selectorContainer}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "predefined" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("predefined")}
        >
          Examples
        </button>
        <button
          className={`${styles.tab} ${activeTab === "saved" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("saved")}
        >
          Saved
        </button>
        <button
          className={`${styles.tab} ${activeTab === "history" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
      </div>

      <div className={styles.queriesList}>
        {activeTab === "predefined" && (
          <>
            <h3 className={styles.listTitle}>Example Queries</h3>
            {predefinedQueries.map((query) => (
              <div key={query.id} className={styles.queryItem} onClick={() => onSelectQuery(query)}>
                <div className={styles.queryName}>{query.name}</div>
                <div className={styles.queryPreview}>{query.query.substring(0, 60)}...</div>
              </div>
            ))}
          </>
        )}

        {activeTab === "saved" && (
          <>
            <h3 className={styles.listTitle}>Saved Queries</h3>
            {savedQueries.length === 0 ? (
              <div className={styles.emptyMessage}>No saved queries yet</div>
            ) : (
              savedQueries.map((query) => (
                <div key={query.id} className={styles.queryItem} onClick={() => onSelectQuery(query)}>
                  <div className={styles.queryName}>{query.name}</div>
                  <div className={styles.queryPreview}>{query.query.substring(0, 60)}...</div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === "history" && (
          <>
            <h3 className={styles.listTitle}>Query History</h3>
            {queryHistory.length === 0 ? (
              <div className={styles.emptyMessage}>No query history yet</div>
            ) : (
              queryHistory.map((query) => (
                <div key={query.id} className={styles.queryItem} onClick={() => onSelectQuery(query)}>
                  <div className={styles.queryTimestamp}>{query.timestamp}</div>
                  <div className={styles.queryPreview}>{query.query.substring(0, 60)}...</div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  )
}

