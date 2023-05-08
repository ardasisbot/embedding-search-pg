def initialize_supabase_client():
    import os
    from supabase import create_client, Client
    SUPABASE_URL = "YOUR_SUPABASE_URL"
    SUPABASE_KEY = "YOUR_SUPABASE_KEY"
    
    supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return supabase_client

def insert_text_metadata_to_db(supabase_client, metadata_list):
    for metadata in metadata_list: 
        try:
            data, count = supabase_client.table('pg_articles').insert(metadata).execute()
        except ValueError:
            print('Cannot add metadata to db', metadata)

