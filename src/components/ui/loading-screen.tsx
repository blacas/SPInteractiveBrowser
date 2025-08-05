import React from 'react';
import { Shield, Wifi, Server, CheckCircle, XCircle, Loader } from 'lucide-react';
import { Card } from './card';

interface LoadingScreenProps {
  stage: 'auth' | 'vault' | 'vpn' | 'ready';
  message?: string;
  error?: string | null;
  progress?: number;
}

interface StatusItemProps {
  icon: React.ReactNode;
  label: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  message?: string;
}

const StatusItem: React.FC<StatusItemProps> = ({ icon, label, status, message }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader className="w-4 h-4 animate-spin text-blue-400" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-slate-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-300';
      case 'success':
        return 'text-green-300';
      case 'error':
        return 'text-red-300';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2 p-4 rounded-lg bg-slate-700/50">
      <div className="flex items-center space-x-2">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="flex items-center space-x-2">
          <p className={`text-sm font-medium ${getStatusColor()}`}>
            {label}
          </p>
          {getStatusIcon()}
        </div>
      </div>
      {message && (
        <p className="text-xs text-slate-400 text-center">
          {message}
        </p>
      )}
    </div>
  );
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  stage, 
  message, 
  error, 
  progress = 0 
}) => {
  const getStageStatus = (currentStage: string, targetStage: string) => {
    const stages = ['auth', 'vault', 'vpn', 'ready'];
    const currentIndex = stages.indexOf(currentStage);
    const targetIndex = stages.indexOf(targetStage);
    
    if (error && currentStage === targetStage) return 'error';
    if (currentIndex > targetIndex) return 'success';
    if (currentIndex === targetIndex) return 'loading';
    return 'pending';
  };

  const getStageMessage = (stageName: string) => {
    switch (stageName) {
      case 'auth':
        return 'Initializing application...';
      case 'vault':
        return error ? 'Vault connection failed' : 'Connecting to vault service...';
      case 'vpn':
        return 'Establishing VPN connection to Australia...';
      case 'ready':
        return 'Application ready!';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 w-full overflow-auto">
      <div className="w-full p-4">
        <Card className="max-w-md mx-auto bg-slate-800 border-slate-700">
        <div className="p-8 text-center space-y-6">
          {/* Header */}
          <div>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Shield className="w-12 h-12 text-blue-400" />
                {stage === 'ready' && (
                  <CheckCircle className="w-6 h-6 text-green-400 absolute -top-1 -right-1 bg-slate-800 rounded-full" />
                )}
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Aussie Vault Browser
            </h1>
            <p className="text-slate-300 text-sm">
              Initializing secure environment...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          {/* Status Items */}
          <div className="space-y-2">
            <StatusItem
              icon={<Server className="w-5 h-5 text-slate-400" />}
              label="Application"
              status={getStageStatus(stage, 'auth')}
              message={getStageMessage('auth')}
            />
            
            <StatusItem
              icon={<Shield className="w-5 h-5 text-yellow-400" />}
              label="Vault Service"
              status={getStageStatus(stage, 'vault')}
              message={getStageMessage('vault')}
            />
            
            <StatusItem
              icon={<Wifi className="w-5 h-5 text-blue-400" />}
              label="VPN Connection"
              status={getStageStatus(stage, 'vpn')}
              message={getStageMessage('vpn')}
            />
          </div>

          {/* Current Status Message */}
          {message && (
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3">
              <p className="text-blue-200 text-sm">
                {message}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-3">
              <p className="text-red-200 text-sm font-medium mb-1">
                ⚠️ Initialization Error
              </p>
              <p className="text-red-300 text-xs">
                {error}
              </p>
              <p className="text-red-400 text-xs mt-2">
                The application will continue with limited functionality.
              </p>
            </div>
          )}

          {/* Loading Animation */}
          {stage !== 'ready' && !error && (
            <div className="flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="border-t border-slate-600 pt-4">
            <p className="text-xs text-slate-500">
              🔒 All traffic is encrypted and routed through secure Australian servers
            </p>
          </div>
        </div>
        </Card>
      </div>
    </div>
  );
};

export default LoadingScreen;