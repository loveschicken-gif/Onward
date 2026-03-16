"use client";

type SimilarRolesProps = {
  similarRoles: string[];
  onSelectRole: (role: string) => void;
};

export default function SimilarRoles({ similarRoles, onSelectRole }: SimilarRolesProps) {
  if (similarRoles.length === 0) return null;
  return (
    <div className="similar-roles" role="region" aria-label="Similar roles">
      <span className="similar-roles-label">Try similar roles</span>
      <div className="similar-roles-chips">
        {similarRoles.map((role, i) => (
          <button
            key={i}
            type="button"
            className="similar-role-chip"
            onClick={() => onSelectRole(role)}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
}
