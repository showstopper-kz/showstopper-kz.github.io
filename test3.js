// Create reference instance

const { marked } = require("marked");

// Override function
const tokenizer = {
  codespan(src) {
    const match = src.match(/\$+([^\$\n]+?)\$+/);
	console.log(match)
    if (match) {
      return {
        type: 'codespan',
        raw: match[0],
        text: match[1].trim()
      };
    }

    // return false to use original codespan tokenizer
    return false;
  }
};

marked.use({ tokenizer });

// Run marked
console.log(marked.parse('ss\n$ latex code $\n\n` other code `'))