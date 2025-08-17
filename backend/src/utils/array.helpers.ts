export const sortClassesNaturally = <T extends { name: string }>(
  classes: T[]
): T[] => {
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base",
  });
  return [...classes].sort((a, b) => collator.compare(a.name, b.name));
};
