import ts from "typescript"
import { resolve } from "node:path"
const config = ts.readConfigFile("tsconfig.json", ts.sys.readFile)
const parsed = ts.parseJsonConfigFileContent(
  config.config,
  ts.sys,
  process.cwd(),
)
// Keep the project's own options, but distinguish app diagnostics from the baseline Vite wrapper error.
const root = resolve("src")
const files = parsed.fileNames.filter((file) => resolve(file).startsWith(root))
const program = ts.createProgram(files, { ...parsed.options, noEmit: true })
const diagnostics = ts.getPreEmitDiagnostics(program)
if (diagnostics.length)
  console.error(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCurrentDirectory: () => process.cwd(),
      getNewLine: () => "\n",
      getCanonicalFileName: (file) => file,
    }),
  )
console.log(
  `Application-only TypeScript: ${diagnostics.length} diagnostics in ${files.length} source files. Tooling configs checked separately.`,
)
process.exitCode = diagnostics.length ? 1 : 0
