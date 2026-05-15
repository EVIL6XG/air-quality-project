import { Component } from "react"

import { ErrorFallback } from "./error-fallback"

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  reset = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      const Fallback = this.props.fallback ?? ErrorFallback
      return <Fallback error={this.state.error} resetErrorBoundary={this.reset} />
    }

    return this.props.children
  }
}
