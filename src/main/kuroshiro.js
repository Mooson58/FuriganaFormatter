import { ipcMain, app } from 'electron';
import KuroshiroAll from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji'
import path from 'path'

let kuroshiro = null;

const Kuroshiro = KuroshiroAll.default

// 初始化 Kuroshiro（只初始化一次）
async function initKuroshiro() {
  if (!kuroshiro) {
    kuroshiro = new Kuroshiro();
    await kuroshiro.init(new KuromojiAnalyzer({
      dictPath: path.join(app.getAppPath(), 'public', 'dict')
    }));
  }
}

// 监听渲染进程的调用
ipcMain.handle('kuroshiro:convert', async (_event, text, to = 'hiragana') => {
  try {
    await initKuroshiro();
    const result = await kuroshiro.convert(text, { to, mode: 'furigana' });
    return result;
  } catch (error) {
    return `Error: ${error.message}`;
  }
});

// 如果你需要其他接口可以继续写 ipcMain.handle(...)
