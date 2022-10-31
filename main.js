const { app, BrowserWindow, Tray } = require('electron')
const path = require('path')

function createWindow () {
    app.server = require(__dirname+'/src/index.js', (error)=>{

      const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js')
        }
      });
      win.webContents.session.clearStorageData();
      win.webContents.session.clearCache(() =>{
        console.log("clear cache");
      })
    
    
      if(error){

      }else{
        win.loadURL('http://localhost:3002');
        win.focus();
        win.center();

        win.on('closed', (event)=>{
          win == null;
        })

        win.on('minimize', (event) =>{
          event.preventDefault();
          win.hide();
        });

        win.on('close', (event) =>{
          if(!app.isQuiting){
            event.preventDefault()
            win.hide()
          }
          return false;
        })

        const tray = new Tray('icon')
        tray.on('click', ()=>{
          if(win.isVisible()){
            win.hide();
          }else{
            win.show();
          }
        })
        tray.setTitle('Server Self Service');
      }
    });  
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
