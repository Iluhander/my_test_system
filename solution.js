function solve(str) {
  let result = '';
  
  const lines = str.split('\n');
  for (let line of lines) {
    result += processLine(line);
  }
  
  result += processList(0);

  return result;
}

module.exports = solve;

let listStarted = false;
function processLine(line) {
  let lineProcessed;
  if (line.startsWith('=')) {
    lineProcessed = processList(0) + processItem(line, 'h', 2);
  } else if (line.startsWith('*')) {
    lineProcessed = processList(1) + processItem(line, 'li', 2);
  } else {
    lineProcessed = processList(0) + processItem(line, 'p');
  }
  
  return lineProcessed;
}

function processList(isInList) {
  if (isInList) {
    if (!listStarted) {
      listStarted = true;
      
      return '<ul>';
    } else {
      return '';
    }
  } else {
    if (listStarted) {
      listStarted = false;
      
      return '</ul>';
    } else {
      return '';
    }
  }
}

function processItem(line, tag, i = 0) {
  let content = '';
  
  let substr;
  while (i < line.length) {
    if (checkLink(line, i)) {
      [i, substr] = processLink(line, i);
    } else {
      [i, substr] = processSymbol(line, i);
    }

    content += substr;
  }

  if (content === '' || content === ' ') {
    return '';
  }

  return `<${tag}>${content}</${tag}>`;
}

function checkLink(line, i, end=false) {
  if (i >= line.length - 1) {
    return end;
  }

  if (end) {
    return (line[i] === ')') && (line[i + 1] === ')');
  }
  
  return (line[i] === '(') && (line[i + 1] === '(');
}

function processLink(line, i) {
  let content = '',
      link = '',
      hadSpace = false,
      symb = '';

  i += 2;
  while (!checkLink(line, i, 1)) {
    if (!hadSpace && line[i] === ' ') {
      ++i;
      hadSpace = true;
      continue;
    }
    
    [i, symb] = processSymbol(line, i);
    if (hadSpace) {
      content += symb;
    } else {
      link += symb;
    }
  }

  return [i + 2, `<a href="${link}">${content}</a>`];
}


function processSymbol(line, i) {
  if (line[i] === ' ') {
    if (i === line.length - 1) {
      return [i + 1, ' '];
    }

    if (line[i + 1] === ' ') {
      return [i + 1, ''];
    }

    return [i + 1, ' '];
  }
  
  if (line[i] === "'") {
    return [i + 1, '"'];
  }

  return [i + 1, line[i]];
}