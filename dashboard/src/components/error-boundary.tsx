"use client"

import { Component, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: "" }
  }

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : "Erro desconhecido"
    return { hasError: true, message }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Algo deu errado</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-md">{this.state.message}</p>
          <button
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => this.setState({ hasError: false, message: "" })}
          >
            Tentar novamente
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
