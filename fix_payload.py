with open('script.js', 'r') as f:
    content = f.read()

# We are sending yas, rhr, cooper, bmr, mhr, hrr, vo2max to Supabase, but the DB returns a 400 Bad Request because those columns don't exist.
# Since we cannot easily alter the Supabase schema from the client, we must omit these from the upsert payload, 
# OR stringify them into a column that DOES exist, but `olcumler` only has specific float columns.

# Wait, the instruction said: "Complex relational data (like workout sets or diet meals) are saved into single Supabase columns as stringified JSON arrays (setler, ogunler)".
# But `olcumler` doesn't seem to have a JSON column.
# Let's check `uyeler` table schema to see if we can save it there as a json array of tests, or we can just send the payload without those keys and store them in memory for now? 
# No, they must be saved. 
