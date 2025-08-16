import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  uz: {
    translation: {
      // Common
      "welcome": "Xush kelibsiz",
      "login": "Kirish",
      "logout": "Chiqish",
      "register": "Ro'yxatdan o'tish",
      "search": "Qidirish",
      "save": "Saqlash",
      "cancel": "Bekor qilish",
      "delete": "O'chirish",
      "edit": "Tahrirlash",
      "back": "Orqaga",
      "next": "Keyingi",
      "previous": "Oldingi",
      "submit": "Yuborish",
      "loading": "Yuklanmoqda...",
      "error": "Xatolik",
      "success": "Muvaffaqiyat",
      
      // Navigation
      "home": "Bosh sahifa",
      "teachers": "Ustozlar",
      "lessons": "Darslar",
      "profile": "Profil",
      "messages": "Xabarlar",
      "settings": "Sozlamalar",
      "dashboard": "Boshqaruv paneli",
      
      // Authentication
      "email": "Email",
      "password": "Parol",
      "confirmPassword": "Parolni tasdiqlang",
      "forgotPassword": "Parolni unutdingizmi?",
      "signUp": "Ro'yxatdan o'tish",
      "signIn": "Kirish",
      "alreadyHaveAccount": "Akkauntingiz bormi?",
      "dontHaveAccount": "Akkauntingiz yo'qmi?",
      
      // Teachers
      "findTeachers": "Ustozlarni topish",
      "allTeachers": "Barcha ustozlar",
      "topTeachers": "Eng yaxshi ustozlar",
      "teacherProfile": "Ustoz profili",
      "bookLesson": "Dars buyurtma qilish",
      "hourlyRate": "Soatlik tarif",
      "experience": "Tajriba",
      "rating": "Reyting",
      "reviews": "Sharhlar",
      
      // Lessons
      "myLessons": "Mening darslarim",
      "upcomingLessons": "Kelayotgan darslar",
      "pastLessons": "O'tgan darslar",
      "lessonDetails": "Dars tafsilotlari",
      "lessonDate": "Dars sanasi",
      "lessonTime": "Dars vaqti",
      "duration": "Davomiyligi",
      
      // Profile
      "personalInfo": "Shaxsiy ma'lumotlar",
      "firstName": "Ism",
      "lastName": "Familiya",
      "phone": "Telefon",
      "address": "Manzil",
      "bio": "Bio",
      "subjects": "Fanlar",
      "languages": "Tillar",
      
      // Common phrases
      "perHour": "soatiga",
      "years": "yil",
      "students": "talabalar",
      "selectTime": "Vaqtni tanlang",
      "selectDate": "Sanani tanlang",
      "available": "Mavjud",
      "unavailable": "Mavjud emas",

      // Additional UI elements
      "notifications": "Bildirishnomalar",
      "noNewNotifications": "Yangi bildirishnomalar yo'q",
      "viewAllNotifications": "Barcha bildirishnomalarni ko'rish",
      "becomeTeacher": "O'qituvchi bo'ling",
    }
  },
  ru: {
    translation: {
      // Common
      "welcome": "Добро пожаловать",
      "login": "Войти",
      "logout": "Выйти",
      "register": "Регистрация",
      "search": "Поиск",
      "save": "Сохранить",
      "cancel": "Отмена",
      "delete": "Удалить",
      "edit": "Редактировать",
      "back": "Назад",
      "next": "Далее",
      "previous": "Предыдущий",
      "submit": "Отправить",
      "loading": "Загрузка...",
      "error": "Ошибка",
      "success": "Успех",
      
      // Navigation
      "home": "Главная",
      "teachers": "Преподаватели",
      "lessons": "Уроки",
      "profile": "Профиль",
      "messages": "Сообщения",
      "settings": "Настройки",
      "dashboard": "Панель управления",
      
      // Authentication
      "email": "Email",
      "password": "Пароль",
      "confirmPassword": "Подтвердите пароль",
      "forgotPassword": "Забыли пароль?",
      "signUp": "Регистрация",
      "signIn": "Войти",
      "alreadyHaveAccount": "Уже есть аккаунт?",
      "dontHaveAccount": "Нет аккаунта?",
      
      // Teachers
      "findTeachers": "Найти преподавателей",
      "allTeachers": "Все преподаватели",
      "topTeachers": "Лучшие преподаватели",
      "teacherProfile": "Профиль преподавателя",
      "bookLesson": "Забронировать урок",
      "hourlyRate": "Почасовая ставка",
      "experience": "Опыт",
      "rating": "Рейтинг",
      "reviews": "Отзывы",
      
      // Lessons
      "myLessons": "Мои уроки",
      "upcomingLessons": "Предстоящие уроки",
      "pastLessons": "Прошедшие уроки",
      "lessonDetails": "Детали урока",
      "lessonDate": "Дата урока",
      "lessonTime": "Время урока",
      "duration": "Продолжительность",
      
      // Profile
      "personalInfo": "Личная информация",
      "firstName": "Имя",
      "lastName": "Фамилия",
      "phone": "Телефон",
      "address": "Адрес",
      "bio": "Биография",
      "subjects": "Предметы",
      "languages": "Языки",
      
      // Common phrases
      "perHour": "в час",
      "years": "лет",
      "students": "студентов",
      "selectTime": "Выберите время",
      "selectDate": "Выберите дату",
      "available": "Доступно",
      "unavailable": "Недоступно",

      // Additional UI elements
      "notifications": "Уведомления",
      "noNewNotifications": "Нет новых уведомлений",
      "viewAllNotifications": "Просмотреть все уведомления",
      "becomeTeacher": "Стать преподавателем",
    }
  },
  en: {
    translation: {
      // Common
      "welcome": "Welcome",
      "login": "Login",
      "logout": "Logout",
      "register": "Register",
      "search": "Search",
      "save": "Save",
      "cancel": "Cancel",
      "delete": "Delete",
      "edit": "Edit",
      "back": "Back",
      "next": "Next",
      "previous": "Previous",
      "submit": "Submit",
      "loading": "Loading...",
      "error": "Error",
      "success": "Success",
      
      // Navigation
      "home": "Home",
      "teachers": "Teachers",
      "lessons": "Lessons",
      "profile": "Profile",
      "messages": "Messages",
      "settings": "Settings",
      "dashboard": "Dashboard",
      
      // Authentication
      "email": "Email",
      "password": "Password",
      "confirmPassword": "Confirm Password",
      "forgotPassword": "Forgot Password?",
      "signUp": "Sign Up",
      "signIn": "Sign In",
      "alreadyHaveAccount": "Already have an account?",
      "dontHaveAccount": "Don't have an account?",
      
      // Teachers
      "findTeachers": "Find Teachers",
      "allTeachers": "All Teachers",
      "topTeachers": "Top Teachers",
      "teacherProfile": "Teacher Profile",
      "bookLesson": "Book Lesson",
      "hourlyRate": "Hourly Rate",
      "experience": "Experience",
      "rating": "Rating",
      "reviews": "Reviews",
      
      // Lessons
      "myLessons": "My Lessons",
      "upcomingLessons": "Upcoming Lessons",
      "pastLessons": "Past Lessons",
      "lessonDetails": "Lesson Details",
      "lessonDate": "Lesson Date",
      "lessonTime": "Lesson Time",
      "duration": "Duration",
      
      // Profile
      "personalInfo": "Personal Information",
      "firstName": "First Name",
      "lastName": "Last Name",
      "phone": "Phone",
      "address": "Address",
      "bio": "Bio",
      "subjects": "Subjects",
      "languages": "Languages",
      
      // Common phrases
      "perHour": "per hour",
      "years": "years",
      "students": "students",
      "selectTime": "Select time",
      "selectDate": "Select date",
      "available": "Available",
      "unavailable": "Unavailable",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'uz',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
