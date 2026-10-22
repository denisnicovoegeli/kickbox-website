import "server-only";

export interface Member {
  id: string;
  email: string;
}

/** Implemented with Supabase Auth in the accounts use case. */
export interface AuthService {
  getCurrentMember(): Promise<Member | null>;
}
