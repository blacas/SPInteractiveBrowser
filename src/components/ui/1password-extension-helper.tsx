import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { ExternalLink, CheckCircle, AlertCircle, Download } from 'lucide-react';

interface ExtensionStatus {
  installed: boolean;
  version?: string;
  name?: string;
  id?: string;
  downloadUrl?: string;
  instructions?: string;
  error?: string;
}

interface InstallationGuide {
  success: boolean;
  message: string;
  steps: string[];
  webStoreUrl: string;
}

export const OnePasswordExtensionHelper: React.FC = () => {
  const [status, setStatus] = useState<ExtensionStatus | null>(null);
  const [installGuide, setInstallGuide] = useState<InstallationGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  const checkExtensionStatus = async () => {
    try {
      setLoading(true);
      if (window.secureBrowser?.extensions?.get1PasswordStatus) {
        const result = await window.secureBrowser.extensions.get1PasswordStatus();
        setStatus(result);
      } else {
        setStatus({
          installed: false,
          error: 'Extension API not available'
        });
      }
    } catch (error) {
      console.error('Failed to check 1Password extension status:', error);
      setStatus({
        installed: false,
        error: 'Failed to check extension status'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInstallClick = async () => {
    try {
      if (window.secureBrowser?.extensions?.install1Password) {
        const result = await window.secureBrowser.extensions.install1Password();
        setInstallGuide(result);
        setShowGuide(true);
      }
    } catch (error) {
      console.error('Failed to get installation guide:', error);
    }
  };

  const openWebStore = () => {
    if (status?.downloadUrl) {
      window.open(status.downloadUrl, '_blank');
    }
  };

  useEffect(() => {
    checkExtensionStatus();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Checking 1Password Extension
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Verifying extension status...</p>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Extension Status Unknown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Could not determine extension status.</p>
          <Button onClick={checkExtensionStatus} className="mt-2">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40ODggMiAyIDYuNDg4IDIgMTJTNi40ODggMjIgMTIgMjJTMjIgMTcuNTEyIDIyIDEyUzE3LjUxMiAyIDEyIDJaTTEyIDZDMTQuMjA2IDYgMTYgNy43OTQgMTYgMTBTMTQuMjA2IDE0IDEyIDE0UzggMTIuMjA2IDggMTBTOS43OTQgNiAxMiA2Wk0xMiA4QzEwLjg5NSA4IDEwIDguODk1IDEwIDEwUzEwLjg5NSAxMiAxMiAxMlMxNCAxMS4xMDUgMTQgMTBTMTMuMTA1IDggMTIgOFoiIGZpbGw9IiMwMDc5RkYiLz4KPC9zdmc+Cg==" 
              alt="1Password" 
              className="h-5 w-5"
            />
            1Password Extension
          </div>
          {status.installed ? (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Installed
            </Badge>
          ) : (
            <Badge className="bg-yellow-100 text-yellow-800">
              <AlertCircle className="h-3 w-3 mr-1" />
              Not Installed
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {status.installed ? (
          <div className="space-y-2">
            <p className="text-sm text-green-700">
              ✅ 1Password extension is installed and ready to use!
            </p>
            {status.version && (
              <p className="text-xs text-gray-600">
                Version: {status.version}
              </p>
            )}
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>You now have:</strong>
              </p>
              <ul className="text-sm text-green-700 mt-1 space-y-1">
                <li>• 🔐 Automatic SharePoint login (via secure API)</li>
                <li>• 🧩 1Password extension for other sites</li>
                <li>• 🔒 Familiar 1Password UI and autofill</li>
                <li>• 🎯 Best of both worlds!</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-700">
              {status.instructions || 'Install the 1Password extension for the best experience.'}
            </p>
            {status.error && (
              <p className="text-sm text-red-600">
                Error: {status.error}
              </p>
            )}
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Why install the extension?</strong>
              </p>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• See familiar 1Password UI</li>
                <li>• Use 1Password for other websites</li>
                <li>• Manual password fill when needed</li>
                <li>• SharePoint still logs in automatically</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleInstallClick}
                className="flex items-center gap-2"
                variant="outline"
              >
                <Download className="h-4 w-4" />
                Show Installation Guide
              </Button>
              {status.downloadUrl && (
                <Button 
                  onClick={openWebStore}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Web Store
                </Button>
              )}
            </div>
          </div>
        )}

        {showGuide && installGuide && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Installation Steps:</h4>
            <ol className="text-sm text-gray-700 space-y-1">
              {installGuide.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="font-mono text-xs bg-gray-200 px-1 rounded">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="mt-3 flex gap-2">
              <Button 
                onClick={() => window.open(installGuide.webStoreUrl, '_blank')}
                size="sm"
                className="flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                Open Chrome Web Store
              </Button>
              <Button 
                onClick={checkExtensionStatus}
                variant="outline"
                size="sm"
              >
                Check Again
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 