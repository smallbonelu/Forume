import React, { Component } from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode[];
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  info: object;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: new Error(),
      info: {componentStack: ""}
    }
  }

  static getDerivedStateFromError = (error: Error) => {
    return {hasError: true}
  }
  componentDidCatch(error: Error| null, info: object) {
    console.log("error", error)
    this.setState({hasError: true, error, info})
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2 style={{ padding: "2em" }}>
            Something has gone wrong. Please reload your screen.
          </h2>
        </div>
      );
    }

    return this.props.children;
  }
}
