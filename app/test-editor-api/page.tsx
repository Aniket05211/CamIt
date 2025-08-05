"use client"

import { useState, useEffect } from "react"

export default function TestEditorAPI() {
  const [testResults, setTestResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testEditorsAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/editors?limit=5')
      const data = await response.json()
      setTestResults({ api: 'editors', data })
    } catch (error) {
      setTestResults({ api: 'editors', error: error.message })
    }
    setLoading(false)
  }

  const testEditorDB = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-editor-db')
      const data = await response.json()
      setTestResults({ api: 'test-editor-db', data })
    } catch (error) {
      setTestResults({ api: 'test-editor-db', error: error.message })
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Editor API Test</h1>
      
      <div className="space-y-4">
        <button 
          onClick={testEditorsAPI}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Editors API
        </button>
        
        <button 
          onClick={testEditorDB}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Editor DB
        </button>
      </div>

      {loading && (
        <div className="mt-4">
          <p>Testing...</p>
        </div>
      )}

      {testResults && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Results for {testResults.api}:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(testResults.data || testResults.error, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
} 