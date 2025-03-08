/* @refresh reload */
import { render } from 'solid-js/web';
import './scss/index.scss'

import App from './app/App';

import { ColorModeProvider, ColorModeScript, createLocalStorageManager } from "@kobalte/core"

function AppWrapper() {
   const storageManager = createLocalStorageManager("vite-ui-theme")

   return (<>
      <ColorModeScript storageType={storageManager.type}/>
      <ColorModeProvider storageManager={storageManager}>
         <App/>
      </ColorModeProvider>
   </>);
}

render(() => <AppWrapper/>, document.getElementById('root') as HTMLElement);
