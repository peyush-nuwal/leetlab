export function normalizeCode(code, language) {
  switch (language.toUpperCase()) {
    case "JAVASCRIPT":
      return `
// Node.js stdin-safe version
process.stdin.resume();
process.stdin.setEncoding('utf8');

let input = '';
process.stdin.on('data', function(chunk) {
    input += chunk;
});

process.stdin.on('end', function() {
    const [a, b] = input.trim().split(' ').map(Number);
    console.log(${extractMainExpression(code, "a", "b")});
});`;

    case "PYTHON":
      return code.includes("input") || code.includes("sys.stdin")
        ? code
        : `import sys
input_line = sys.stdin.read()
a, b = map(int, input_line.split())
print(${extractMainExpression(code, "a", "b")})`;

    default:
      return code;
  }
}

// Helper to extract the main expression from the function
function extractMainExpression(code, a = "a", b = "b") {
  const match = code.match(/return\s+(.+?);?/);
  return match ? match[1].replace(/[\n;]/g, "") : `${a} + ${b}`;
}
