export interface GroundedQuote {
  id: string;
  theme: string;
  quote: string;
  originalGreek: string;
  sourceWork: string;
  bekkerNumber: string;
  context: string;
  phroneticReflection: string;
  groundingSources: { title: string; uri: string }[];
  searchQueries?: string[];
  isRealTimeGrounded: boolean;
}
