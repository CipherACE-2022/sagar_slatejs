import React, {useMemo, useCallback} from 'react';
import { createEditor, Transforms, Editor} from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import Button from '@mui/material/Button';
import './custName.css';

const Cname = () => {
    const editor = useMemo(() => withReact(createEditor()), [])
    
    const initialValue = [
        {
          type: 'paragraph',
          children: [{ text: 'Hello, ' }],
        },
        
      ]
    
    const CustomEditor = {
        insertText(editor, text) {
            const name = prompt('Enter a name', 'Name')
            text=name;
            editor.insertText(text);
            console.log("you entered name: ",text);
            
        },
    }

    const SpanElem = props => {
        console.log(props.children);
        return (
            <span {...props.attributes}>{props.children}</span>
        )
      }

      const DefaultElement = props => {
        return <p {...props.attributes}>{props.children}</p>
      }

    const renderElement = useCallback(props => {
        console.log("element type is: ",props.element.type);
        switch (props.element.type) {
          case 'span':
            return <SpanElem {...props} />
          default:
            return <DefaultElement {...props} />
        }
      }, [])
  
    return (
        <div>
        <div id='btn'>
            <Button variant="contained"
            onMouseDown={event => {
            event.preventDefault()
            Transforms.setNodes(
              editor,
              { type: 'span' },
              { match: n => Editor.isBlock(editor, n) }
            )
            CustomEditor.insertText(editor)
            }}> Add Name </Button>

        </div>
        <div id="edtr">
        <Slate
        editor={editor}
        value={initialValue}
      >
        <Editable renderElement={renderElement} placeholder='type here...' />
      </Slate>
        </div>
        
        </div>
      
    )
  }

  export default Cname;
