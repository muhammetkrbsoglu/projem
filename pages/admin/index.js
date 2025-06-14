import { useUser } from "@clerk/nextjs";

export default function AdminPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>Admin Paneline Hoşgeldin, {user.firstName}!</div>
  );
}
