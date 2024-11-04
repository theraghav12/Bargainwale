import { Protect } from "@clerk/clerk-react";

export default function ProtectPage({ role, children }) {
  return (
    <Protect
      role={`org:${role}`}
      condition={(has) => has({ role: "org:admin" }) || has({ role: `org:${role}` })}
      fallback={
        <p>Only a member of the Billing department can access this content.</p>
      }
    >
      {children}
    </Protect>
  );
}
