import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    List,
    Settings,
    User,
    Home,
    Search,
    Bell,
    Plus,
    Upload,
    Code,
    Lock,
    Unlock,
    Send,
    Eye,
    EyeOff,
    MessageCircle,
    Heart,
    Share2,
    X
} from "lucide-react";


import { Button } from "../../components/ui/button";
import { UserProfile } from "../../components/UserProfile";
import axios from "axios";



interface Task {
    id: number;
    title: string;
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
}

interface CalendarDay {
    date: number;
    hasEvent: boolean;
    eventType?: 'deadline' | 'meeting' | 'milestone';
}

interface CodeSnippet {
    id: number;
    title: string;
    code: string;
    language: string;
    isPublic: boolean;
    createdAt: Date;
    likes: number;
    comments: Comment[];
}

interface Comment {
    id: number;
    author: string;
    content: string;
    createdAt: Date;
    avatar?: string;
}

interface CalendarEvent {
    id: number;
    title: string;
    date: number;
    month: number;
    year: number;
    type: 'deadline' | 'meeting' | 'milestone';
    description?: string;
}

export const ProjectPage = (): JSX.Element => {
    const { projectId } = useParams();
    const { isAuthenticated } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'calendar' | 'tasks' | 'code'>('calendar');
    const [showEventModal, setShowEventModal] = useState(false);
    const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([]);
    const [editingSnippetId, setEditingSnippetId] = useState<number | null>(null);
    const [editCode, setEditCode] = useState({
        title: '',
        code: '',
        language: 'javascript',
        isPublic: true,
    });
    const [newTask, setNewTask] = useState({ title: "", priority: "low" });
    type Task = {
        id: number;
        title: string;
        completed: boolean;
        priority: "high" | "medium" | "low";
    };
    type TaskUpdate = {
        title: string;
        priority: "high" | "medium" | "low";
        completed: boolean;
    };
    const [editingTask, setEditingTask] = useState<Task | null>(null);


    const startEditingTask = (task: Task) => {
        setEditingTask({ ...task });
    };

    const handleEditSubmit = async () => {
        if (!editingTask) return;  // Editing task is null 체크

        await updateTask(editingTask.id, {
            title: editingTask.title,
            priority: editingTask.priority,
            completed: editingTask.completed,
        });

        setEditingTask(null);  // Editing task를 null로 reset
    };

    const handleTaskSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.title.trim()) return;
        await addTask(newTask.title, newTask.priority);
        setNewTask({ title: "", priority: "low" });
    };

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/api/task/${projectId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setTasks(res.data.tasks);
            } catch (err) {
                console.error("Task 불러오기 실패", err);
            }
        };

        const fetchEvents = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/calendar/${projectId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                });
                console.log("📦 받은 이벤트:", response.data.events);

                setEvents(response.data.events);
            } catch (err) {
                console.error("이벤트 불러오기 실패", err);
            }
        };

        const fetchSnippets = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/snippet/project/${projectId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const snippetsArray = response.data.snippets ?? response.data; // 유연하게 처리

                const mapped = snippetsArray.map((s: any) => ({
                    ...s,
                    code: s.content // 여기서도 매핑
                }));
                setCodeSnippets(mapped);
            } catch (err) {
                console.error("코드 불러오기 실패", err);
            }
        };

        fetchTasks();
        fetchEvents();
        fetchSnippets();
    }, [projectId]);

    const startEditing = (snippet: CodeSnippet) => {
        setEditingSnippetId(snippet.id);
        setEditCode({
            title: snippet.title,
            code: snippet.code,
            language: snippet.language,
            isPublic: snippet.isPublic
        });
    };

    const saveEditedSnippet = async () => {
        if (!editingSnippetId) return;

        try {
            const response = await axios.patch(`http://localhost:3001/api/snippet/${editingSnippetId}`, {
                title: editCode.title,
                content: editCode.code,
                language: editCode.language,
                isPublic: editCode.isPublic,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const updated = response.data.snippet;
            setCodeSnippets(prev => prev.map(snip => snip.id === updated.id
                ? { ...updated, code: updated.content } : snip));
            setEditingSnippetId(null);
        } catch (err) {
            console.error("코드 수정 실패", err);
        }
    };
    const cancelEditing = () => {
        setEditingSnippetId(null);
    };
    const deleteSnippet = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3001/api/snippet/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            });

            setCodeSnippets(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            console.error("삭제 실패", err);
        }
    };
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [showEventDetail, setShowEventDetail] = useState(false);

    const openEventModal = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setShowEventDetail(true);
    };
    const addTask = async (title: string, priority: string) => {
        const res = await axios.post("http://localhost:3001/api/task", {
            title,
            priority,
            projectId,
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setTasks([...tasks, res.data.task]);
    };
    const updateTask = async (
        taskId: number,
        updatedTask: { title: string; priority: "high" | "medium" | "low"; completed: boolean }
    ) => {
        const res = await axios.put(`http://localhost:3001/api/task/${taskId}`, updatedTask, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setTasks(tasks.map(t => t.id === taskId ? res.data.task : t));
    };
    const deleteTask = async (taskId: number) => {
        await axios.delete(`http://localhost:3001/api/task/${taskId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setTasks(tasks.filter(t => t.id !== taskId));
    };


    const closeEventDetailModal = () => {
        setSelectedEvent(null);
        setShowEventDetail(false);
    };
    const [events, setEvents] = useState<CalendarEvent[]>([
        {
            id: 1,
            title: "Project Deadline",
            date: 15,
            month: currentDate.getMonth(),
            year: currentDate.getFullYear(),
            type: 'deadline',
            description: "Final project submission"
        },
        {
            id: 2,
            title: "Team Meeting",
            date: 22,
            month: currentDate.getMonth(),
            year: currentDate.getFullYear(),
            type: 'meeting',
            description: "Weekly standup meeting"
        }
    ]);

    const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
        title: '',
        type: 'meeting',
        description: ''
    });

    // Sample tasks data
    const [tasks, setTasks] = useState<Task[]>([

    ]);

    // Code snippets data


    // New code form state
    const [newCode, setNewCode] = useState({
        title: '',
        code: '',
        language: 'javascript',
        isPublic: true
    });

    const [newComment, setNewComment] = useState('');
    const [selectedSnippet, setSelectedSnippet] = useState<number | null>(null);

    // Check if a date has events
    const hasEvent = (date: number): boolean => {
        return events.some(event =>
            event.date === date &&
            event.month === currentDate.getMonth() &&
            event.year === currentDate.getFullYear()
        );
    };

    // Get events for a specific date
    const getEventsForDate = (date: number): CalendarEvent[] => {
        return events.filter(event =>
            event.date === date &&
            event.month === currentDate.getMonth() &&
            event.year === currentDate.getFullYear()
        );
    };

    // Get event type for a date (for color coding)
    const getEventType = (date: number): 'deadline' | 'meeting' | 'milestone' | undefined => {
        const dateEvents = getEventsForDate(date);
        return dateEvents.length > 0 ? dateEvents[0].type : undefined;
    };

    // Generate calendar days
    const generateCalendarDays = (): CalendarDay[] => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: CalendarDay[] = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push({ date: 0, hasEvent: false });
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayHasEvent = hasEvent(day);
            const eventType = getEventType(day);

            days.push({
                date: day,
                hasEvent: dayHasEvent,
                eventType: eventType
            });
        }

        return days;
    };

    const calendarDays = generateCalendarDays();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];


    const toggleTask = (taskId: number) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };

    const enrichedCalendarDays = calendarDays.map((day) => {
        if (day.date === 0) return day; // 빈 칸

        const fullDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date);
        const matchedEvent = events.find(
            (event) => {
                const eventDate = new Date(event.date);
                return (
                    eventDate.getFullYear() === fullDate.getFullYear() &&
                    eventDate.getMonth() === fullDate.getMonth() &&
                    eventDate.getDate() === fullDate.getDate()
                );
            }
        );

        return {
            ...day,
            hasEvent: !!matchedEvent,
            eventType: matchedEvent?.type || null,
        };
    });
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-500';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const getEventColor = (eventType?: string) => {
        switch (eventType) {
            case 'deadline': return 'bg-red-400';
            case 'meeting': return 'bg-blue-400';
            case 'milestone': return 'bg-green-400';
            default: return 'bg-gray-400';
        }
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentDate);
        if (direction === 'prev') {
            newDate.setMonth(currentDate.getMonth() - 1);
        } else {
            newDate.setMonth(currentDate.getMonth() + 1);
        }
        setCurrentDate(newDate);
    };

    const handleDateClick = (date: number) => {
        setSelectedDate(date);
        setShowEventModal(true);
    };

    const handleEventSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newEvent.title && selectedDate !== null) {
            // 🛠️ Date 객체로 만들어줌 (month는 JS 기준으로 이미 0~11 범위니까 OK)
            const fullDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate);

            const event = {
                title: newEvent.title,
                date: fullDate.toISOString(),  // 서버는 ISO 형식 DateTime 받음
                type: newEvent.type,
                description: newEvent.description,
                projectId: Number(projectId)
            };

            try {
                const response = await axios.post("http://localhost:3001/api/calendar", event, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                });

                setEvents([...events, response.data.event]);
                setNewEvent({ title: '', type: 'meeting', description: '' });
                setShowEventModal(false);
                setSelectedDate(null);
            } catch (err) {
                console.error("이벤트 저장 실패", err);
            }
        }
    };
    const deleteEvent = async (id: number) => {
        try {
            await axios.delete(`http://localhost:3001/api/calendar/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setEvents((prev) => prev.filter((event) => event.id !== id));
        } catch (err) {
            console.error("이벤트 삭제 실패", err);
        }
    };

    const closeEventModal = () => {
        setShowEventModal(false);
        setSelectedDate(null);
        setNewEvent({
            title: '',
            type: 'meeting',
            description: '',
            date: currentDate.getDate(),
            month: currentDate.getMonth(),
            year: currentDate.getFullYear()
        });
    };


    const handleCodeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCode.title || !newCode.code) return;

        try {
            const response = await axios.post(
                'http://localhost:3001/api/snippet/upload',
                {
                    projectId: projectId,  // useParams로 받아온 값
                    title: newCode.title,
                    content: newCode.code,
                    language: newCode.language,
                    isPublic: newCode.isPublic,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const createdSnippet = {
                ...response.data.snippet,
                code: response.data.snippet.content
            };
            setCodeSnippets([createdSnippet, ...codeSnippets]);
            setNewCode({ title: '', code: '', language: 'javascript', isPublic: true });

        } catch (err) {
            console.error("업로드 실패", err);
        }
    };

    const togglePrivacy = (snippetId: number) => {
        setCodeSnippets(codeSnippets.map(snippet =>
            snippet.id === snippetId
                ? { ...snippet, isPublic: !snippet.isPublic }
                : snippet
        ));
    };

    const addComment = (snippetId: number) => {
        if (newComment.trim()) {
            const comment: Comment = {
                id: Date.now(),
                author: "Current User",
                content: newComment,
                createdAt: new Date()
            };

            setCodeSnippets(codeSnippets.map(snippet =>
                snippet.id === snippetId
                    ? { ...snippet, comments: [...snippet.comments, comment] }
                    : snippet
            ));
            setNewComment('');
        }
    };



    const likeSnippet = (snippetId: number) => {
        setCodeSnippets(codeSnippets.map(snippet =>
            snippet.id === snippetId
                ? { ...snippet, likes: snippet.likes + 1 }
                : snippet
        ));
    };

    return (
        //<div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('/image.png')" }}>
        //<div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-0" />
        //<div className="relative z-10">
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link
                            to="/home"
                            className="text-2xl font-bold text-gray-900 [font-family:'Kaushan_Script',Helvetica]"
                        >
                            DEVTRACKER
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            <Link to="/community" className="text-gray-500 hover:text-gray-900">Community</Link>
                            <Link to="/resources" className="text-gray-500 hover:text-gray-900">Resources</Link>
                        </nav>

                        {/* User actions */}
                        <div className="flex items-center space-x-4">
                            {isAuthenticated ? (
                                <UserProfile />
                            ) : (
                                <>
                                    <Link to="/login">
                                        <Button variant="outline" size="sm">
                                            Sign in
                                        </Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button size="sm" className="bg-gray-900 text-white">
                                            Register
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Project {projectId} - Development Log
                    </h1>
                    <p className="text-gray-600">Track your project progress and manage tasks</p>
                </div>

                {/* Tab Navigation */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('calendar')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'calendar'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Calendar & Tasks
                            </button>
                            <button
                                onClick={() => setActiveTab('code')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'code'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <Code className="w-4 h-4 inline mr-2" />
                                Code Repository
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Calendar & Tasks Tab */}
                {activeTab === 'calendar' && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Calendar Section */}
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Calendar</h2>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')}>
                                            <ChevronLeft className="w-4 h-4" />
                                        </Button>
                                        <span className="text-lg font-medium min-w-[140px] text-center">
                                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                        </span>
                                        <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')}>
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Calendar Grid Header */}
                                <div className="grid grid-cols-7 gap-1 mb-4">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                        <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                                            {day}
                                        </div>
                                    ))}
                                </div>


                                {/* 👇 날짜 + 이벤트 점 렌더링 */}
                                <div className="grid grid-cols-7 gap-1 mb-4">
                                    {calendarDays.map((day, index) => {
                                        // 날짜가 0인 경우 빈칸
                                        if (day.date === 0) {
                                            return <div key={index} className="invisible" />;
                                        }

                                        // 현재 날짜의 Date 객체
                                        const fullDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date);

                                        // 해당 날짜에 있는 이벤트 찾기
                                        const matchedEvent = events.find((event) => {
                                            const eventDate = new Date(event.date);
                                            return (
                                                eventDate.getFullYear() === fullDate.getFullYear() &&
                                                eventDate.getMonth() === fullDate.getMonth() &&
                                                eventDate.getDate() === fullDate.getDate()
                                            );
                                        });

                                        return (
                                            <div
                                                key={index}
                                                className={`relative p-2 h-10 text-center text-sm cursor-pointer rounded
                hover:bg-gray-100 ${selectedDate === day.date ? 'bg-blue-100 text-blue-600' : 'text-gray-700'}`}
                                                onClick={() => handleDateClick(day.date)}
                                            >
                                                <span>{day.date}</span>
                                                {matchedEvent && (
                                                    <div
                                                        className={`
                absolute bottom-1 left-1/2 transform -translate-x-1/2
                w-1.5 h-1.5 rounded-full ${getEventColor(matchedEvent.type)}
              `}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>


                                {/* 이벤트 리스트 (날짜: 제목 형식) */}
                                <div className="mt-6 max-h-64 overflow-y-auto">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">이번 달 일정</h3>
                                    <ul className="space-y-1">
                                        {events
                                            .filter((event) => {
                                                const date = new Date(event.date);
                                                return (
                                                    date.getFullYear() === currentDate.getFullYear() &&
                                                    date.getMonth() === currentDate.getMonth()
                                                );
                                            })
                                            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                            .map((event) => {
                                                const date = new Date(event.date);
                                                const dateStr = `${date.getDate()}일`;

                                                return (
                                                    <li
                                                        key={event.id}
                                                        className="cursor-pointer hover:bg-gray-100 p-2 rounded text-sm text-gray-700"
                                                        onClick={() => openEventModal(event)}
                                                    >
                                                        {dateStr}: {event.title}
                                                    </li>
                                                );
                                            })}
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tasks</h2>

                                {/* Task 목록 */}
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {tasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors
        ${task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300 hover:border-gray-400'}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() =>
                                                    updateTask(task.id, { ...task, completed: !task.completed })
                                                }
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                                            <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                                {task.title}
                                            </span>
                                            <span className="text-xs text-gray-400 capitalize">{task.priority}</span>
                                            <button
                                                onClick={() => setEditingTask(task)}
                                                className="text-xs text-blue-500 hover:underline"
                                            >
                                                수정
                                            </button>
                                            <button
                                                onClick={() => deleteTask(task.id)}
                                                className="text-xs text-red-500 hover:underline"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Task 입력창 */}
                                <form onSubmit={handleTaskSubmit} className="flex flex-col space-y-3">
                                    <input
                                        type="text"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        placeholder="할 일을 입력하세요"
                                        className="flex-1 border px-3 py-2 rounded"
                                        required
                                    />
                                    <select
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                        className="border px-2 py-2 rounded"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                        추가
                                    </button>
                                </form>
                            </div>
                        </div>



                        {/* Progress Section */}
                        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Progress</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">
                                        {Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%
                                    </div>
                                    <div className="text-sm text-gray-600">Completion Rate</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600 mb-2">
                                        {tasks.filter(t => t.completed).length}
                                    </div>
                                    <div className="text-sm text-gray-600">Completed Tasks</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-orange-600 mb-2">
                                        {tasks.filter(t => !t.completed).length}
                                    </div>
                                    <div className="text-sm text-gray-600">Remaining Tasks</div>
                                </div>
                            </div>
                        </div>
                    </>
                )}


                {/* Code Repository Tab */}
                {activeTab === 'code' && (
                    <div className="space-y-8">
                        {/* Code Upload Form */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Code</h2>
                            <form onSubmit={handleCodeSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={newCode.title}
                                        onChange={(e) => setNewCode({ ...newCode, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter code title..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Language
                                    </label>
                                    <select
                                        value={newCode.language}
                                        onChange={(e) => setNewCode({ ...newCode, language: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="javascript">JavaScript</option>
                                        <option value="python">Python</option>
                                        <option value="java">Java</option>
                                        <option value="cpp">C++</option>
                                        <option value="html">HTML</option>
                                        <option value="css">CSS</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Code
                                    </label>
                                    <textarea
                                        value={newCode.code}
                                        onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
                                        rows={8}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                        placeholder="Paste your code here..."
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setNewCode({ ...newCode, isPublic: !newCode.isPublic })}
                                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${newCode.isPublic
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                }`}
                                        >
                                            {newCode.isPublic ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                            <span>{newCode.isPublic ? 'Public' : 'Private'}</span>
                                        </button>
                                    </div>

                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Code
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Code Snippets List */}
                        <div className="space-y-6">
                            {codeSnippets.map((snippet) => (
                                <div key={snippet.id} className="bg=white rounded-lg shadow-sm border p-6">

                                    {/* 상단: 제목, 언어, 수정/삭제/공개 버튼 */}
                                    < div className="flex items-center justify-between mb-4" >
                                        <div className="flex items-center space-x-3">
                                            <h3 className="text-lg font-semibold text-gray-900">{snippet.title}</h3>
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                {snippet.language}
                                            </span>

                                            <button onClick={() => startEditing(snippet)}>✏️ 수정</button>
                                            <button onClick={() => deleteSnippet(snippet.id)}>🗑 삭제</button>

                                            <button
                                                onClick={() => togglePrivacy(snippet.id)}
                                                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${snippet.isPublic
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    }`}
                                            >
                                                {snippet.isPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                <span>{snippet.isPublic ? 'Public' : 'Private'}</span>
                                            </button>
                                        </div>

                                        {/* 좋아요 / 공유 */}
                                        <div className="flex items-center space-x-2" >
                                            <button
                                                onClick={() => likeSnippet(snippet.id)}
                                                className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
                                            >
                                                <Heart className="w-4 h-4" />
                                                <span className="text-sm">{snippet.likes}</span>
                                            </button>
                                            <Button variant="ghost" size="icon">
                                                <Share2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* 수정 폼 또는 코드 출력 */}
                                    {editingSnippetId === snippet.id ? (
                                        <div className="space-y-4">
                                            <input
                                                value={editCode.title}
                                                onChange={(e) => setEditCode({ ...editCode, title: e.target.value })}
                                                className="w-full border p-2 rounded"
                                                placeholder="제목 수정"
                                            />
                                            <textarea
                                                value={editCode.code}
                                                onChange={(e) => setEditCode({ ...editCode, code: e.target.value })}
                                                rows={6}
                                                className="w-full border p-2 rounded font-mono text-sm"
                                                placeholder="코드 수정"
                                            />
                                            <div className="flex justify-end space-x-2">
                                                <button onClick={cancelEditing} className="text-gray-500 hover:text-gray-700">
                                                    취소
                                                </button>
                                                <button onClick={() => saveEditedSnippet()} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                                    저장
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <pre className="bg-white"> </pre>
                                    )}


                                    {/* Code Display */}
                                    <div className="bg-gray-900 rounded-lg p-4 mb-4" >
                                        <pre className="text-green-400 text-sm overflow-x-auto">
                                            <code>{snippet.code}</code>
                                        </pre>
                                    </div>

                                    {/* Comments Section */}
                                    <div className="border-t pt-4">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <MessageCircle className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm font-medium text-gray-700">
                                                Comments ({snippet.comments?.length ?? 0})
                                            </span>
                                        </div>

                                        {/* Existing Comments */}
                                        <div className="space-y-3 mb-4">
                                            {(snippet.comments || []).map((comment) => (
                                                <div key={comment.id} className="flex space-x-3">
                                                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                        <User className="w-4 h-4 text-gray-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                                                            <span className="text-xs text-gray-500">
                                                                {comment.createdAt.toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-700">{comment.content}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Add Comment */}
                                        <div className="flex space-x-3">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                            <div className="flex-1 flex space-x-2">
                                                <input
                                                    type="text"
                                                    value={selectedSnippet === snippet.id ? newComment : ''}
                                                    onChange={(e) => {
                                                        setSelectedSnippet(snippet.id);
                                                        setNewComment(e.target.value);
                                                    }}
                                                    placeholder="Add a comment..."
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <Button
                                                    onClick={() => addComment(snippet.id)}
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    <Send className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div >
                )
                }
            </div >

            {/* Bottom Navigation */}
            < div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg" >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-center space-x-8 py-4">
                        <Link to="/home" className="flex flex-col items-center space-y-1 text-gray-600 hover:text-blue-600">
                            <Home className="w-6 h-6" />
                            <span className="text-xs">Home</span>
                        </Link>
                        <button
                            onClick={() => setActiveTab('calendar')}
                            className={`flex flex-col items-center space-y-1 ${activeTab === 'calendar' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                        >
                            <Calendar className="w-6 h-6" />
                            <span className="text-xs">Calendar</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('code')}
                            className={`flex flex-col items-center space-y-1 ${activeTab === 'code' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                        >
                            <Code className="w-6 h-6" />
                            <span className="text-xs">Code</span>
                        </button>
                    </div>
                </div>
            </div >

            {/* Bottom padding to account for fixed navigation */}
            < div className="h-20" ></div >

            {/* Event Creation Modal */}
            {
                showEventModal && (
                    <>
                        <div
                            className="fixed inset-0 bg-black bg-opacity-30 z-50"
                            onClick={closeEventModal}
                        />
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Add Event - {monthNames[currentDate.getMonth()]} {selectedDate}, {currentDate.getFullYear()}
                                    </h2>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={closeEventModal}
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                <form onSubmit={handleEventSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Event Title
                                        </label>
                                        <input
                                            type="text"
                                            value={newEvent.title}
                                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter event title..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Event Type
                                        </label>
                                        <select
                                            value={newEvent.type}
                                            onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as 'deadline' | 'meeting' | 'milestone' })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="meeting">Meeting</option>
                                            <option value="deadline">Deadline</option>
                                            <option value="milestone">Milestone</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description (Optional)
                                        </label>
                                        <textarea
                                            value={newEvent.description}
                                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter event description..."
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={closeEventModal}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            Add Event
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )
            }

            {
                editingTask && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
                            <h2 className="text-xl font-bold mb-4">할 일 수정</h2>
                            <input
                                type="text"
                                value={editingTask.title}
                                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                                className="border p-2 w-full mb-3"
                            />
                            <select
                                value={editingTask.priority}
                                onChange={(e) =>
                                    setEditingTask({
                                        ...editingTask,
                                        priority: e.target.value as "high" | "medium" | "low",
                                    })
                                }
                                className="border p-2 w-full mb-3"
                            >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={async () => {
                                        await updateTask(editingTask.id, editingTask);
                                        setEditingTask(null);
                                    }}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    저장
                                </button>
                                <button
                                    onClick={() => setEditingTask(null)}
                                    className="bg-gray-300 px-4 py-2 rounded"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }


            {
                showEventDetail && selectedEvent && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
                            <h2 className="text-xl font-bold mb-2 text-gray-800">{selectedEvent.title}</h2>
                            <p className="text-sm text-gray-600 mb-1">
                                날짜: {new Date(selectedEvent.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600 mb-4">종류: {selectedEvent.type}</p>
                            <p className="text-gray-700 mb-4">{selectedEvent.description}</p>

                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => {
                                        deleteEvent(selectedEvent.id);
                                        closeEventDetailModal();
                                    }}
                                    className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    삭제
                                </button>
                                <button
                                    onClick={closeEventDetailModal}
                                    className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    닫기
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
        //</div>
    );
};