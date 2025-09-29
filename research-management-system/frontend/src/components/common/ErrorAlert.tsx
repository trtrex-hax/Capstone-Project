interface ErrorAlertProps {
  message: string;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  severity?: 'error' | 'warning' | 'info';
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  title = 'Error',
  dismissible = false,
  onDismiss,
  severity = 'error'
}) => {
  // Color mappings for different severities
  const colors = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-400'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-400'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-400'
    }
  };

  const colorClasses = colors[severity];

  return (
    <div className={`${colorClasses.bg} border ${colorClasses.border} ${colorClasses.text} rounded-lg p-4 mb-6`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className={`h-5 w-5 ${colorClasses.icon}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">{title}</h3>
          <div className="mt-1 text-sm">
            {message}
          </div>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              onClick={onDismiss}
              className={`inline-flex rounded-md p-1.5 ${colorClasses.text} hover:${colorClasses.bg} focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;