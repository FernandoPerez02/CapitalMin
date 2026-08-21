import { AccountRole } from '@prisma/client';

export interface AccountContext {
  accountId: string;
  role: AccountRole;
}
