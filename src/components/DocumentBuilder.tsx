import React, { useEffect, useRef, useState } from 'react';
import grapesjs, { Editor } from 'grapesjs';
import { toast } from 'sonner';
import { Toolbar } from './Toolbar';

export const DocumentBuilder = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!editorRef.current) return;

    const editorInstance = grapesjs.init({
      container: editorRef.current,
      height: '100vh',
      width: '100%',
      storageManager: {
        type: 'local',
        autosave: true,
        autoload: true,
        stepsBeforeSave: 1,
      },
      blockManager: {
        appendTo: '.blocks-container',
        blocks: [
          {
            id: 'text',
            label: 'Text',
            content: '<div data-gjs-type="text">Insert your text here</div>',
            category: 'Basic',
            attributes: { class: 'fa fa-text-width' },
          },
          {
            id: 'image',
            label: 'Image',
            content: { type: 'image' },
            category: 'Basic',
            attributes: { class: 'fa fa-image' },
          },
          {
            id: 'video',
            label: 'Video',
            content: { type: 'video' },
            category: 'Basic',
            attributes: { class: 'fa fa-youtube-play' },
          },
          {
            id: 'button',
            label: 'Button',
            content: '<a class="btn" href="#">Button</a>',
            category: 'Basic',
            attributes: { class: 'fa fa-hand-pointer-o' },
          },
          {
            id: 'column1',
            label: '1 Column',
            content: '<div class="row"><div class="col">Column 1</div></div>',
            category: 'Layout',
            attributes: { class: 'fa fa-columns' },
          },
          {
            id: 'column2',
            label: '2 Columns',
            content: '<div class="row"><div class="col">Column 1</div><div class="col">Column 2</div></div>',
            category: 'Layout',
            attributes: { class: 'fa fa-columns' },
          },
          {
            id: 'column3',
            label: '3 Columns',
            content: '<div class="row"><div class="col">Column 1</div><div class="col">Column 2</div><div class="col">Column 3</div></div>',
            category: 'Layout',
            attributes: { class: 'fa fa-columns' },
          },
        ],
      },
      layerManager: {
        appendTo: '.layers-container',
      },
      deviceManager: {
        devices: [
          {
            name: 'Desktop',
            width: '',
          },
          {
            name: 'Tablet',
            width: '768px',
            widthMedia: '992px',
          },
          {
            name: 'Mobile',
            width: '320px',
            widthMedia: '768px',
          },
        ],
      },
      panels: {
        defaults: [
          {
            id: 'basic-actions',
            el: '.panel__basic-actions',
            buttons: [
              {
                id: 'visibility',
                active: true,
                className: 'btn-toggle-borders',
                label: '<i class="fa fa-clone"></i>',
                command: 'sw-visibility',
                attributes: { title: 'Toggle borders' },
              },
              {
                id: 'export',
                className: 'btn-open-export',
                label: '<i class="fa fa-code"></i>',
                command: 'export-template',
                attributes: { title: 'View code' },
              },
              {
                id: 'show-json',
                className: 'btn-show-json',
                label: '<i class="fa fa-file-code-o"></i>',
                command: 'show-json',
                attributes: { title: 'Show JSON' },
              },
            ],
          },
          {
            id: 'panel-devices',
            el: '.panel__devices',
            buttons: [
              {
                id: 'device-desktop',
                label: '<i class="fa fa-desktop"></i>',
                command: 'set-device-desktop',
                active: true,
                togglable: false,
                attributes: { title: 'Desktop view' },
              },
              {
                id: 'device-tablet',
                label: '<i class="fa fa-tablet"></i>',
                command: 'set-device-tablet',
                togglable: false,
                attributes: { title: 'Tablet view' },
              },
              {
                id: 'device-mobile',
                label: '<i class="fa fa-mobile"></i>',
                command: 'set-device-mobile',
                togglable: false,
                attributes: { title: 'Mobile view' },
              },
            ],
          },
        ],
      },
      selectorManager: {
        appendTo: '.styles-container',
      },
      styleManager: {
        appendTo: '.styles-container',
        sectors: [
          {
            name: 'General',
            open: false,
            buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
          },
          {
            name: 'Dimension',
            open: false,
            buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
          },
          {
            name: 'Typography',
            open: false,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'text-shadow'],
          },
          {
            name: 'Background',
            open: false,
            buildProps: ['background-color', 'background-image', 'background-repeat', 'background-attachment', 'background-position', 'background-size'],
          },
          {
            name: 'Border',
            open: false,
            buildProps: ['border-collapse', 'border-radius', 'border-style', 'border-color', 'border-width'],
          },
        ],
      },
      traitManager: {
        appendTo: '.traits-container',
      },
    });

    // Add custom commands
    editorInstance.Commands.add('show-json', {
      run: function (editor, sender) {
        sender && sender.set('active', 0);
        const component = editor.getSelected();
        const json = component ? JSON.stringify(component.toJSON(), null, 2) : JSON.stringify(editor.getProjectData(), null, 2);
        
        const modal = document.createElement('div');
        modal.innerHTML = `
          <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 20px; border-radius: 8px; max-width: 80%; max-height: 80%; overflow: auto;">
              <h3>Component JSON</h3>
              <pre style="background: #f5f5f5; padding: 15px; border-radius: 4px; overflow: auto; max-height: 400px;">${json}</pre>
              <button onclick="this.parentElement.parentElement.remove()" style="margin-top: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
      },
    });

    editorInstance.Commands.add('set-device-desktop', {
      run: (editor) => editor.setDevice('Desktop'),
    });
    editorInstance.Commands.add('set-device-tablet', {
      run: (editor) => editor.setDevice('Tablet'),
    });
    editorInstance.Commands.add('set-device-mobile', {
      run: (editor) => editor.setDevice('Mobile'),
    });

    // Initialize with some default content
    editorInstance.setComponents(`
      <div style="padding: 40px; text-align: center;">
        <h1 style="font-size: 2.5rem; margin-bottom: 20px; color: #333;">Welcome to Document Builder</h1>
        <p style="font-size: 1.2rem; color: #666; margin-bottom: 30px;">Start building your amazing document by dragging components from the sidebar!</p>
        <a href="#" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, hsl(258, 100%, 67%), hsl(280, 100%, 70%)); color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">Get Started</a>
      </div>
    `);

    setEditor(editorInstance);
    setIsLoading(false);
    toast.success('Document builder loaded successfully!');

    return () => {
      editorInstance.destroy();
    };
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