import React, { useState } from 'react';
import {
  BtnBold, BtnBulletList, BtnClearFormatting, BtnItalic,
  BtnLink, BtnNumberedList, BtnStrikeThrough, BtnStyles,
  BtnUnderline, Editor, EditorProvider, Separator, Toolbar
} from 'react-simple-wysiwyg';

function RichTextEditor({ value, onChange }) {
  return (
    <div className="min-h-[120px] p-2 border border-gray-300 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-400 rounded">
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnStyles />
            <BtnLink />
            <BtnClearFormatting />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}

export default RichTextEditor;
