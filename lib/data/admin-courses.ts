import { createClient } from "@/lib/supabase/server";

export interface AdminCourseSummary {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  pricePkr: number;
  isPublished: boolean;
  lessonCount: number;
  enrollmentCount: number;
}

export async function getAdminCourses(): Promise<AdminCourseSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title, category, price_pkr, is_published, course_lessons(count), course_enrollments(count)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((c) => ({
    id: c.id,
    slug: c.slug ?? "",
    title: c.title ?? "",
    category: c.category,
    pricePkr: c.price_pkr ?? 0,
    isPublished: c.is_published ?? false,
    lessonCount: c.course_lessons?.[0]?.count ?? 0,
    enrollmentCount: c.course_enrollments?.[0]?.count ?? 0,
  }));
}

export interface AdminCourseDetail {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: string | null;
  durationWeeks: number | null;
  pricePkr: number;
  introVideoUrl: string | null;
  instructorName: string | null;
  instructorBio: string | null;
  isPublished: boolean;
}

export async function getAdminCourseDetail(id: string): Promise<AdminCourseDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, slug, title, description, category, difficulty, duration_weeks, price_pkr, intro_video_url, instructor_name, instructor_bio, is_published"
    )
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    slug: data.slug ?? "",
    title: data.title ?? "",
    description: data.description,
    category: data.category,
    difficulty: data.difficulty,
    durationWeeks: data.duration_weeks,
    pricePkr: data.price_pkr ?? 0,
    introVideoUrl: data.intro_video_url,
    instructorName: data.instructor_name,
    instructorBio: data.instructor_bio,
    isPublished: data.is_published ?? false,
  };
}

export interface AdminCourseLesson {
  id: string;
  orderIndex: number;
  title: string;
  durationMinutes: number | null;
  isFreePreview: boolean;
}

export async function getAdminCourseLessons(courseId: string): Promise<AdminCourseLesson[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("course_lessons")
    .select("id, order_index, title, duration_minutes, is_free_preview")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });

  return (data ?? []).map((l) => ({
    id: l.id,
    orderIndex: l.order_index ?? 0,
    title: l.title ?? "",
    durationMinutes: l.duration_minutes,
    isFreePreview: l.is_free_preview ?? false,
  }));
}
