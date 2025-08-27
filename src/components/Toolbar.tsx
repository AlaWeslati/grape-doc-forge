import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, FolderOpen, Download, Trash2, FileText } from 'lucide-react';

interface ToolbarProps {
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onClear: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onSave,
  onLoad,
  onExport,
  onClear,
}) => {
  return (
    <div className="bg-editor-toolbar border-b border-editor-border px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
            Document Builder
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            className="transition-smooth hover:shadow-elegant"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onLoad}
            className="transition-smooth hover:shadow-elegant"
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Load
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="transition-smooth hover:shadow-elegant"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="transition-smooth hover:shadow-elegant hover:border-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};