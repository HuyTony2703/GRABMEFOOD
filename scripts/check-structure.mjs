// Check local source references and entry-point reachability without extra dependencies.
import { readFileSync, readdirSync } from "node:fs"
import { dirname, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const normalize = path => path.split(sep).join("/")
const walk = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const path = join(directory, entry.name)
  return entry.isDirectory() ? walk(path) : [normalize(relative(root, path))]
})
const files = new Set(walk(join(root, "src")))
const graph = new Map()
const missing = []

for (const file of files) {
  if (!/\.(?:tsx?|css)$/.test(file)) continue
  const text = readFileSync(join(root, file), "utf8")
  const imports = []
  if (file.endsWith(".css")) {
    for (const match of text.matchAll(/(?:@import\s*|url\(\s*)["']([^"']+)["']/g)) imports.push(match[1])
  } else {
    const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true)
    const scan = node => {
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
        imports.push(node.moduleSpecifier.text)
      }
      if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
        imports.push(node.arguments[0].text)
      }
      ts.forEachChild(node, scan)
    }
    scan(ast)
  }
  const dependencies = []
  for (const specifier of imports.filter(value => value.startsWith(".") || value.startsWith("@/"))) {
    const plain = specifier.split(/[?#]/)[0]
    const base = plain.startsWith("@/") ? `src/${plain.slice(2)}` : normalize(join(dirname(file), plain))
    const target = [base, ...[".ts", ".tsx", ".css", "/index.ts", "/index.tsx"].map(extension => base + extension)].find(candidate => files.has(candidate))
    if (target) dependencies.push(target)
    else missing.push(`${file}: ${specifier}`)
  }
  graph.set(file, dependencies)
}

const reached = new Set()
const visit = file => {
  if (reached.has(file)) return
  reached.add(file)
  for (const dependency of graph.get(file) ?? []) visit(dependency)
}
visit("src/main.tsx")
for (const file of files) if (file.endsWith(".d.ts")) visit(file)
const unused = [...files].filter(file => !reached.has(file))
console.log(JSON.stringify({ sourceFiles: files.size, reachableFiles: reached.size, missingImports: missing, unusedFiles: unused }, null, 2))
process.exitCode = missing.length || unused.length ? 1 : 0
