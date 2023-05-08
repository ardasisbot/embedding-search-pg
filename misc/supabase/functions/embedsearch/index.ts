import { serve } from 'https://deno.land/std@0.170.0/http/server.ts'
import 'https://deno.land/x/xhr@0.2.1/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.5.0'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.1.0'

const env = Deno.env.toObject()

export const supabaseClient = createClient(Deno.env.get("SUPABASE_URL"),Deno.env.get("SUPABASE_KEY"));

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
// console.log('here!')

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { data, error } = await supabaseClient
      .from('pg_articles')
      .select()
      .limit(1);
    console.log(data);
  } catch (error) {
    console.error('client connect', error);
  }

  // Search query is passed in request payload
  const { query } = await req.json()
  if (!query) {
    throw new Error('Missing query parameter')
  }

  // OpenAI recommends replacing newlines with spaces for best results
  const input = query.replace(/\n/g, ' ')

  const configuration = new Configuration({ apiKey: Deno.env.get("OPENAI_API_KEY")})
  const openai = new OpenAIApi(configuration)

  // Generate a one-time embedding for the query itself
  const embeddingResponse = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input,
  })

  const [{ embedding }] = embeddingResponse.data.data

  const { data: documents, error} = await supabaseClient.rpc("pg_search", {
    query_embedding: embedding,
    similarity_threshold: 0.75, // Choose an appropriate threshold for your data
    match_count: 3, // Choose the number of matches
  })
  //todo: add query to database 

  return new Response(JSON.stringify(documents), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
