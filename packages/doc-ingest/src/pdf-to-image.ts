import { execFile } from 'node:child_process'
import { promises as fs } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

/**
 * Convert first page of a PDF buffer to PNG using pdftoppm (Poppler).
 * This avoids Node native canvas modules and works well in server environments
 * where Poppler is installed.
 */
export async function convertFirstPagePdfToPng(pdfBuffer: Buffer): Promise<Buffer> {
  const workDir = await fs.mkdtemp(join(tmpdir(), 'doc-ingest-'))
  const inputPath = join(workDir, 'input.pdf')
  const outputBase = join(workDir, 'page')
  const outputPng = `${outputBase}.png`

  try {
    await fs.writeFile(inputPath, pdfBuffer)

    await execFileAsync('pdftoppm', ['-f', '1', '-singlefile', '-png', inputPath, outputBase])

    return await fs.readFile(outputPng)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)

    if (message.includes('ENOENT')) {
      throw new Error(
        'Scanned PDF conversion requires pdftoppm (Poppler). Install Poppler on the server or upload PNG/JPG.'
      )
    }

    throw new Error(`Failed to convert scanned PDF to image: ${message}`)
  } finally {
    await fs.rm(workDir, { recursive: true, force: true })
  }
}
