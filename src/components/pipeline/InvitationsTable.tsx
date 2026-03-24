"use client";

import type { Invitation } from "@/types";

interface InvitationsTableProps {
  invitations: Invitation[];
  translations: {
    pendingInvites: string;
    emailPlaceholder: string;
    sentDate: string;
    inviteStatus: string;
    sent: string;
    opened: string;
    registered: string;
    expired: string;
    resend: string;
  };
}

const BADGE_CLASSES: Record<string, string> = {
  sent: "badge-purple",
  opened: "badge-info",
  registered: "badge-success",
  expired: "badge-danger",
};

export function InvitationsTable({
  invitations,
  translations: t,
}: InvitationsTableProps) {
  const statusLabels: Record<string, string> = {
    sent: t.sent,
    opened: t.opened,
    registered: t.registered,
    expired: t.expired,
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border-light">
        <h2 className="text-lg font-semibold text-text-primary">
          {t.pendingInvites}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full data-table text-xs md:text-sm">
          <thead>
            <tr>
              <th>{t.emailPlaceholder}</th>
              <th>Name</th>
              <th>{t.sentDate}</th>
              <th>{t.inviteStatus}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invitations.map((invitation) => (
              <tr key={invitation.id}>
                <td>{invitation.email}</td>
                <td>{invitation.name}</td>
                <td>{new Date(invitation.sentDate).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`badge ${BADGE_CLASSES[invitation.status] || "badge-purple"}`}
                  >
                    {statusLabels[invitation.status]}
                  </span>
                </td>
                <td>
                  {(invitation.status === "sent" ||
                    invitation.status === "expired") && (
                    <button className="text-xs px-3 py-1 bg-byzantine text-white rounded hover:bg-byzantine-dark transition-colors font-medium">
                      {t.resend}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
