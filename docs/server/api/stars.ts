export default defineEventHandler(async () => {
  const cachedStars = await useStorage("kv").getItem<string>("dnd-stars");
  const [lastAccessed, totalStars] = cachedStars
    ? cachedStars.split("|")
    : [0, 0];

  if (Date.now() - Number(lastAccessed) > 1000 * 60) {
    const res = await fetch(
      "https://api.github.com/repos/formkit/drag-and-drop"
    );
    if (res.ok) {
      const data = (await res.json()) as { stargazers_count: number };
      await useStorage("kv").setItem(
        "dnd-stars",
        `${Date.now()}|${data.stargazers_count}`
      );
      return { stars: data.stargazers_count };
    }
  }
  return { stars: totalStars };
});
