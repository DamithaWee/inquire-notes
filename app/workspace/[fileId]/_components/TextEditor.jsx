import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { EditorContent, useEditor, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useAction, useMutation, useQueries, useQuery } from 'convex/react';
import { Heading1Icon, Heading2Icon, Heading3Icon, BoldIcon, ItalicIcon, AlignLeftIcon, AlignCenterIcon, AlignRightIcon, ListIcon, CodeIcon, Strikethrough, Sparkles, SaveIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { api } from '@/convex/_generated/api'
import { chatSession } from '@/configs/AIModel';
import { toast } from "sonner"
import { useUser } from '@clerk/nextjs';

const MenuBar = ({ editor }) => {
  const {fileId} = useParams();
  const SearchAi = useAction(api.myActions.search);
  const saveNotes = useMutation(api.notes.AddNotes)
  const {user} = useUser();

  const onAiClick = async () => {
    toast('Generating Answer')
    // Check if any text is selected
    if (editor.state.selection.empty) {
      alert("No text selected. Please select some text to generate an answer.");
      return;
    }

    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ''
    );

    const result = await SearchAi({
      query: selectedText,
      fileId: fileId,
    });

    const unformattedResult = JSON.parse(result);

    let answer = '';
    unformattedResult &&
      unformattedResult.forEach(item => {
        answer += item.pageContent;
      });

    console.log(answer);

    // Clean the answer to remove any extra whitespace or empty lines
    const cleanAnswer = answer.trim().replace(/\n\s*\n/g, ' ');

    // Improved prompt with instructions to remove empty lines and avoid extra headings
    // const PROMPT = `Generate an HTML-formatted answer using the following content: "${cleanAnswer}". Do not include the original question text ("${selectedText}"), any additional headings, or any empty lines in your output.`;
    const PROMPT = `Context information is below.
        ---------------------
        ${answer}
        ---------------------
        Given the context information above, answer the question. Generate the answer in HTML format.Do not include the original question in the answer. Do not include any additional headings. Do not include any intros and outros. 
        Question: ${selectedText}`;

    const aiModelResult = await chatSession.sendMessage(PROMPT);
    const aiResponse = aiModelResult.response
      .text()
      .replace('```', '')
      .replace('html', '')
      .replace('```', '')
      .trim();

    // Get the end position of the current selection
    const { to } = editor.state.selection;
    editor.commands.setTextSelection(to);

    // Insert the new content right after the selected text
    editor.commands.insertContent(`<p><strong>Answer: </strong>${aiResponse}</p>`);

    saveNotes({
      notes: editor.getHTML(),
      fileId: fileId,
      createdBy: user?.primaryEmailAddress?.emailAddress
    })
  };


  if (!editor) return null;

  return (
    <div className="control-group p-5">
      <div className="button-group flex flex-wrap justify-center gap-2 sm:gap-3">
        <button 
          className={`flex flex-col items-center ${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`} 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1Icon />
        </button>
        <button 
          className={`flex flex-col items-center ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`} 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2Icon />
        </button>
        <button 
          className={`flex flex-col items-center ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`} 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3Icon />
        </button>
        <button 
          className={`flex flex-col items-center ${editor.isActive('bold') ? 'is-active' : ''}`} 
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <BoldIcon />
        </button>
        <button 
          className={`flex flex-col items-center ${editor.isActive('italic') ? 'is-active' : ''}`} 
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <ItalicIcon />
        </button>
        <button 
          className={`flex flex-col items-center ${editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}`} 
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeftIcon />
        </button>
        <button 
          className={`flex flex-col items-center ${editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}`} 
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenterIcon />
        </button>
        <button 
          className={`flex flex-col items-center ${editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}`} 
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          <AlignRightIcon />
        </button>
        <button 
          className={`flex flex-col items-center ${editor.isActive('bulletList') ? 'is-active' : ''}`} 
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <ListIcon />
        </button>
        <button
          className={`flex flex-col items-center ${editor.isActive('code') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <CodeIcon />
        </button>

        <button
        className={'hover:text-blue-500'}
        onClick={() => onAiClick()}
        >
          <Sparkles />
        </button>

        <button
        className=''
        onClick={() =>{
          saveNotes({
            notes: editor.getHTML(),
            fileId: fileId,
            createdBy: user?.primaryEmailAddress?.emailAddress
          })
        }}
        >
            <SaveIcon />
        </button>
      </div>
    </div>
  );
};

const Editor = ({fileId}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
      // Placeholder.configure({ placeholder: 'Write something...' }),
    ],
    editorProps: {
      attributes: { class: 'focus:outline-none h-screen p-5' },
    },
  });

  const notes = useQuery(api.notes.GetNotes, {
    fileId: fileId
  })

  useEffect(()=> {
    editor&&editor.commands.setContent(notes)
  }, [editor&&notes])


  return (
    <>
      {editor && (
        <BubbleMenu className="bubble-menu" tippyOptions={{ duration: 100 }} editor={editor}>
          <div className='flex gap-2 bg-black/5 p-1 rounded-xl shadow-md text-black/60 z-20'>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'is-active' : ''}
            >
              <BoldIcon className='size-4'/>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive('italic') ? 'is-active' : ''}
            >
              <ItalicIcon className='size-4'/>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive('strike') ? 'is-active' : ''}
            >
              <Strikethrough className='size-4'/>
            </button>
          </div>
        </BubbleMenu>
      )}

      {editor && (
        <FloatingMenu className="floating-menu" tippyOptions={{ duration: 100 }} editor={editor}>
          <div className='flex gap-2 bg-black/5 p-1 rounded-xl shadow-md text-black/60 z-20'>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
            >
              <Heading1Icon className='size-5'/>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
            >
              <Heading2Icon className='size-5'/>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList') ? 'is-active' : ''}
            >
              <ListIcon className='size-5'/>
            </button>
          </div>
        </FloatingMenu>
      )}
      
      <div className='z-10 overflow-scroll h-[90vh] border-2 border-zinc-800'>
        <div>{editor ? <MenuBar editor={editor} /> : <p>Loading editor...</p>}</div>
        <div className=' '><EditorContent editor={editor} /></div>
      </div>
    </>
  );
};

export default Editor;
