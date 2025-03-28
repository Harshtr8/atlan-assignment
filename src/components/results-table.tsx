"use client"

import { useState, useEffect } from "react"
import styles from "./results-table.module.css"
import { QueryResults } from "@/app/page";

interface ResultsTableProps {
  results: QueryResults;
  isLoading: boolean
}

export default function ResultsTable({
  results = { columns: [], data: [] }, // Provide default value
  isLoading,
}: ResultsTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filteredData, setFilteredData] = useState(results.data)
  const [filters, setFilters] = useState<Record<string, string>>({})

  // First useEffect to handle results changes
  useEffect(() => {
    if (results && results.data) {
      setFilteredData(results.data)
      setCurrentPage(1)
      setFilters({})
      setSortConfig(null)
    }
  }, [results])

  // Second useEffect to handle filtering and sorting
  useEffect(() => {
    if (!results?.data) return

    let data = [...results.data]

    // Apply filters
    Object.keys(filters).forEach((column) => {
      if (filters[column]) {
        data = data.filter((row) => String(row[column]).toLowerCase().includes(filters[column].toLowerCase()))
      }
    })

    // Apply sorting
    if (sortConfig) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredData(data)
  }, [filters, sortConfig, results.data]) // Changed dependency array

  const handleSort = (column: string) => {
    let direction: "ascending" | "descending" = "ascending"

    if (sortConfig && sortConfig.key === column && sortConfig.direction === "ascending") {
      direction = "descending"
    }

    setSortConfig({ key: column, direction })
  }

  const handleFilterChange = (column: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [column]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({})
  }

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <h2>Results</h2>
        <div className={styles.tableControls}>
          <div className={styles.rowsPerPageControl}>
            <label>Rows per page:</label>
            <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <button
            className={styles.clearFiltersButton}
            onClick={clearFilters}
            disabled={Object.keys(filters).length === 0}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        {isLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Executing query...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No results found</p>
          </div>
        ) : (
          <table className={styles.resultsTable}>
            <thead>
              <tr>
                {results.columns.map((column) => (
                  <th key={column} onClick={() => handleSort(column)}>
                    <div className={styles.columnHeader}>
                      <span>{column}</span>
                      {sortConfig?.key === column && (
                        <span className={styles.sortIcon}>{sortConfig.direction === "ascending" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
              <tr className={styles.filterRow}>
                {results.columns.map((column) => (
                  <th key={`filter-${column}`}>
                    <input
                      type="text"
                      placeholder="Filter..."
                      value={filters[column] || ""}
                      onChange={(e) => handleFilterChange(column, e.target.value)}
                      className={styles.filterInput}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {results.columns.map((column) => (
                    <td key={`${rowIndex}-${column}`}>{row[column]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!isLoading && filteredData.length > 0 && (
        <div className={styles.pagination}>
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className={styles.paginationButton}>
            &laquo;
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            &lsaquo;
          </button>

          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            &rsaquo;
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            &raquo;
          </button>
        </div>
      )}

      {!isLoading && filteredData.length > 0 && (
        <div className={styles.resultsSummary}>
          Showing {paginatedData.length} of {filteredData.length} results
          {filteredData.length !== results.data.length && (
            <span> (filtered from {results.data.length} total results)</span>
          )}
        </div>
      )}
    </div>
  )
}

