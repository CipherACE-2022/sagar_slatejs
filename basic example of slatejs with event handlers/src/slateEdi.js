import React, { useMemo } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react'
import { useState } from 'react';

const initialValue = [
    {
      type: 'paragraph',
      children: [{ text: 'A line of text in a paragraph.' }],
    },
  ]

const Editor = () => {
const editor = useMemo(() => withReact(createEditor()), [])
  // Render the Slate context.
  return <Slate editor={editor} value={initialValue} >
  <Editable onKeyDown={event => {
      console.log(event.key)
      if(event.key === '&'){
          event.preventDefault()
          editor.insertText('and')
      }
  }
  } />
  </Slate>
}

export default Editor;
