import React, { useEffect, useRef, useState } from 'react';
import grapesjs, { Editor } from 'grapesjs';
import { toast } from 'sonner';
import { Toolbar } from './Toolbar';

export const DocumentBuilder = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!editorRef.current) {
      console.log('Editor ref is null');
      return;
    }

    console.log('Initializing GrapeJS...');
    
    try {
      const editorInstance = grapesjs.init({
        container: editorRef.current,
        height: '100vh',
        width: '100%',
        fromElement: false,
        storageManager: false,
        blockManager: {
          appendTo: '.blocks-container',
          blocks: [
            {
              id: 'text',
              label: 'Text',
              content: '<div data-gjs-type="text">Insert your text here</div>',
              category: 'Basic',
            },
            {
              id: 'image',
              label: 'Image',
              content: { type: 'image' },
              category: 'Basic',
            },
          ],
        },
        layerManager: {
          appendTo: '.layers-container',
        },
      });

      console.log('GrapeJS initialized successfully');

      // Initialize with some default content
      editorInstance.setComponents(`
        <div style="padding: 40px; text-align: center;">
          <h1 style="font-size: 2.5rem; margin-bottom: 20px; color: #333;">Welcome to Document Builder</h1>
          <p style="font-size: 1.2rem; color: #666; margin-bottom: 30px;">Start building your amazing document by dragging components from the sidebar!</p>
        </div>
      `);

      console.log('Setting editor and loading state');
      setEditor(editorInstance);
      setIsLoading(false);
      toast.success('Document builder loaded successfully!');

      return () => {
        editorInstance.destroy();
      };
    } catch (error) {
      console.error('Error initializing GrapeJS:', error);
      setIsLoading(false);
      toast.error('Failed to load document builder');
    }
  }, []);

  const handleSave = () => {
    if (!editor) return;
    
    const projectData = editor.getProjectData();
    localStorage.setItem('grapesjs-project', JSON.stringify(projectData));
    toast.success('Document saved successfully!');
  };

  const handleLoad = () => {
    if (!editor) return;
    
    const saved = localStorage.getItem('grapesjs-project');
    if (saved) {
      editor.loadProjectData(JSON.parse(saved));
      toast.success('Document loaded successfully!');
    } else {
      toast.error('No saved document found!');
    }
  };

  const handleExport = () => {
    if (!editor) return;
    
    const html = editor.getHtml();
    const css = editor.getCss();
    const fullDocument = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Exported Document</title>
  <style>
    ${css}
  </style>
</head>
<body>
  ${html}
</body>
</html>
    `;
    
    const blob = new Blob([fullDocument], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Document exported successfully!');
  };

  const handleClear = () => {
    if (!editor) return;
    
    if (confirm('Are you sure you want to clear the document? This action cannot be undone.')) {
      editor.setComponents('');
      editor.setStyle('');
      toast.success('Document cleared!');
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading document builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <Toolbar 
        onSave={handleSave}
        onLoad={handleLoad}
        onExport={handleExport}
        onClear={handleClear}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Blocks */}
        <div className="w-80 bg-editor-sidebar border-r border-editor-border flex flex-col">
          <div className="p-4 border-b border-editor-border">
            <h3 className="text-sm font-semibold text-editor-sidebar-foreground mb-3">Components</h3>
            <div className="blocks-container"></div>
          </div>
          
          <div className="p-4 border-b border-editor-border">
            <h3 className="text-sm font-semibold text-editor-sidebar-foreground mb-3">Layers</h3>
            <div className="layers-container"></div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          {/* Device Panel */}
          <div className="bg-editor-toolbar border-b border-editor-border p-2">
            <div className="flex justify-center">
              <div className="panel__devices"></div>
            </div>
          </div>
          
          {/* Canvas */}
          <div className="flex-1 bg-editor-canvas">
            <div ref={editorRef} className="h-full"></div>
          </div>
        </div>

        {/* Right Sidebar - Styles & Traits */}
        <div className="w-80 bg-editor-sidebar border-l border-editor-border flex flex-col">
          <div className="p-4 border-b border-editor-border">
            <h3 className="text-sm font-semibold text-editor-sidebar-foreground mb-3">Styles</h3>
            <div className="styles-container"></div>
          </div>
          
          <div className="p-4">
            <h3 className="text-sm font-semibold text-editor-sidebar-foreground mb-3">Properties</h3>
            <div className="traits-container"></div>
          </div>
        </div>
      </div>
      
      {/* Hidden panels for basic actions */}
      <div className="panel__basic-actions" style={{ display: 'none' }}></div>
    </div>
  );
};