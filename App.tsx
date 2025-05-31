import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';

// Импорты контекстов
import { UserProvider } from './src/screens/Home/UserContext';
import { AvatarProvider } from './src/screens/Home/AvatarContext';
import { WorksReadyModalProvider } from './src/screens/Home/WorksReadyModalContext';  // Импортируем WorksReadyModalProvider

// Импорты экранов
import HomeScreen from './src/screens/Home/HomeScreen';
import PaymentScreen from './src/screens/payment/PaymentScreen';
import DiplomaWorkScreen from './src/screens/Create/Diploma/DiplomaWorkScreen';
import CreateWorkScreen from './src/screens/Create/CreateWorkScreen';
import ProfileScreen from './src/screens/Home/ProfileScreen';
import TeacherDashboardScreen from './src/screens/Home/Teacher/TeacherDashboardScreen';
import LectureScreen from './src/screens/Home/Teacher/Lecture/LectureScreen';
import PracticeScreen from './src/screens/Home/Teacher/Practice/PracticeScreen';
import PresentationScreen from './src/screens/Create/Presentation/PresentationScreen';
import ExamScreen from './src/screens/Home/Teacher/Exam/ExamScreen';
import QuizScreen from './src/screens/Home/Teacher/Quiz/QuizScreen';
import HandoutScreen from './src/screens/Home/Teacher/Handout/HandoutScreen';
import LessonPlanScreen from './src/screens/Home/Teacher/LessonPlan/LessonPlanScreen';
import AuthScreen from './src/screens/Home/AuthScreen';
import SignUpScreen from './src/screens/Home/SignUpScreen';
import EditProfileScreen from './src/screens/Home/Profile/EditProfileScreen';
import SupportScreen from './src/screens/Home/Profile/SupportScreen';
import PaymentMethodsScreen from './src/screens/Home/Profile/PaymentMethodsScreen';
import WorkSettingsScreen from './src/screens/Create/CreateWork/WorkSettingsScreen';
import SubscriptionScreen from './src/screens/Home/SubscriptionScreen';
import QuickCreationScreen from './src/screens/Create/QuickCreation/QuickCreationScreen';

// Импорты для интеграции Google AI
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from '@env';

// Инициализация Google Generative AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Настройка навигации
const Stack = createStackNavigator();

const App = () => {
    return (
        <AvatarProvider>
            <UserProvider> 
                <WorksReadyModalProvider> 
                    <NavigationContainer>
                        <Stack.Navigator screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="Home" component={HomeScreen} />
                            <Stack.Screen name="CreateWork" component={CreateWorkScreen} />
                            <Stack.Screen name="QuickCreation" component={QuickCreationScreen} />
                            <Stack.Screen name="Profile" component={ProfileScreen} />
                            <Stack.Screen name="DiplomaWork" component={DiplomaWorkScreen} />
                            <Stack.Screen name="LectureScreen" component={LectureScreen} />
                            <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
                            <Stack.Screen name="PracticeScreen" component={PracticeScreen} />
                            <Stack.Screen name="ExamScreen" component={ExamScreen} />
                            <Stack.Screen name="SignUp" component={SignUpScreen} />
                            <Stack.Screen name="QuizScreen" component={QuizScreen} />
                            <Stack.Screen name="Presentation" component={PresentationScreen} />
                            <Stack.Screen name="HandoutScreen" component={HandoutScreen} />
                            <Stack.Screen name="LessonPlanScreen" component={LessonPlanScreen} />
                            <Stack.Screen name="TeacherDashboard" component={TeacherDashboardScreen} />
                            <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
                            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                            <Stack.Screen name="Auth" component={AuthScreen} />                   
                            <Stack.Screen name="WorkSettings" component={WorkSettingsScreen} />
                            <Stack.Screen name="SupportScreen" component={SupportScreen} />
                            <Stack.Screen name="Subscription" component={SubscriptionScreen} />
                        </Stack.Navigator>
                    </NavigationContainer>
                    <Toast />
                </WorksReadyModalProvider>
            </UserProvider>
        </AvatarProvider>
    );
};

export default App;
