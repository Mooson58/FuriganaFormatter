// src/store/usePageStore.js
import { create } from 'zustand';

const useAppStore = create((set) => ({
  index: 0,
  content: '',
  background: 'white',
  fontSize: 16,
  color: '#000',
  letterSpacing: 2,
  setPage: (page) => set({ index: page }),
  setContent: (content) => set({ content }),
  setBackground: background => set({background}),
  setFontSize: fontSize => set({fontSize}),
  setColor: color => set({color}),
  setLetterSpacing: letterSpacing => set({letterSpacing})
}));

export default useAppStore;
