import React, {useCallback, useMemo} from 'react';
import { createEditor, Editor, Transforms, Node } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { useState } from 'react';
import { Text } from 'slate';
import './slateEdi.css';
import {
  Descendant,
  Element as SlateElement,
} from 'slate';


// Define our own custom set of helpers.
const CustomEditor = {
  isBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.bold === true,
      universal: true,
    })

    return !!match
  },

  isItalicMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.italic === true,
      universal: true,
    })

    return !!match
  },

  isUnderlineMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.underline === true,
      universal: true,
    })

    return !!match
  },


  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === 'code',
    })

    return !!match
  },

  isBlockActive(editor, type) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === type,
    })

    return !!match
  },

  isListActive(editor) {
    return this.isBlockActive(editor, 'numbered-list') ||
      this.isBlockActive(editor, 'bulleted-list')
  },

  isBlockActive(editor, type) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === type,
    })

    return !!match
  },

  toggleBlockActive(editor, type) {
    const isActive = this.isBlockActive(editor, type)

    Transforms.setNodes(
      editor,
      { type: isActive ? null : type },
      { match: n => Editor.isBlock(editor, n), split: true }
    )
  },

  // Toggle 

  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor)
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
    )
  },

  toggleItalicMark(editor) {
    const isActive = CustomEditor.isItalicMarkActive(editor)
    Transforms.setNodes(
      editor,
      { italic: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
    )
  },
  toggleUnderlineMark(editor) {
    const isActive = CustomEditor.isUnderlineMarkActive(editor)
    Transforms.setNodes(
      editor,
      { underline: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
    )
  },

  toggleCodeBlock(editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor)
    Transforms.setNodes(
      editor,
      { type: isActive ? null : 'code' },
      { match: n => Editor.isBlock(editor, n) }
    )
  },

  toggleBlock(editor, format) {
    const isActive = CustomEditor.isBlockActive(editor, format)
    Transforms.setNodes(
      editor,
      { type: isActive ? null : format },
      { match: n => Editor.isBlock(editor, n) }
    )
  }
}

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
]

const Edi = () => {
  const editor = useMemo(() => withReact(createEditor()), [])

  // Update the initial content to be pulled from Local Storage if it exists.
  const initialValue = useMemo(
    () =>
      JSON.parse(localStorage.getItem('content')) || [
        {
          type: 'paragraph',
          children: [{ text: 'A line of text in a paragraph.' }],
        },
      ],
    []
  )

  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      case 'div':
        return <DivElement {...props} />
      case 'block-quote':
            return <blockquote {...props.attributes} id="bq" >{props.children}</blockquote>
      case 'bulleted-list':
              return (
                <ul {...props.attributes}>
                  {props.children}
                </ul>
              )
      case 'numbered-list':
                return (
                  <ol {...props.attributes}>
                    {props.children}
                  </ol>
                )
      case 'list-item':
                return <li {...props.attributes}>{props.children}</li>
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, [])

  return (
    // Add a toolbar with buttons that call the same methods.
    <Slate editor={editor} value={initialValue}>
      <div id='full-con'>
      <div>
        <button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleBoldMark(editor)
          }}
        >
          <strong>B</strong>
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleItalicMark(editor)
          }}
        >
          <i><strong>I</strong></i>
        </button>

          <button
            onMouseDown={event => {
              event.preventDefault()
              CustomEditor.toggleUnderlineMark(editor)
            }}
          >
            <strong>U</strong>
          </button>

        <button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleCodeBlock(editor)
          }}
        >
          <b>CODE</b>
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleBlock(editor, 'block-quote')
          }}
        >
          <b>&ldquo;</b>
        </button>

        <button
        onMouseDown={event=>{
          event.preventDefault()
          Transforms.setNodes(
              editor,
              { type: 'div' },
              { match: n => Editor.isBlock(editor, n) }
            )
        }}><strong>div</strong></button>

<button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleBlock(editor, 'default')
          }}
        ><strong>p</strong>
        </button>
      </div>
      <div id='ediText'>
      <Editable
        editor={editor}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        onChange={value => {
        const isAstChange = editor.operations.some(
          op => 'set_selection' !== op.type
        )
        if (isAstChange) {
          // Save the value to Local Storage.
          const content = JSON.stringify(value)
          localStorage.setItem('content', content)
        }
      }}
        onKeyDown={event => {
          if (!event.ctrlKey) {
            return
          }

          switch (event.key) {
            case '`': {
              event.preventDefault()
              CustomEditor.toggleCodeBlock(editor)
              break
            }

            case 'b': {
              event.preventDefault()
              CustomEditor.toggleBoldMark(editor)
              break
              
            }
            case 'i': {
              event.preventDefault()
              CustomEditor.toggleItalicMark(editor)
              break
            }
            case 'u': {
              event.preventDefault()
              CustomEditor.toggleUnderlineMark(editor)
              break
            }
            case '"': {
              event.preventDefault()
              CustomEditor.toggleBlock(editor, 'block-quote')
              break
            }

// default block
            default:
              return
          }
        }}
      />
      </div>
      </div>
    </Slate>
  )
}

const CodeElement = props => {
    
    return (
        // we need the rendrer
        <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
    )

}

const DivElement = props => {
    return (
        // we need the rendrer
        <div {...props.attributes}>
      {props.children}
    </div>
    )
    }


const DefaultElement = props => {
    
    return <p {...props.attributes}>{props.children}</p>

}

const Leaf = ({ attributes, children, leaf }) => {
  console.log(leaf);
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }
  if(leaf.italic){
    children = <em>{children}</em>
  }
  if(leaf.underline){
    children = <u>{children}</u>
  }
  return (
    <span {...attributes}>{children}</span>
  )
}

export default Edi;
