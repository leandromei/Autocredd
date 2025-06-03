import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Navigation } from 'lucide-react';
import { Button } from './button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorType: 'navigation' | 'component' | 'unknown';
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorType: 'unknown',
  };

  public static getDerivedStateFromError(error: Error): State {
    // Determine error type based on error message
    let errorType: 'navigation' | 'component' | 'unknown' = 'unknown';
    
    if (error.message.includes('removeChild') || 
        error.message.includes('Node') || 
        error.message.includes('navigation') ||
        error.message.includes('router')) {
      errorType = 'navigation';
    } else if (error.message.includes('render') || 
               error.message.includes('component') ||
               error.message.includes('hook')) {
      errorType = 'component';
    }

    return { hasError: true, error, errorInfo: null, errorType };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, errorType: 'unknown' });
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, errorType: 'unknown' });
    // Force a clean navigation
    window.location.href = '/dashboard';
  };

  private handleReload = () => {
    window.location.reload();
  };

  private getErrorMessage = () => {
    const { errorType, error } = this.state;
    
    switch (errorType) {
      case 'navigation':
        return 'Erro na navegação. Clique muito rápido nas abas pode causar este problema.';
      case 'component':
        return 'Erro no carregamento do componente. Tente recarregar a página.';
      default:
        return error?.message || 'Ocorreu um erro inesperado na aplicação.';
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { errorType } = this.state;

      return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-6 p-6">
          <div className="flex flex-col items-center gap-4">
            <AlertTriangle className="h-16 w-16 text-destructive" />
            <div className="text-center">
              <h2 className="text-xl font-semibold">Oops! Algo deu errado</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                {this.getErrorMessage()}
              </p>
              {errorType === 'navigation' && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Dica: Aguarde um momento entre os cliques nas abas para evitar este erro.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={this.handleRetry}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </Button>
            
            {errorType === 'navigation' ? (
              <Button
                onClick={this.handleGoHome}
                className="flex items-center gap-2"
              >
                <Navigation className="h-4 w-4" />
                Navegar para Dashboard
              </Button>
            ) : (
              <Button
                onClick={this.handleReload}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Recarregar página
              </Button>
            )}
            
            <Button
              variant="secondary"
              onClick={this.handleGoHome}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Ir para Dashboard
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details className="mt-4 w-full max-w-2xl">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                Detalhes do erro (desenvolvimento)
              </summary>
              <div className="mt-2 text-xs bg-muted p-4 rounded-lg">
                <p><strong>Tipo do erro:</strong> {this.state.errorType}</p>
                <pre className="mt-2 whitespace-pre-wrap overflow-auto max-h-40">
                  {this.state.error?.stack}
                  {'\n\n'}
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
} 