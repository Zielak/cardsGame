export class Logger {
  protected indentLevel = 0

  getIndent(): string {
    return Array(this.indentLevel).fill("│ ").join("")
  }

  indentUp(): void {
    this.indentLevel++
  }

  indentDown(): void {
    this.indentLevel = Math.max(this.indentLevel - 1, 0)
  }
}
