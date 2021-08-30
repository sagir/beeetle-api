declare module '@ioc:Adonis/Core/Validator' {
  import { AllExistsDbOptions } from 'start/validator/AllExistsDbOptionsInterface'
  import { Rule } from '@ioc:Adonis/Core/Validator'

  export interface Rules {
    allExists(options: AllExistsDbOptions): Rule
  }
}
