import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  X,
  RefreshCw,
  Globe,
  Zap
} from 'lucide-react';

interface TaskInfo {
  id: string;
  name: string;
  type: 'tab' | 'extension' | 'system' | 'network';
  status: 'active' | 'suspended' | 'loading' | 'error';
  memoryUsage?: string;
  cpuUsage?: string;
  url?: string;
  pid?: number;
}

interface TaskManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TaskManagerModal: React.FC<TaskManagerModalProps> = ({ isOpen, onClose }) => {
  const [tasks, setTasks] = useState<TaskInfo[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'processes' | 'network' | 'performance'>('processes');

  // Mock task data - in a real implementation, this would come from Electron's process manager
  const generateMockTasks = (): TaskInfo[] => {
    const mockTasks: TaskInfo[] = [
      {
        id: 'main-window',
        name: 'Aussie Vault Browser',
        type: 'system',
        status: 'active',
        memoryUsage: '245 MB',
        cpuUsage: '2.1%',
        pid: 12345
      },
      {
        id: 'espncricinfo-tab',
        name: 'ESPN Cricinfo',
        type: 'tab',
        status: 'active',
        memoryUsage: '89 MB',
        cpuUsage: '0.8%',
        url: 'https://www.espncricinfo.com/'
      },
      {
        id: 'cricinfo-tab2',
        name: "Today's Cricket ...",
        type: 'tab',
        status: 'active',
        memoryUsage: '45 MB',
        cpuUsage: '0.3%',
        url: 'https://www.espncricinfo.com/live-cricket-score'
      },
      {
        id: 'renderer-process',
        name: 'Renderer Process',
        type: 'system',
        status: 'active',
        memoryUsage: '156 MB',
        cpuUsage: '1.2%',
        pid: 12346
      },
      {
        id: 'vpn-service',
        name: 'VPN Connection (Australia)',
        type: 'network',
        status: 'active',
        memoryUsage: '12 MB',
        cpuUsage: '0.1%',
        pid: 12347
      },
      {
        id: '1password-extension',
        name: '1Password Extension',
        type: 'extension',
        status: 'active',
        memoryUsage: '8 MB',
        cpuUsage: '0.0%'
      }
    ];

    // Add some randomness to memory and CPU usage for realism
    return mockTasks.map(task => ({
      ...task,
      memoryUsage: task.memoryUsage ? 
        `${Math.floor(parseInt(task.memoryUsage) * (0.9 + Math.random() * 0.2))} MB` : 
        task.memoryUsage,
      cpuUsage: task.cpuUsage ? 
        `${(parseFloat(task.cpuUsage) * (0.8 + Math.random() * 0.4)).toFixed(1)}%` : 
        task.cpuUsage
    }));
  };

  const refreshTasks = async () => {
    setIsRefreshing(true);
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setTasks(generateMockTasks());
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (isOpen) {
      refreshTasks();
      // Auto-refresh every 5 seconds when open
      const interval = setInterval(refreshTasks, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'tab': return <Globe className="w-4 h-4" />;
      case 'extension': return <Zap className="w-4 h-4" />;
      case 'network': return <Wifi className="w-4 h-4" />;
      case 'system': return <Monitor className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'loading': return 'bg-blue-100 text-blue-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const endTask = (taskId: string) => {
    if (taskId.includes('tab')) {
      // In a real implementation, this would close the tab
      // console.log('🔄 Closing tab:', taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } else {
      // console.log('⚠️ Cannot end system process:', taskId);
    }
  };

  const totalMemoryUsage = tasks.reduce((total, task) => {
    if (task.memoryUsage) {
      return total + parseInt(task.memoryUsage);
    }
    return total;
  }, 0);

  const totalCpuUsage = tasks.reduce((total, task) => {
    if (task.cpuUsage) {
      return total + parseFloat(task.cpuUsage);
    }
    return total;
  }, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Task Manager
          </DialogTitle>
          <DialogDescription>
            Monitor and manage browser processes, tabs, and system resources
          </DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setSelectedTab('processes')}
            className={`px-4 py-2 font-medium text-sm ${
              selectedTab === 'processes'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Processes ({tasks.length})
          </button>
          <button
            onClick={() => setSelectedTab('performance')}
            className={`px-4 py-2 font-medium text-sm ${
              selectedTab === 'performance'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setSelectedTab('network')}
            className={`px-4 py-2 font-medium text-sm ${
              selectedTab === 'network'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Network
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {selectedTab === 'processes' && (
            <div className="h-full flex flex-col">
              {/* Header with refresh button */}
              <div className="flex items-center justify-between p-3 border-b border-gray-200">
                <div className="text-sm text-gray-600">
                  {tasks.length} processes running
                </div>
                <Button
                  onClick={refreshTasks}
                  disabled={isRefreshing}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              {/* Process Table */}
              <div className="flex-1 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left p-3 font-medium text-gray-700">Process</th>
                      <th className="text-left p-3 font-medium text-gray-700">Type</th>
                      <th className="text-left p-3 font-medium text-gray-700">Status</th>
                      <th className="text-right p-3 font-medium text-gray-700">Memory</th>
                      <th className="text-right p-3 font-medium text-gray-700">CPU</th>
                      <th className="text-center p-3 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {getTaskIcon(task.type)}
                            <div>
                              <div className="font-medium text-gray-900">{task.name}</div>
                              {task.url && (
                                <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                  {task.url}
                                </div>
                              )}
                              {task.pid && (
                                <div className="text-xs text-gray-400">PID: {task.pid}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="capitalize">
                            {task.type}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge className={`capitalize ${getStatusColor(task.status)}`}>
                            {task.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-right font-mono text-sm">
                          {task.memoryUsage || '-'}
                        </td>
                        <td className="p-3 text-right font-mono text-sm">
                          {task.cpuUsage || '-'}
                        </td>
                        <td className="p-3 text-center">
                          {task.type === 'tab' && (
                            <Button
                              onClick={() => endTask(task.id)}
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedTab === 'performance' && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Memory Usage */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <HardDrive className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium text-gray-900">Memory Usage</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-gray-900">{totalMemoryUsage} MB</div>
                    <div className="text-sm text-gray-600">Total memory used by all processes</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((totalMemoryUsage / 1000) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* CPU Usage */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Cpu className="w-5 h-5 text-green-600" />
                    <h3 className="font-medium text-gray-900">CPU Usage</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-gray-900">{totalCpuUsage.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">Total CPU used by all processes</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(totalCpuUsage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Process Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Process Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-blue-600">
                      {tasks.filter(t => t.type === 'tab').length}
                    </div>
                    <div className="text-sm text-gray-600">Active Tabs</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-600">
                      {tasks.filter(t => t.type === 'extension').length}
                    </div>
                    <div className="text-sm text-gray-600">Extensions</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-600">
                      {tasks.filter(t => t.type === 'system').length}
                    </div>
                    <div className="text-sm text-gray-600">System</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-orange-600">
                      {tasks.filter(t => t.type === 'network').length}
                    </div>
                    <div className="text-sm text-gray-600">Network</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'network' && (
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Wifi className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-gray-900">VPN Connection</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge className="bg-green-100 text-green-800">Connected (Australia)</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Server:</span>
                    <span className="font-mono text-sm">Sydney, Australia (134.159.169.102)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Protocol:</span>
                    <span>WireGuard</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data Transferred:</span>
                    <span>↓ 45.2 MB ↑ 12.8 MB</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskManagerModal;
