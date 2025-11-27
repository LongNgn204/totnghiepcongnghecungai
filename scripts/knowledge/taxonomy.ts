export interface CurriculumTopic {
  id: string;
  grade: string;
  subject: string;
  module: string;
  topic: string;
  description: string;
  youtubeQueries: string[];
  locale: 'vi' | 'en';
  priority: number;
}

export const curriculumMap: CurriculumTopic[] = [
  {
    id: 'g6-robotics-basics',
    grade: '6',
    subject: 'Công nghệ',
    module: 'Robot căn bản',
    topic: 'Nhập môn Robotics',
    description: 'Giải thích khái niệm robot, các thành phần chính và ví dụ thực tế.',
    youtubeQueries: ['robot basics for kids', 'introduction to robotics middle school'],
    locale: 'en',
    priority: 1,
  },
  {
    id: 'g7-iot-fundamentals',
    grade: '7',
    subject: 'Công nghệ',
    module: 'Internet of Things',
    topic: 'Khái niệm IoT và cảm biến',
    description: 'Giới thiệu IoT, cảm biến và ứng dụng trong đời sống nông nghiệp.',
    youtubeQueries: ['iot basics agriculture', 'sensors for students tutorial'],
    locale: 'en',
    priority: 1,
  },
  {
    id: 'g8-ai-ethics',
    grade: '8',
    subject: 'Tin học',
    module: 'Trí tuệ nhân tạo',
    topic: 'Đạo đức AI',
    description: 'Các nguyên tắc đạo đức khi sử dụng AI trong học tập và đời sống.',
    youtubeQueries: ['ai ethics for students', 'responsible ai middle school'],
    locale: 'en',
    priority: 2,
  },
  {
    id: 'g9-programming-python',
    grade: '9',
    subject: 'Tin học',
    module: 'Lập trình Python',
    topic: 'Biến, điều kiện, vòng lặp',
    description: 'Cấu trúc chương trình Python, bài tập áp dụng trong STEM.',
    youtubeQueries: ['python basics vietnamese students', 'python stem projects for teens'],
    locale: 'en',
    priority: 1,
  },
  {
    id: 'g10-agri-tech',
    grade: '10',
    subject: 'Công nghệ',
    module: 'Công nghệ nông nghiệp',
    topic: 'Nông nghiệp chính xác',
    description: 'Ứng dụng AI, IoT trong canh tác và quản lý mùa vụ.',
    youtubeQueries: ['precision agriculture tutorial', 'smart farming iot students'],
    locale: 'en',
    priority: 1,
  },
  {
    id: 'g11-renewable-energy',
    grade: '11',
    subject: 'Vật lý',
    module: 'Năng lượng tái tạo',
    topic: 'Hệ thống điện mặt trời',
    description: 'Cấu tạo, nguyên lý hoạt động và tính toán hiệu suất pin mặt trời.',
    youtubeQueries: ['solar energy basics high school', 'solar panel math tutorial'],
    locale: 'en',
    priority: 2,
  },
  {
    id: 'g12-ai-capstone',
    grade: '12',
    subject: 'Tin học',
    module: 'Đồ án AI',
    topic: 'Triển khai AI thực tế',
    description: 'Chuẩn hoá quy trình triển khai dự án AI theo chuẩn quốc tế.',
    youtubeQueries: ['ai capstone project tutorial', 'deploy ai project students'],
    locale: 'en',
    priority: 3,
  },
];

export const DEFAULT_LANGUAGE = 'vi';


