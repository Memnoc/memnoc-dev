import { getCollection } from 'astro:content';

export async function getPublishedWriting() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const lessons = new Map<string, string>();
  for (const post of posts) {
    const course = post.data.course;
    if (!course) continue;
    const key = JSON.stringify([course.name, course.lesson]);
    const existing = lessons.get(key);
    if (existing !== undefined) {
      throw new Error(`Duplicate lesson ${course.lesson} in ${course.name}: ${existing} and ${post.id}`);
    }
    lessons.set(key, post.id);
  }
  return posts;
}

export function lessonLabel(lesson: number) {
  return lesson === 0 ? '0 — Intro' : `${lesson} — Lesson ${lesson}`;
}
