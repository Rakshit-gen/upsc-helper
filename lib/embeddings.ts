export function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function simpleEmbedding(text: string): number[] {
  const words = text.toLowerCase().split(/\s+/);
  const embedding = new Array(384).fill(0);
  
  words.forEach((word, idx) => {
    for (let i = 0; i < word.length; i++) {
      const charCode = word.charCodeAt(i);
      embedding[(charCode + idx * 13) % 384] += 1;
    }
  });
  
  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / (norm || 1));
}

export function findSimilar(query: string, documents: { text: string; metadata?: any }[], topK: number = 5) {
  const queryEmbed = simpleEmbedding(query);
  
  const similarities = documents.map(doc => ({
    ...doc,
    similarity: cosineSimilarity(queryEmbed, simpleEmbedding(doc.text))
  }));
  
  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}
