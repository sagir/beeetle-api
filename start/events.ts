import Event from '@ioc:Adonis/Core/Event'
import Database from '@ioc:Adonis/Lucid/Database'

import Logger from '@ioc:Adonis/Core/Logger'
import Application from '@ioc:Adonis/Core/Application'
/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
Event.on('db:query', (query) => {
  if (Application.inProduction) {
    // @ts-ignore
    Logger.debug(query)
  } else {
    Database.prettyPrint(query)
  }
})
