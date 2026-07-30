import type { ProductCardData } from "@/types/product";
import type { DepartmentColor } from "@/components/features/DepartmentCard";

export const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Dev boards", href: "/shop/arduino" },
  { label: "Digital projects", href: "/digital" },
  { label: "Courses", href: "/courses" },
  { label: "For schools", href: "/schools" },
];

export const SCHOOL_NAMES = [
  "Beaconhouse",
  "LGS",
  "The City School",
  "Roots Millennium",
  "Bloomfield Hall",
  "Froebel's",
  "Aitchison College",
  "Lahore Grammar School",
];

export const DEPARTMENTS: {
  href: string;
  color: DepartmentColor;
  title: string;
  subtitle: string;
  count: number;
  featured?: boolean;
}[] = [
  {
    href: "/shop/robotics-kits",
    color: "orange",
    title: "Robotics kits",
    subtitle: "Complete beginner-to-advanced build kits",
    count: 18,
    featured: true,
  },
  {
    href: "/shop/arduino",
    color: "blue",
    title: "Arduino",
    subtitle: "UNO, Nano, Mega, MKR series",
    count: 22,
  },
  {
    href: "/shop/raspberry-pi",
    color: "red",
    title: "Raspberry Pi",
    subtitle: "Pi 5, Pi 4, Zero, Pico",
    count: 15,
  },
  {
    href: "/shop/stm32",
    color: "purple",
    title: "STM32",
    subtitle: "Blue Pill, Nucleo, Discovery",
    count: 11,
  },
  {
    href: "/shop/sensors",
    color: "green",
    title: "Sensors & shields",
    subtitle: "Displays, motion, comms, prototyping",
    count: 64,
  },
  {
    href: "/digital",
    color: "yellow",
    title: "Digital projects",
    subtitle: "Downloadable project packs",
    count: 4,
  },
];

export const FEATURED_DEV_BOARDS: (ProductCardData & {
  brandGroup: "arduino" | "raspberry-pi" | "stm32";
})[] = [
  {
    slug: "arduino-uno-r3",
    name: "Arduino UNO R3",
    category: "Arduino",
    categoryHref: "arduino",
    color: "blue",
    brand: "Arduino",
    pricePkr: 2200,
    compareAtPricePkr: 2600,
    difficulty: "beginner",
    isBestseller: true,
    brandGroup: "arduino",
  },
  {
    slug: "arduino-nano-esp32",
    name: "Arduino Nano ESP32",
    category: "Arduino",
    categoryHref: "arduino",
    color: "blue",
    brand: "Arduino",
    pricePkr: 3400,
    difficulty: "intermediate",
    isNew: true,
    brandGroup: "arduino",
  },
  {
    slug: "raspberry-pi-5-8gb",
    name: "Raspberry Pi 5 (8GB)",
    category: "Raspberry Pi",
    categoryHref: "raspberry-pi",
    color: "red",
    brand: "Raspberry Pi",
    pricePkr: 22500,
    difficulty: "intermediate",
    isBestseller: true,
    brandGroup: "raspberry-pi",
  },
  {
    slug: "raspberry-pi-pico-w",
    name: "Raspberry Pi Pico W",
    category: "Raspberry Pi",
    categoryHref: "raspberry-pi",
    color: "red",
    brand: "Raspberry Pi",
    pricePkr: 1450,
    difficulty: "beginner",
    brandGroup: "raspberry-pi",
  },
  {
    slug: "stm32-blue-pill",
    name: "STM32 Blue Pill",
    category: "STM32",
    categoryHref: "stm32",
    color: "purple",
    brand: "STM32",
    pricePkr: 950,
    difficulty: "advanced",
    brandGroup: "stm32",
  },
  {
    slug: "stm32-nucleo-f446re",
    name: "STM32 Nucleo-F446RE",
    category: "STM32",
    categoryHref: "stm32",
    color: "purple",
    brand: "STM32",
    pricePkr: 4200,
    difficulty: "advanced",
    isNew: true,
    brandGroup: "stm32",
  },
];

export const SENSOR_TILES: { label: string; color: DepartmentColor }[] = [
  { label: "Displays", color: "blue" },
  { label: "Input", color: "purple" },
  { label: "Motion", color: "green" },
  { label: "Distance", color: "orange" },
  { label: "Environment", color: "green" },
  { label: "Motion / presence", color: "red" },
  { label: "Communication", color: "blue" },
  { label: "Identification", color: "purple" },
  { label: "Location", color: "orange" },
  { label: "Power / switching", color: "red" },
  { label: "Prototyping", color: "yellow" },
  { label: "Shields & storage", color: "pink" },
];

export const DIGITAL_PACKS = [
  {
    slug: "arduino-mastery-pack",
    name: "Arduino Mastery Pack",
    description: "20 projects · code, wiring diagrams, PDF guide, video",
    pricePkr: 2499,
    color: "blue" as DepartmentColor,
  },
  {
    slug: "raspberry-pi-iot-projects-pack",
    name: "Raspberry Pi IoT Projects Pack",
    description: "15 projects · Python source, setup scripts, video",
    pricePkr: 2999,
    color: "red" as DepartmentColor,
  },
  {
    slug: "stm32-advanced-pack",
    name: "STM32 Advanced Pack",
    description: "12 projects · CubeIDE, Kicad schematics, video",
    pricePkr: 3999,
    color: "purple" as DepartmentColor,
  },
];

export const SCHOOL_SERVICES = [
  {
    href: "/schools/curriculum",
    title: "Robotics curriculum",
    description: "Grade-mapped, editable syllabus",
    color: "orange" as DepartmentColor,
  },
  {
    href: "/schools/lab-setup",
    title: "Lab setup",
    description: "Turnkey robotics lab solutions",
    color: "blue" as DepartmentColor,
  },
  {
    href: "/schools/teacher-training",
    title: "Teacher training",
    description: "Certified training programs",
    color: "purple" as DepartmentColor,
  },
  {
    href: "/schools/lesson-plans",
    title: "Lesson plans",
    description: "Ready-to-teach modules",
    color: "green" as DepartmentColor,
  },
  {
    href: "/schools/evaluation",
    title: "Student evaluation",
    description: "Progress tracking + certificates",
    color: "yellow" as DepartmentColor,
  },
  {
    href: "/schools/book-demo",
    title: "Book a demo",
    description: "See Bizmi in your classroom",
    color: "pink" as DepartmentColor,
  },
];

export const FOOTER_LINKS = {
  Shop: [
    { label: "Robotics kits", href: "/shop/robotics-kits" },
    { label: "Arduino", href: "/shop/arduino" },
    { label: "Raspberry Pi", href: "/shop/raspberry-pi" },
    { label: "STM32", href: "/shop/stm32" },
    { label: "Sensors & shields", href: "/shop/sensors" },
  ],
  Learn: [
    { label: "Digital projects", href: "/digital" },
    { label: "Courses", href: "/courses" },
    { label: "For schools", href: "/schools" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
};
