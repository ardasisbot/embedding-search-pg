export default class Essay {
    id: number;
    content: string;
    contentLength: number;
    contentTokens: string[] | null;
    essayDate: string;
    essayThanks: string | null;
    essayTitle: string;
    essayUrl: string;
    similarity: number;
  
    constructor(data: any) {
      this.content = data.content;
      this.contentLength = data.content_length;
      this.contentTokens = data.content_tokens;
      this.essayDate = data.essay_date;
      this.essayThanks = data.essay_thanks;
      this.essayTitle = data.essay_title;
      this.essayUrl = data.essay_url;
      this.id = data.id;
      this.similarity = data.similarity;
    }
    
  }