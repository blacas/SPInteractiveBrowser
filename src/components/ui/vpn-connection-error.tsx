import React from 'react';
import { AlertTriangle, Shield, RefreshCw, Globe, Wifi } from 'lucide-react';
import { Button } from './button';

interface VPNConnectionErrorProps {
  onRetry: () => void;
  onCheckStatus: () => void;
  isRetrying?: boolean;
  isChecking?: boolean;
  errorDetails?: string;
}

const VPNConnectionError: React.FC<VPNConnectionErrorProps> = ({ 
  onRetry, 
  onCheckStatus,
  isRetrying = false, 
  isChecking = false,
  errorDetails 
}) => {
  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-8 py-16">
        <div className="max-w-2xl mx-auto text-center w-full">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-2xl">
            <Shield className="w-16 h-16 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          VPN Connection Required
        </h1>
        
        <p className="text-xl text-slate-600 mb-6 leading-relaxed">
          Secure browsing requires an active WireGuard VPN connection to Australia
        </p>

        {/* Details Box */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-200">
          <div className="flex items-start gap-4 text-left">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 mb-2">Why is this required?</h3>
              <ul className="text-slate-600 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  Your organization requires all browsing to route through Australian servers
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  This ensures compliance with data sovereignty requirements
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  All traffic is encrypted and secured through the VPN tunnel
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Error Details (if any) */}
        {errorDetails && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Wifi className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-800">Connection Details</span>
            </div>
            <p className="text-red-700 text-sm font-mono bg-red-100 p-2 rounded">
              {errorDetails}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={onCheckStatus}
            disabled={isChecking}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            {isChecking ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                Check Connection
              </>
            )}
          </Button>

          <Button
            onClick={onRetry}
            disabled={isRetrying}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Retry Connection
              </>
            )}
          </Button>

          <Button
            variant="outline"
            className="px-8 py-3 rounded-lg font-medium border-slate-300 text-slate-700 hover:bg-slate-50 transition-all duration-200"
            onClick={() => {
              // Open help documentation
              window.open('/docs/wireguard-setup.md', '_blank');
            }}
          >
            Setup Guide
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-slate-500 text-sm mb-2">
            Need assistance with VPN setup?
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact IT Support
            </a>
            <span className="text-slate-300">•</span>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              WireGuard Documentation
            </a>
            <span className="text-slate-300">•</span>
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Troubleshooting Guide
            </a>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
          <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
          Waiting for VPN connection to Australia
        </div>
        </div>
      </div>
    </div>
  );
};

export default VPNConnectionError; 