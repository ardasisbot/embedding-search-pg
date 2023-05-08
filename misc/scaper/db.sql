-- Go to Supabase, create a Project and run these commands in order 

--  RUN 1st
create extension vector;

-- RUN 2nd
create table pg_articles (
  id bigserial primary key,
  essay_title text,
  essay_url text,
  essay_date text,
  essay_thanks text,
  content text,
  content_length bigint,
  content_tokens bigint,
  embedding vector (1536)
);

-- RUN 3rd after running the scripts (DB needs to be populated first)
create or replace function pg_search (
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int
)
returns table (
  id bigint,
  essay_title text,
  essay_url text,
  essay_date text,
  essay_thanks text,
  content text,
  content_length bigint,
  content_tokens bigint,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    pg_articles.id,
    pg_articles.essay_title,
    pg_articles.essay_url,
    pg_articles.essay_date,
    pg_articles.essay_thanks,
    pg_articles.content,
    pg_articles.content_length,
    pg_articles.content_tokens,
    1 - (pg_articles.embedding <=> query_embedding) as similarity
  from pg_articles
  where 1 - (pg_articles.embedding <=> query_embedding) > similarity_threshold
  order by pg_articles.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- RUN 4th
create index on pg_articles 
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);
