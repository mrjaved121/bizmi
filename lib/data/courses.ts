import { createStaticClient } from "@/lib/supabase/static";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface CourseCard {
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: string | null;
  durationWeeks: number | null;
  pricePkr: number;
  instructorName: string | null;
}

export async function getCourses(): Promise<CourseCard[]> {
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("courses")
    .select("slug, title, description, category, difficulty, duration_weeks, price_pkr, instructor_name")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data
    .filter((c) => c.slug && c.title)
    .map((c) => ({
      slug: c.slug!,
      title: c.title!,
      description: c.description,
      category: c.category,
      difficulty: c.difficulty,
      durationWeeks: c.duration_weeks,
      pricePkr: c.price_pkr ?? 0,
      instructorName: c.instructor_name,
    }));
}

export interface CourseLesson {
  id: string;
  title: string;
  durationMinutes: number | null;
  isFreePreview: boolean;
  locked: boolean;
  contentMd: string | null;
  videoUrl: string | null;
}

export interface CourseDetail {
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
  lessons: CourseLesson[];
  isEnrolled: boolean;
}

// course_lessons RLS only returns rows that are either free previews or
// belong to a course the requester is enrolled in — an anonymous or
// not-yet-enrolled visitor would see nothing but preview rows, and never
// the titles of locked lessons. The admin client fetches the full syllabus
// so it can be shown with lock icons; content/video for non-preview lessons
// is only ever included below when the requester is actually enrolled.
export async function getCourseBySlug(slug: string): Promise<CourseDetail | null> {
  const staticClient = createStaticClient();
  const { data: course, error } = await staticClient
    .from("courses")
    .select(
      "id, slug, title, description, category, difficulty, duration_weeks, price_pkr, intro_video_url, instructor_name, instructor_bio"
    )
    .eq("is_published", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !course || !course.slug || !course.title) return null;

  const sessionClient = await createClient();
  const {
    data: { user },
  } = await sessionClient.auth.getUser();

  let isEnrolled = false;
  if (user) {
    const { data: enrollment } = await sessionClient
      .from("course_enrollments")
      .select("user_id")
      .eq("course_id", course.id)
      .eq("user_id", user.id)
      .maybeSingle();
    isEnrolled = !!enrollment;
  }

  const admin = createAdminClient();
  const { data: lessons } = await admin
    .from("course_lessons")
    .select("id, order_index, title, duration_minutes, is_free_preview, content_md, video_url")
    .eq("course_id", course.id)
    .order("order_index", { ascending: true });

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    category: course.category,
    difficulty: course.difficulty,
    durationWeeks: course.duration_weeks,
    pricePkr: course.price_pkr ?? 0,
    introVideoUrl: course.intro_video_url,
    instructorName: course.instructor_name,
    instructorBio: course.instructor_bio,
    isEnrolled,
    lessons: (lessons ?? []).map((l) => {
      const unlocked = l.is_free_preview || isEnrolled;
      return {
        id: l.id,
        title: l.title ?? "Lesson",
        durationMinutes: l.duration_minutes,
        isFreePreview: l.is_free_preview ?? false,
        locked: !unlocked,
        contentMd: unlocked ? l.content_md : null,
        videoUrl: unlocked ? l.video_url : null,
      };
    }),
  };
}

export async function getCourseSlugsForStaticParams(): Promise<{ slug: string }[]> {
  const supabase = createStaticClient();
  const { data } = await supabase.from("courses").select("slug").eq("is_published", true);
  return (data ?? []).filter((c) => c.slug).map((c) => ({ slug: c.slug! }));
}

export interface MyCourse {
  slug: string;
  title: string;
  progressPercent: number;
  enrolledAt: string;
}

export async function getMyCourses(): Promise<MyCourse[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("course_enrollments")
    .select("progress_percent, enrolled_at, courses(slug, title)")
    .eq("user_id", user.id)
    .order("enrolled_at", { ascending: false });

  return (data ?? [])
    .filter((e): e is typeof e & { courses: { slug: string; title: string } } => Boolean(e.courses?.slug))
    .map((e) => ({
      slug: e.courses.slug,
      title: e.courses.title ?? "Course",
      progressPercent: e.progress_percent ?? 0,
      enrolledAt: e.enrolled_at ?? "",
    }));
}
