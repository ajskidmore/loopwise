import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Pip } from './Pip';

/** Catches rendering crashes so learners see a friendly screen instead of a blank page. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[loopwise] crashed', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    const chunkError = /dynamically imported module|Loading chunk|Failed to fetch/i.test(this.state.error.message);
    return (
      <div className="results">
        <Pip size={120} mood="sad" />
        <h1>{chunkError ? 'Loopwise was updated' : 'Something went wrong'}</h1>
        <p className="muted">
          {chunkError
            ? 'A new version is available. Reload to get it — your progress is safe.'
            : 'Sorry about that! Your progress is saved. Reloading usually fixes it.'}
        </p>
        <div className="results-actions">
          <button className="btn btn-ghost" onClick={() => { this.setState({ error: null }); window.location.assign('/learn'); }}>Go to my path</button>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Reload</button>
        </div>
      </div>
    );
  }
}
