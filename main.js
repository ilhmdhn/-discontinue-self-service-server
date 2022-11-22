const { app, BrowserWindow, Tray } = require('electron');
const fs = require('fs');
const setup = JSON.parse(fs.readFileSync('setup.json'));
const logger = require('./src/util/logger');

const port = setup.server_port;
function createWindow () {
    app.server = require(__dirname+'/src/index.js', (error)=>{
      if(err){
        logger.error(`Fail to open /src/index.js`);
      }
    });  
    const win = new BrowserWindow({
      width: 800,
      height: 600
    });

    win.webContents.session.clearStorageData();
    win.webContents.session.clearCache(() =>{
      console.log("clear cache");
    })
  
      win.loadURL(`http://localhost:${port}`);
      win.focus();
      win.center();

      win.on('closed', (event)=>{
        win == null;
        app.quit();
      })

      win.on('minimize', (event) =>{
        event.preventDefault();
        win.hide();
      });

      win.on('close', (event) =>{
          win == null;
          app.quit();
      })

    const tray = new Tray('icon.png');
      tray.on('click', ()=>{
        if(win.isVisible()){
          win.hide();
        }else{
          win.show();
        }
      })
    tray.setTitle('Self Service');
  }


app.whenReady().then(() => {
  createWindow();
});