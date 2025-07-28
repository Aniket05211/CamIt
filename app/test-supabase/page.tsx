import { supabase } from '@/lib/supabase/client';

export default async function TestSupabasePage() {
  // Fetch first 5 users from Supabase
  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, full_name, user_type, is_verified')
    .limit(5);

  if (error) {
    return <div>Error fetching users: {error.message}</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Supabase Users (Test)</h1>
      <ul>
        {users && users.length > 0 ? (
          users.map((user: any) => (
            <li key={user.id}>
              <strong>{user.full_name}</strong> ({user.email}) - {user.user_type} - Verified: {user.is_verified ? 'Yes' : 'No'}
            </li>
          ))
        ) : (
          <li>No users found.</li>
        )}
      </ul>
    </div>
  );
} 