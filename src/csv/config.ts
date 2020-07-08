/* eslint-disable radix */
import csvParse from 'csv-parse';
import fs from 'fs';

interface Upload {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

export default async function loadCSV(filePath: string): Promise<Upload[]> {
  const readCsvStream = fs.createReadStream(filePath);

  const parseStream = csvParse({
    from_line: 2,
    ltrim: true,
    rtrim: true,
  });

  const parseCsv = readCsvStream.pipe(parseStream);

  const lines: Upload[] = [];

  parseCsv.on('data', line => {
    const [title, type, value, category] = line;

    const transaction: Upload = {
      title,
      type,
      value: parseInt(value),
      category,
    };
    lines.push(transaction);
  });

  await new Promise(resolve => {
    parseCsv.on('end', resolve);
  });

  return lines;
}
