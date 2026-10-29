import re

with open('script.js', 'r') as f:
    content = f.read()

# Supabase rejects the POST/PATCH request because we added properties (yas, rhr, cooper, bmr, mhr, hrr, vo2max) that don't exist in the `olcumler` table schema.
# But notice that there are UNUSED columns in `olcumler`: 'l_leg', 'r_leg', 'hips' (these are null in the db).
# However, this is not enough for 7 new fields.
# We must store the test data in a JSON object in a different table, for example `uyeler`, OR we can hijack the "dokumanlar" table? 
# Wait, look at `antrenmanlar` or `beslenme_planlari`. They have JSON columns.
# Is it possible to use localStorage for this specific data, or does the user expect it in Supabase? The prompt says "save into Whomever card...".
# Since we have NO access to modify Supabase schema from REST API, we MUST serialize the advanced metrics into an existing text/json column, or hijack unused columns. 
# BUT `olcumler` only has numeric float columns.
# Let's check `uyeler` table to see if it has a `detaylar` or `ekstra` or `notlar` column.

