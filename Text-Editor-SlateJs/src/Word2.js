import React, {useCallback, useMemo, useState, useEffect} from 'react';
import { createEditor, Editor, Transforms, Node, Text, useSlate } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import './Word.css';
import ClipboardJS from 'clipboard';


// ######################################################################################
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

  isStrikeThroughMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.strike === true,
      universal: true,
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
  },

  toggleStrikeThroughMark(editor) {
    const isActive = CustomEditor.isStrikeThroughMarkActive(editor)
    Transforms.setNodes(
      editor,
      { strikeThrough: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
    )
  },

}
// #############################################################################################################################################################################

const Edi2 = () => {
  // const editor = useMemo(() => withReact(createEditor()), [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
   
  const getInitialState = () => {
    const value = "11";
    return value;
  };

    const getInitialColorState = () => {
      const cvalue = "black";
      return cvalue;
    }

    const getInitialFFState = () => {
      const fvalue = "Arial";
      return fvalue;
    }
    
    const getInitialLineSpaceState = () => {
      const lvalue = "line-spacing-1.5";
      return lvalue;
    }
  
  const [value, setValue] = useState(getInitialState);
  const [cvalue, setCValue] = useState(getInitialColorState);
  const [fvalue, setFValue] = useState(getInitialFFState);
  const [lvalue, setLValue] = useState(getInitialLineSpaceState);

  const handleChange = (e) => {
    setValue(e.target.value);
    Transforms.setNodes(
          editor,
          { type: e.target.value},
        )
        console.log("value is:", value);
  };

  const handleColorChange = (e) => {
    setCValue(e.target.value);
    Transforms.setNodes(
          editor,
          { type: e.target.value},
        )
        console.log("color is:", cvalue);
  };

  const handleFFChange = (e) => {
    setFValue(e.target.value);
    Transforms.setNodes(
          editor,
          { type: e.target.value},
        )
        console.log("font is:", fvalue);
  };

  const handleLineSpaceChange = (e) => {
    setLValue(e.target.value);
    Transforms.setNodes(
          editor,
          { type: e.target.value},
        )
        console.log("line space is:", lvalue);
  };

  // Update the initial content to be pulled from Local Storage if it exists.
      const initialValue = useMemo(
        () =>
          JSON.parse(localStorage.getItem('content')) || [
            {
              type: 'paragraph',
              children: [{ text: 'A line of text in a paragraph.' }],
            },
            {
              type: 'paragraph',
              children: [{ text: 'A second line of text in a paragraph.' }],
            },
          ],
        []
      )

  const renderElement = useCallback(props => {
    switch (props.element.type) {
      // color
      case 'red':
        return <p {...props.attributes} style={{color: "red"}}>{props.children}</p>
      case 'greenyellow':
        return <p {...props.attributes} style={{color: "greenyellow"}}>{props.children}</p>
      case 'green':
        return <p {...props.attributes} style={{color: "green"}}>{props.children}</p>
      case 'blue':
        return <p {...props.attributes} style={{color: "blue"}}>{props.children}</p>
      case 'black':
      return <p {...props.attributes} style={{color: "black"}}>{props.children}</p>
      case 'orange':
      return <p {...props.attributes} style={{color: "orange"}}>{props.children}</p>
      case 'yellow':
      return <p {...props.attributes} style={{color: "yellow"}}>{props.children}</p>
      case 'purple':
      return <p {...props.attributes} style={{color: "purple"}}>{props.children}</p>
      case 'grey':
      return <p {...props.attributes} style={{color: "grey"}}>{props.children}</p>
      case 'pink':
      return <p {...props.attributes} style={{color: "pink"}}>{props.children}</p>
// code
      case 'code':
        return <CodeElement {...props} />
      case 'div':
        return <DivElement {...props} />
          case 'block-quote':
          return <blockquote {...props.attributes} id="bq" >{props.children}</blockquote>
          // font family
          case 'JetBrains Mono':
          return <span {...props.attributes} style={{ fontFamily: "JetBrains Mono"}}>{props.children}</span>
          case 'arial':
          return <span {...props.attributes} style={{ fontFamily: "arial"}}>{props.children}</span>
          case "verdana":
          return <span {...props.attributes} style={{ fontFamily: "verdana"}}>{props.children}</span>
          case 'times new roman':
          return <span {...props.attributes} style={{ fontFamily: "times new roman"}}>{props.children}</span>
          case 'comic sans ms':
          return <span {...props.attributes} style={{ fontFamily: "comic sans ms"}}>{props.children}</span>
          case 'courier new':
          return <span {...props.attributes} style={{ fontFamily: "courier new"}}>{props.children}</span>
          case 'cursive':
          return <span {...props.attributes} style={{ fontFamily: "cursive"}}>{props.children}</span>
          case 'garamond':
          return <span {...props.attributes} style={{ fontFamily: "garamond"}}>{props.children}</span>
          case 'monospace':
          return <span {...props.attributes} style={{ fontFamily: "monospace"}}>{props.children}</span>
          case 'sans-serif':
          return <span {...props.attributes} style={{ fontFamily: "sans-serif"}}>{props.children}</span>
          case 'bookman':
          return <span {...props.attributes} style={{ fontFamily: "bookman"}}>{props.children}</span>
          case 'helvetica':
          return <span {...props.attributes} style={{ fontFamily: "helvetica"}}>{props.children}</span>
          case 'tahoma':
          return <span {...props.attributes} style={{ fontFamily: "tahoma"}}>{props.children}</span>
          case 'georgia':
          return <span {...props.attributes} style={{ fontFamily: "georgia"}}>{props.children}</span>
          case 'trebuchet ms':
          return <span {...props.attributes} style={{ fontFamily: "trebuchet ms"}}>{props.children}</span>
          case 'palatino linotype':
          return <span {...props.attributes} style={{ fontFamily: "palatino linotype"}}>{props.children}</span>
          case 'Bradley Hand ITC':
          return <span {...props.attributes} style={{ fontFamily: "Bradley Hand ITC"}}>{props.children}</span>

        // font size
            case '11':
              return <span {...props.attributes} style={{ fontSize: 11}}>{props.children}</span>
            case '16':
              return <span {...props.attributes} style={{ fontSize: 16}}>{props.children}</span>
            case '18':
              return <span {...props.attributes} style={{ fontSize: 18}}>{props.children}</span>
            case '20':
              return <span {...props.attributes} style={{ fontSize: 20}}>{props.children}</span>
            case '22':
              return <span {...props.attributes} style={{ fontSize: 22}}>{props.children}</span>
            case '24':
              return <span {...props.attributes} style={{ fontSize: 24}}>{props.children}</span>
            case '28':
              return <span {...props.attributes} style={{ fontSize: 28}}>{props.children}</span>
            case '30':
              return <span {...props.attributes} style={{ fontSize: 30}}>{props.children}</span>
            case '32':
              return <span {...props.attributes} style={{ fontSize: 32}}>{props.children}</span>
            case 'header-one':
              return <h1 {...props.attributes}>{props.children}</h1>
            case 'header-two':
              return <h2 {...props.attributes}>{props.children}</h2>
            case 'header-three':
              return <h3 {...props.attributes}>{props.children}</h3>
            case 'header-four':
              return <h4 {...props.attributes}>{props.children}</h4>
            case 'header-five':
              return <h5 {...props.attributes}>{props.children}</h5>
            case 'header-six':
              return <h6 {...props.attributes}>{props.children}</h6>
            case 'unordered-list-item':
              return (
                  <div>
                    <ul>
                    <li {...props.attributes}>{props.children}</li>
                    </ul>
                  </div>
              );
            case 'left':
            return <span {...props.attributes} style={{ textAlign: "left"}}>{props.children}</span>
            case 'center':
            return <div {...props.attributes} style={{ textAlign: "center"}}>{props.children}</div>
            case 'right':
            return <div {...props.attributes} style={{ textAlign: "right"}}>{props.children}</div>
            case 'justify':
            return <div {...props.attributes} style={{ textAlign: "justify"}}>{props.children}</div>
            case 'ordered-list-item':
            const list = [props.children.Text]; 
            const updatedList = list.map((listItems)=>{
            return <li>{listItems}</li>;
            });
            return <ol>{updatedList}</ol>
            case 'decrease-indent':
            return <div {...props.attributes} style={{ textIndent: "0em"}}>{props.children}</div>
            case 'increase-indent':
            return <div {...props.attributes} style={{ textIndent: "2em"}}>{props.children}</div>
            case 'line-spacing-1.15':
            return <div {...props.attributes} style={{ lineHeight: "1.15em"}}>{props.children}</div>
            case 'line-spacing-1.5':
            return <div {...props.attributes} style={{ lineHeight: "1.5em"}}>{props.children}</div>
            case 'line-spacing-1.75':
            return <div {...props.attributes} style={{ lineHeight: "1.75em"}}>{props.children}</div>
            case 'line-spacing-2.0':
            return <div {...props.attributes} style={{ lineHeight: "2.0em"}}>{props.children}</div>
            case 'page-break':
            return <div {...props.attributes} style={{ backgroundColor:"#d3d3d3", pageBreakAfter: "always", pageBreakBefore: "always"}}>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
            </div>

            
        default:
        return <DefaultElement {...props} />
    }
  }, [])

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, [])
  
let clipboard = new ClipboardJS('#btnCopy');
let clipboardCut = new ClipboardJS('#btnCut');
let clipboardPaste = new ClipboardJS('#btnPaste');

// #######################################################################################################################################################################
  return (
    // Add a toolbar with buttons that call the same methods.
      <div id='full-con'>
      <div className='btn-con'>
      <div id='undo-redo'>
      <button id='btnUndo'
      onClick={()=>editor.undo()}>↶</button>
      <button id='btnRedo'
      onClick={()=>editor.redo()}>↷</button>
      </div>
{/* clipboard */}
      <button id="btnCopy"
      data-clipboard-action="copy"
      data-clipboard-target="#editor">📋</button>
      <button id='btnCut'
      data-clipboard-action="cut"
      data-clipboard-target="#editor">✂</button>

      <button id="btnPaste"
      data-clipboard-action="paste"
      data-clipboard-target="#editor">📑</button>

        <button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleBoldMark(editor)
          }}
        >
          <strong>𝐁</strong>
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleItalicMark(editor)
          }}
        >
          <i><strong>𝐼</strong></i>
        </button>

          <button
            onMouseDown={event => {
              event.preventDefault()
              CustomEditor.toggleUnderlineMark(editor)
            }}
          >
            <strong><u>U</u></strong>
          </button>

          {/* strike out */}
          <button onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleStrikeThroughMark(editor)
          }}><strong>ᵺ</strong></button>

        <button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleCodeBlock(editor)
          }}
        >
          <b>❮❯</b>
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleBlock(editor, 'block-quote')
          }}
        >
          <b>❛❛</b>
        </button>

        <button
        onMouseDown={event=>{
          event.preventDefault()
          Transforms.setNodes(
              editor,
              { type: 'div' },
              { match: n => Editor.isBlock(editor, n) }
            )
        }}><strong>Div</strong></button>

<button
          onMouseDown={event => {
            event.preventDefault()
            CustomEditor.toggleBlock(editor, 'default')
          }}
        ><strong>P</strong>
        </button>

        <select value={fvalue} onChange={handleFFChange}>
          <option value="arial">Arial</option>
          <option value="courier">courier</option>
          <option value="trebuchet ms">trebuchet ms</option>
          <option value="palatino linotype">palatino linotype</option>
          <option value="Bradley Hand ITC">Bradley Hand ITC</option>
          <option value="times new roman">Times New Roman</option>
          <option value="verdana">verdana</option>
          <option value="comic sans ms">comic sans ms</option>
          <option value="impact">impact</option>
          <option value="cursive">cursive</option>
          <option value="fantasy">fantasy</option>
          <option value="monospace">monospace</option>
          <option value="sans-serif">sans-serif</option>
          <option value="tahoma">tahoma</option>
          <option value="helvetica">helvetica</option>
          <option value="garamond">garamond</option>
        </select>

      <select value={value} onChange={handleChange}>
      <option value="11">11</option>
        <option selected value="16">16</option>
        <option value="18">18</option>
        <option value="20">20</option>
        <option value="24">24</option>
        <option value="28">28</option>
        <option value="30">30</option>
        <option value="32">32</option>  
      </select> 

      {/* color the selected text */}

      <select value={cvalue} onChange={handleColorChange}>
        <option value="red">red</option>
        <option value="blue">blue</option>
        <option value="green">green</option>
        <option value="yellow">yellow</option>
        <option value="black">black</option>
        <option value="white">white</option>
        <option value="grey">grey</option>
        <option value="orange">orange</option>
        <option value="purple">purple</option>
        <option value="pink">pink</option>
      </select>

      {/* list */}
      <button onMouseDown={event=>{
        event.preventDefault()
        CustomEditor.toggleBlock(editor, 'unordered-list-item')
      }}> <b>●</b> </button>

      {/* ordered-list */}
      <button onMouseDown={event=>{
        event.preventDefault()
        CustomEditor.toggleBlock(editor, 'ordered-list-item')
      }}> <b>1.</b> </button>

      {/* heading */}
      <button
        onMouseDown={event=>{
          event.preventDefault()
          Transforms.setNodes(
              editor,
              { type: 'header-one' },
              { match: n => Editor.isBlock(editor, n) }
            )
        }}><strong>H1</strong></button>
        <button
        onMouseDown={event=>{
          event.preventDefault()
          Transforms.setNodes(
              editor,
              { type: 'header-two' },
              { match: n => Editor.isBlock(editor, n) }
            )
        }}><strong>H2</strong></button>
        <button
        onMouseDown={event=>{
          event.preventDefault()
          Transforms.setNodes(
              editor,
              { type: 'header-three' },
              { match: n => Editor.isBlock(editor, n) }
            )
        }}><strong>H3</strong></button>
        <button
        onMouseDown={event=>{
          event.preventDefault()
          Transforms.setNodes(
              editor,
              { type: 'header-four' },
              { match: n => Editor.isBlock(editor, n) }
            )
        }}><strong>H4</strong></button>
        <button
        onMouseDown={event=>{
          event.preventDefault()
          Transforms.setNodes(
              editor,
              { type: 'header-five' },
              { match: n => Editor.isBlock(editor, n) }
            )
        }}><strong>H5</strong></button>
        <button
        onMouseDown={event=>{
          event.preventDefault()
          Transforms.setNodes(
              editor,
              { type: 'header-six' },
              { match: n => Editor.isBlock(editor, n) }
            )
        }}><strong>H6</strong>
        </button>

        {/* left align */}
        <button onMouseDown={event=>{
          event.preventDefault()
          CustomEditor.toggleBlock(editor, 'left')
        }}><strong>⬱</strong></button>

        {/* center align */}
        <button onMouseDown={event=>{
          event.preventDefault()
          CustomEditor.toggleBlock(editor, 'center')
        }}><strong>Ξ</strong></button>

        {/* right align */}
        <button onMouseDown={event=>{
          event.preventDefault()
          CustomEditor.toggleBlock(editor, 'right')
        }}><strong>⇶</strong></button>

        {/* justify align */}
        <button onMouseDown={event=>{
          event.preventDefault()
          CustomEditor.toggleBlock(editor, 'justify')
        }}><strong>☰</strong></button>

        {/* indent */}
        <button onMouseDown={event=>{
          event.preventDefault()
          CustomEditor.toggleBlock(editor, 'decrease-indent')
        }}><strong>↖</strong></button>

        {/* outdent */}
        <button onMouseDown={event=>{
          event.preventDefault()
          CustomEditor.toggleBlock(editor, 'increase-indent')
        }}><strong>↗</strong></button>

        {/* line spacing */}
        <select value={lvalue} onChange={handleLineSpaceChange}>
          <option value="line-spacing-1">1</option>
          <option value="line-spacing-1.15">1.15</option>
          <option value="line-spacing-1.5">1.5</option>
          <option value="line-spacing-1.75">1.75</option>
          <option value="line-spacing-2">2</option>
          </select>
      </div>

      <div id='ediText'>
      <Slate editor={editor} value={initialValue} onChange={value => {
        const isAstChange = editor.operations.some(
          op => 'set_selection' !== op.type
        )
        if (isAstChange) {
          // Save the value to Local Storage.
          const content = JSON.stringify(value)
          localStorage.setItem('content', content)
        }
      }}>
      
      <Editable id='editor2'
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
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
            case ';': {
              event.preventDefault()
              CustomEditor.toggleBlock(editor, 'page-break')
              break
            }
            default:
              return
          }
        }}
      />
      </Slate>
      </div>     
      </div>
    
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
        <div {...props.attributes}>
      {props.children}
    </div>
    )
    }


const DefaultElement = props => {
    return <p {...props.attributes}>{props.children}</p>

}


const Leaf = ({ attributes, children, leaf }) => {
  console.log(children);
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }
  if(leaf.italic){
    children = <em>{children}</em>
  }
  if(leaf.underline){
    children = <u>{children}</u>
  }
  if(leaf.strikeThrough){
    children = <del>{children}</del>
  }
  return (
    <span {...attributes}>{children}</span>
  )
}


export default Edi2;