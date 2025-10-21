export const chalk = {
  blue: (text: string) => {
    return `\x1b[34m${text}\x1b[0m`
  },
  green: (text: string) => {
    return `\x1b[32m${text}\x1b[0m`
  },
  red: (text: string) => {
    return `\x1b[31m${text}\x1b[0m`
  }
}
