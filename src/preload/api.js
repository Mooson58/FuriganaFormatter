import { ipcRenderer } from 'electron';
import * as kuroshiroAll from 'kuroshiro';

export default {
  toHiragana: async (text) => {
    return await ipcRenderer.invoke('kuroshiro:convert', text, 'hiragana');
  },
  toRomaji: async (text) => {
    return await ipcRenderer.invoke('kuroshiro:convert', text, 'romaji');
  },
  toImage: async (base64) => {
    return await ipcRenderer.invoke('download-image', base64)
  }
}