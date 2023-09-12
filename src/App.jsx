import './App.css'

import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import {data} from "/public/data.js"
import Split from "react-split"
import {nanoid} from "nanoid"

export default function App() {
    const [notes, setNotes] = React.useState(
        () => JSON.parse(localStorage.getItem("notes")) || []
    )
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )
    
    React.useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes))
    }, [notes])
    
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Neuer Titel"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    function updateNote(text) {
        // Put the most recently-modified note at the top
        setNotes(oldNotes => {
            const newArray = []
            for(let i = 0; i < oldNotes.length; i++) {
                const oldNote = oldNotes[i]
                if(oldNote.id === currentNoteId) {
                    newArray.unshift({ ...oldNote, body: text })
                } else {
                    newArray.push(oldNote)
                }
            }
            return newArray
        })
    }
    
    /**
     *  DeleteNote function
     * 
     * -  JS Method can be used to return a new
     *    array that has filtered out an item based 
     *    on a condition? -> splice() can remove an item at a given index 
     * - Notice the parameters being based to the function
     *    and think about how both of those parameters
     *    can be passed in during the onClick event handler
     */
    
    function deleteNote(event, noteId) {
        event.stopPropagation()
       
        
        /*2.Version: direkt über setNotes*/
        for (let i=0; i < notes.length; i++){

            if (notes[i].id === noteId) {
                let tempNote = notes[i]
                let index = notes.indexOf(tempNote)

                setNotes(prevNotes => {
                    prevNotes.splice(index,1)
                    return prevNotes
                })
            }
        }
            
        /** 1.Option: indirekt über ein neues Array; besser lesbar */
        /*
        for (let i=0; i < notes.length; i++){
            const newNotes= [...notes]

            if (notes[i].id === noteId){
                let tempNote = notes[i]
                let index = notes.indexOf(tempNote)
                newNotes.splice(index,1)
                setNotes(newNotes)
            }
        }
             */
    }
    
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                    event={event}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>Du hast noch keine Notizen</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Erstelle eine neue Notiz
                </button>
            </div>
            
        }
        </main>
    )
}

