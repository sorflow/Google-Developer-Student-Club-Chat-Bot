import * as pdfjs from 'pdfjs-dist';

// Set up PDF.js worker
if (typeof window !== 'undefined' && 'Worker' in window) {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
}

interface ParsedDegreeWorks {
  gpa: number;
  totalCredits: number;
  completedCourses: string[];
  ongoingCourses: string[];
  major: string;
  studentName: string;
  studentId: string;
}

export const pdfParserService = {
  async uploadAndParsePdf(file: File): Promise<ParsedDegreeWorks> {
    try {
      console.log('Starting PDF parsing...');
      
      // Parse the PDF locally
      const arrayBuffer = await file.arrayBuffer();
      console.log('PDF loaded into buffer');

      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      console.log(`PDF loaded with ${pdf.numPages} pages`);
      
      let fullText = '';
      
      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        console.log(`Processing page ${i}...`);
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => item.str);
        fullText += strings.join(' ') + '\n';
      }

      console.log('Full text extracted, starting parsing...');
      console.log('Sample of extracted text:', fullText.substring(0, 200));

      // Parse the extracted text
      const result = parseDegreeWorksText(fullText);
      console.log('Parsing complete:', result);

      return result;
    } catch (error: any) {
      console.error('Detailed error in PDF processing:', error);
      throw new Error(`Failed to parse DegreeWorks PDF: ${error.message}`);
    }
  }
};

function parseDegreeWorksText(text: string): ParsedDegreeWorks {
  console.log('Starting text parsing...');
  
  const result: ParsedDegreeWorks = {
    gpa: 0,
    totalCredits: 0,
    completedCourses: [],
    ongoingCourses: [],
    major: '',
    studentName: '',
    studentId: ''
  };

  try {
    // Extract student information
    const studentNameMatch = text.match(/Student:\s*([^\n]+)/i);
    if (studentNameMatch) {
      result.studentName = studentNameMatch[1].trim();
    }

    const studentIdMatch = text.match(/ID:\s*([^\n]+)/i);
    if (studentIdMatch) {
      result.studentId = studentIdMatch[1].trim();
    }

    const majorMatch = text.match(/Major:\s*([^\n]+)/i);
    if (majorMatch) {
      result.major = majorMatch[1].trim();
    }

    // Extract GPA - try multiple possible formats
    const gpaPatterns = [
      /Overall GPA[\s:]+([0-9.]+)/i,
      /Cumulative GPA[\s:]+([0-9.]+)/i,
      /GPA[\s:]+([0-9.]+)/i,
      /Grade Point Average[\s:]+([0-9.]+)/i
    ];

    for (const pattern of gpaPatterns) {
      const match = text.match(pattern);
      if (match) {
        result.gpa = parseFloat(match[1]);
        console.log('Found GPA:', result.gpa);
        break;
      }
    }

    // Extract total credits - try multiple possible formats
    const creditPatterns = [
      /Total Credits[\s:]+([0-9.]+)/i,
      /Credits Earned[\s:]+([0-9.]+)/i,
      /Total Hours[\s:]+([0-9.]+)/i,
      /Earned Hours[\s:]+([0-9.]+)/i,
      /Total Credit Hours[\s:]+([0-9.]+)/i
    ];

    for (const pattern of creditPatterns) {
      const match = text.match(pattern);
      if (match) {
        result.totalCredits = parseInt(match[1]);
        console.log('Found Credits:', result.totalCredits);
        break;
      }
    }

    // Extract completed courses with grades
    // Look for course codes followed by a grade
    const completedCoursesRegex = /([A-Z]{2,4}\s*\d{3,4})[\s\S]{0,50}?(?:A|B|C|D|F)[\+\-]?/g;
    const completedMatches = Array.from(text.matchAll(completedCoursesRegex));
    result.completedCourses = completedMatches.map(match => {
      const courseCode = match[1].trim();
      const gradeMatch = match[0].match(/(?:A|B|C|D|F)[\+\-]?/);
      const grade = gradeMatch ? gradeMatch[0] : '';
      return `${courseCode} (${grade})`;
    });
    console.log('Found completed courses:', result.completedCourses);

    // Extract ongoing courses
    // Look for course codes with registration indicators
    const ongoingCoursesRegex = /([A-Z]{2,4}\s*\d{3,4})[\s\S]{0,50}?(?:IP|REG|ENROLLED|IN PROGRESS)/gi;
    const ongoingMatches = Array.from(text.matchAll(ongoingCoursesRegex));
    result.ongoingCourses = ongoingMatches.map(match => match[1].trim());
    console.log('Found ongoing courses:', result.ongoingCourses);

    // Validate the parsed data
    if (result.gpa === 0 && result.totalCredits === 0 && 
        result.completedCourses.length === 0 && result.ongoingCourses.length === 0) {
      throw new Error('No valid data could be extracted from the PDF');
    }

    return result;
  } catch (error) {
    console.error('Error during text parsing:', error);
    console.error('Text sample:', text.substring(0, 500));
    throw error;
  }
} 