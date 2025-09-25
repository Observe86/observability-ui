export function initials(name: string): string {
  return name
    .split(" ")
    .map((name) => name[0])
    .join("");
}
