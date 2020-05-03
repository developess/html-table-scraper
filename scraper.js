function trimWhitespace(string) {
  return string.trim().replace(/\s+/, ' ');
}

class Table {
  constructor() {
    this.cols = 0;
    this.headers = [];
    this.data = [];
  }

  get toCsvString() {
    let headers = '';
    if (this.headers.length > 0) {
      headers = this.headers.join(',') + '\r\n';
    }
    const rows = this.data.map(row => row.join(',')).join('\r\n');
    return headers + rows;
  }

  appendHeaders(list) {
    if (list.length > this.cols) {
      this.cols = list.length;
    }
    const row = [];
    const listLen = list.length;
    for (let i = 0; i < listLen; i++) {
      row[i] = '"' + trimWhitespace(list[i].textContent) + '"';
    }
    this.headers = row;
  }

  appendData(list) {
    if (list.length > this.cols) {
      this.cols = list.length;
    }
    const row = [];
    const listLen = list.length;
    for (let i = 0; i < listLen; i++) {
      row[i] = '"' + trimWhitespace(list[i].textContent) + '"';
    }
    this.data.push(row);
  }

  parseRows(rows) {
    const rowCount = rows.length;
    for (let i = 0; i < rowCount; i++) {
      const headers = rows[i].querySelectorAll('th');
      const data = rows[i].querySelectorAll('td');
      if (headers.length > 0) {
        this.appendHeaders(headers);
      }
      if (data.length > 0) {
        this.appendData(data);
      }
    }
  }
}

function createLink(url) {
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'table.csv');
  link.textContent = 'Download as csv';
  link.target = '_blank';
  link.style.display = 'inline-block';
  link.style.marginBottom = '10px';
  link.style.color = 'white';
  link.style.backgroundColor = '#117D2E'; // green
  link.style.fontStyle = 'bold';
  link.style.borderRadius = '5px';
  link.style.padding = '10px 20px';
  return link;
}

function findTables() {
  // Get all tables in the dom
  let tables = document.querySelectorAll('table');
  let tableCount = tables.length;
  for (let i = 0; i < tableCount; i++) {
    // Parse table rows
    console.log('Parsing table ', i);
    tables[i].style.backgroundColor = '#FDFD96'; // light yellow
    const rows = tables[i].querySelectorAll('tr');
    const table = new Table();
    table.parseRows(rows);
    // Creates csv blob
    console.log('Creating csv...');
    const csv = table.toCsvString;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    // Creates clickable download button and inserts it above the table
    // in the document.
    const url = URL.createObjectURL(blob);
    const link = createLink(url);
    const parent = tables[i].parentNode;
    parent.insertBefore(link, tables[i]);
  }
}

findTables();
