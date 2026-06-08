-- Drop the old waitlist table (removes flavors + old schema)
DROP TABLE IF EXISTS public.subscribers;

CREATE TABLE public.subscribers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT subscribers_email_unique UNIQUE (email),
  CONSTRAINT subscribers_email_format CHECK (
    email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  )
);

CREATE INDEX subscribers_email_idx ON public.subscribers (email);
CREATE INDEX subscribers_created_at_idx ON public.subscribers (created_at DESC);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can join waitlist"
ON public.subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Optional: allow authenticated admins to read signups later
-- CREATE POLICY "Authenticated can read subscribers"
-- ON public.subscribers
-- FOR SELECT
-- TO authenticated
-- USING (true);
