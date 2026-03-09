const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const cssMatch = html.match(/<link rel=\"stylesheet\" href=\"\/src\/style\.css\">/);
// Since index.html has already been modified, the CSS is actually inside style.css but it is corrupted.
// Wait, I can't just run the extract script because index.html no longer contains the original <style> block!
// Good thing I can just fetch it from git, OR I can rewrite the style.css.
