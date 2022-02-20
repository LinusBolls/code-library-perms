import { decodePerms, encodePerms } from "./core";
import { Perm, NO_ACCOUNT_REQUIRED_PERMS_INT } from "./permissions";

const getKeyByValue = (obj: { [key: string]: any }, value: any) =>
  Object.keys(obj).find((key) => obj[key] === value);

function hasPerms(
  userPermsInt: number | number[],
  requiredPermsInt: number | number[]
): boolean {
  const userPerms = decodePerms(
    combinePerms(userPermsInt, NO_ACCOUNT_REQUIRED_PERMS_INT)
  );
  const requiredPerms = decodePerms(requiredPermsInt);

  return requiredPerms.every((i) => userPerms.includes(i));
}
function combinePerms(
  permsInt0: number | number[],
  permsInt1: number | number[]
): number {
  const perms0 = decodePerms(permsInt0);
  const perms1 = decodePerms(permsInt1);
  const newPerms = [...perms0, ...perms1.filter((i) => !perms0.includes(i))];

  return encodePerms(newPerms);
}
function removePerms(
  userPermsInt: number | number[],
  permsIntToBeRemoved: number | number[]
): number {
  const userPerms = decodePerms(userPermsInt);
  const permsToBeRemoved = decodePerms(permsIntToBeRemoved);

  const newUserPerms = userPerms.filter(
    (perm) => !permsToBeRemoved.includes(perm)
  );
  return encodePerms(newUserPerms);
}
function requirePerms(
  userPermsInt: number | number[],
  permsInt: number | number[],
  errMsg: string = ""
) {
  const sache = Array.isArray(permsInt)
    ? permsInt.map((i) => getKeyByValue(Perm, i)).join(", ")
    : getKeyByValue(Perm, permsInt);

  const defaultErrMsg = `Missing Permissions: ${sache}`;

  if (!hasPerms(userPermsInt, permsInt))
    throw new Error(errMsg || defaultErrMsg);
}
export { hasPerms, combinePerms, removePerms, requirePerms };
