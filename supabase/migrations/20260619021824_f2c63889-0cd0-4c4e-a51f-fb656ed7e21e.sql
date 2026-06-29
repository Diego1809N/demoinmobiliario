
-- 1) Restrict Realtime subscriptions on contact_messages to admins
-- Enable RLS on realtime.messages and add an admin-only policy for this topic.
ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can subscribe to contact_messages" ON realtime.messages;
CREATE POLICY "Admins can subscribe to contact_messages"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.topic() = 'admin-contact-messages'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- 2) Explicit admin-only write policies on user_roles to prevent privilege escalation
DROP POLICY IF EXISTS "Admins insert roles" ON public.user_roles;
CREATE POLICY "Admins insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins update roles" ON public.user_roles;
CREATE POLICY "Admins update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins delete roles" ON public.user_roles;
CREATE POLICY "Admins delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- 3) Revoke EXECUTE on has_role from anon/public so it cannot be probed via the Data API.
--    Keep EXECUTE for authenticated and service_role because RLS policies evaluate
--    has_role() as the calling role and need EXECUTE to work.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
