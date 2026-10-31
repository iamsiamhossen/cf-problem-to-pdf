export interface Sample {
  input: string;
  output: string;
}

export interface Problem {
  url: string;
  title: string;
  timeLimit: string;
  memoryLimit: string;
  inputFile: string;
  outputFile: string;
  legendHtml: string;
  inputSpecHtml: string;
  outputSpecHtml: string;
  samples: Sample[];
  noteHtml: string;
}