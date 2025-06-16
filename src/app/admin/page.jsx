import { clerkClient } from "@clerk/nextjs/server";
import { removeRole, setRole } from "./action";

export default async function Admin() {
  const client = await clerkClient();
  const users = (await client.users.getUserList()).data;

  return (
    <> 
      {users.map((user) => {
        return (
          <div
            key={user.id}
            className={`flex items-center justify-between gap-4 p-4 ${
              users.indexOf(user) % 2 === 0
                ? "bg-neutral-50 dark:bg-neutral-800"
                : "bg-white dark:bg-neutral-900" 
            }`}
          >
            <div className="flex items-center gap-8"> 
              <div className="dark:text-neutral-200">
                {user.firstName} {user.lastName}
              </div>
              
              <div className="dark:text-neutral-200">
                {
                  user.emailAddresses.find(
                    (email) => email.id === user.primaryEmailAddressId
                  )?.emailAddress
                }
              </div>
            </div>

            <div className="flex gap-2">
              <form action={setRole} className="inline">
                <input type="hidden" value={user.id} name="id" />
                <button
                  type="submit"
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Make Moderator
                </button>
              </form>

              <form action={removeRole} className="inline">
                <input type="hidden" value={user.id} name="id" />
                <button
                  type="submit"
                  className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Remove Role
                </button>
              </form>
            </div>
          </div>
        );
      })}
    </>
  );   
}
