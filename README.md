Embedding-based similariy search on [Paul Graham's essays](http://www.paulgraham.com/articles.html). 

![pg_embedding_recording_481](https://user-images.githubusercontent.com/108202396/236718761-a7f77f72-4c96-4536-89e6-8d4a6edc51b5.gif)

Repo contains: A python script to scrape all PG's essays, split/tokenize and put chunks into a Supabase DB, create embeddings via [LangChain](https://python.langchain.com/en/latest/index.html)/OpenAI, [pgvector](https://github.com/pgvector/pgvector) to compare embeddings, a (Supabase Edge function)[https://supabase.com/docs/guides/functions] to serve similar documents to given query and a Next.js frontend. 

That's a mountful - here are the steps below. 

### Scraping
`misc/scraper/pg_scrape.py`

1. Pull all article links from [here](http://www.paulgraham.com/articles.html)
2. For each article, scrape the content
3. Within each article, split the body into chunks and tokenize them via [LangChain SpacyTextSplitter](https://python.langchain.com/en/latest/modules/indexes/text_splitters/examples/spacy.html) (worked best among the options) 
4. For each chunk, compute OpenAI embeddings 
5. Seperately, go to Supabase and follow `misc/scraper/db.sql` to create db schema
6. Store all essay metadata & embeddings in a Supabase DB with pgvector enabled


### API: Search Query -> Relevant Documents

`misc/supabase/functions/embedsearch/index.ts`
1. This is where we use a Supabase Edge Function (primarily for latency reasons)
2. Given a search query, we compute its embedding (via OpenAI) and call our Supabase DB for similarity search.

### Frontend

1. Next.js frontend with Tailwindcss for styling. 




