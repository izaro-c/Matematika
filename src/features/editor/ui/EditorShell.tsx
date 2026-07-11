import React from 'react';

interface EditorShellProps {
  toolbar: React.ReactNode;
  navigation: React.ReactNode;
  children: React.ReactNode;
}

export const EditorShell: React.FC<EditorShellProps> = ({
  toolbar,
  navigation,
  children,
}) => {
  return (
    <div className="flex h-screen bg-lienzo text-carbon font-sans overflow-hidden transition-colors duration-200">
      {navigation}
      <div className="flex-1 flex flex-col h-full bg-lienzo relative overflow-hidden">
        {toolbar}
        <div className="flex-1 flex overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};
export default EditorShell;
