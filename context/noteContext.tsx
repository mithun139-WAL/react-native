// context/noteContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface Note {
  id: string;
  content: string;
  date: Date;
}

interface NoteContextType {
  notes: Note[];
  addNote: (content: string, date: Date) => void;
  editNote: (id: string, newContent: string, newDate?: Date) => void;
  deleteNote: (id: string) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  const addNote = (content: string, date: Date) => {
    const newNote = { id: Date.now().toString(), content, date };
    setNotes(prevNotes => [...prevNotes, newNote]);
  };

  const editNote = (id: string, newContent: string, newDate?: Date) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id ? { ...note, content: newContent, date: newDate || note.date } : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, editNote, deleteNote }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => {
  const context = React.useContext(NoteContext);
  if (!context) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
};
