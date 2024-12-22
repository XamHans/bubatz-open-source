export interface Sale {}

export class ValidationError extends Error {
  code: string

  constructor({ code, message }: { code: string; message: string }) {
    super(message)
    this.code = code
    this.name = 'ValidationError'
  }
}
