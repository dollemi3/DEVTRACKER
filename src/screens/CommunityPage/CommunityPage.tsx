import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
    Search,
    Heart,
    MessageCircle,
    Share2,
    Eye,
    User,
    Bell,
    TrendingUp,
    Code,
    Star,
    Calendar
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { UserProfile } from "../../components/UserProfile";

interface CodeSnippet {
    id: number;
    title: string;
    code: string;
    language: string;
    isPublic: boolean;
    createdAt: Date;
    likes: number;
    comments: Comment[];
    author: string;
    projectId: number;
    views: number;
}

interface Comment {
    id: number;
    author: string;
    content: string;
    createdAt: Date;
    avatar?: string;
}

export const CommunityPage = (): JSX.Element => {
    const { isAuthenticated } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("all");
    const [sortBy, setSortBy] = useState<"latest" | "popular" | "trending">("trending");

    // Sample community data (public code snippets from various projects)
    const [communitySnippets] = useState<CodeSnippet[]>([
        {
            id: 1,
            title: "React Authentication Hook",
            code: `const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token).then(setUser);
    }
    setLoading(false);
  }, []);
  
  return { user, loading };
};`,
            language: "javascript",
            isPublic: true,
            createdAt: new Date('2024-01-20'),
            likes: 45,
            comments: [
                {
                    id: 1,
                    author: "DevMaster",
                    content: "Great implementation! Very clean code.",
                    createdAt: new Date('2024-01-21'),
                }
            ],
            author: "John Doe",
            projectId: 1,
            views: 234
        },
        {
            id: 2,
            title: "Python Data Validator",
            code: `def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    pattern = r'^\+?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$'
    return re.match(pattern, phone) is not None`,
            language: "python",
            isPublic: true,
            createdAt: new Date('2024-01-19'),
            likes: 32,
            comments: [],
            author: "Jane Smith",
            projectId: 2,
            views: 156
        },
        {
            id: 3,
            title: "CSS Grid Layout Helper",
            code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.grid-item {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem;
}`,
            language: "css",
            isPublic: true,
            createdAt: new Date('2024-01-18'),
            likes: 28,
            comments: [
                {
                    id: 1,
                    author: "CSSGuru",
                    content: "Perfect for responsive layouts!",
                    createdAt: new Date('2024-01-19'),
                }
            ],
            author: "Mike Johnson",
            projectId: 3,
            views: 189
        },
        {
            id: 4,
            title: "Node.js API Rate Limiter",
            code: `const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;`,
            language: "javascript",
            isPublic: true,
            createdAt: new Date('2024-01-17'),
            likes: 67,
            comments: [
                {
                    id: 1,
                    author: "BackendDev",
                    content: "Essential for any API!",
                    createdAt: new Date('2024-01-18'),
                },
                {
                    id: 2,
                    author: "SecurityExpert",
                    content: "Good practice for security.",
                    createdAt: new Date('2024-01-19'),
                }
            ],
            author: "Sarah Wilson",
            projectId: 4,
            views: 312
        },
        {
            id: 5,
            title: "Java Exception Handler",
            code: `@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
        ValidationException ex) {
        ErrorResponse error = new ErrorResponse(
            "VALIDATION_ERROR", 
            ex.getMessage()
        );
        return ResponseEntity.badRequest().body(error);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(
        Exception ex) {
        ErrorResponse error = new ErrorResponse(
            "INTERNAL_ERROR", 
            "An unexpected error occurred"
        );
        return ResponseEntity.status(500).body(error);
    }
}`,
            language: "java",
            isPublic: true,
            createdAt: new Date('2024-01-16'),
            likes: 41,
            comments: [],
            author: "Alex Chen",
            projectId: 5,
            views: 198
        },
        {
            id: 6,
            title: "React Custom Hook for API",
            code: `const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};`,
            language: "javascript",
            isPublic: true,
            createdAt: new Date('2024-01-15'),
            likes: 89,
            comments: [
                {
                    id: 1,
                    author: "ReactDev",
                    content: "Very useful hook! Thanks for sharing.",
                    createdAt: new Date('2024-01-16'),
                }
            ],
            author: "Emma Davis",
            projectId: 6,
            views: 445
        }
    ]);

    // Filter and sort snippets
    const filteredAndSortedSnippets = useMemo(() => {
        let filtered = communitySnippets.filter(snippet => {
            const matchesSearch = snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                snippet.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                snippet.author.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLanguage = selectedLanguage === "all" || snippet.language === selectedLanguage;
            return matchesSearch && matchesLanguage && snippet.isPublic;
        });

        // Sort snippets
        switch (sortBy) {
            case "latest":
                filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
                break;
            case "popular":
                filtered.sort((a, b) => b.likes - a.likes);
                break;
            case "trending":
                // Simple trending algorithm: likes + views + recent comments
                filtered.sort((a, b) => {
                    const scoreA = a.likes + (a.views * 0.1) + (a.comments.length * 5);
                    const scoreB = b.likes + (b.views * 0.1) + (b.comments.length * 5);
                    return scoreB - scoreA;
                });
                break;
            default:
                break;
        }

        return filtered;
    }, [communitySnippets, searchTerm, selectedLanguage, sortBy]);

    const getLanguageColor = (language: string) => {
        const colors: { [key: string]: string } = {
            javascript: "bg-yellow-100 text-yellow-800",
            python: "bg-blue-100 text-blue-800",
            java: "bg-red-100 text-red-800",
            css: "bg-purple-100 text-purple-800",
            html: "bg-orange-100 text-orange-800",
            cpp: "bg-green-100 text-green-800"
        };
        return colors[language] || "bg-gray-100 text-gray-800";
    };

    const likeSnippet = (snippetId: number) => {
        // In a real app, this would make an API call
        console.log(`Liked snippet ${snippetId}`);
    };

    return (
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
                            <Link to="/community" className="text-blue-600 font-medium">Community</Link>
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
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">community</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover and share code snippets from developers around the world.
                        Learn from others and contribute to the community.
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search code, titles, or authors..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Language Filter */}
                        <select
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Languages</option>
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="css">CSS</option>
                            <option value="html">HTML</option>
                            <option value="cpp">C++</option>
                        </select>

                        {/* Sort Filter */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as "latest" | "popular" | "trending")}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="trending">Trending</option>
                            <option value="latest">Latest</option>
                            <option value="popular">Most Popular</option>
                        </select>
                    </div>
                </div>

                {/* Code Snippets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {filteredAndSortedSnippets.map((snippet) => (
                        <div key={snippet.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                            {/* Card Header */}
                            <div className="p-4 border-b">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                                        {snippet.title}
                                    </h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(snippet.language)}`}>
                                        {snippet.language}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <User className="w-4 h-4" />
                                    <span>{snippet.author}</span>
                                    <span>•</span>
                                    <Calendar className="w-4 h-4" />
                                    <span>{snippet.createdAt.toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Code Preview */}
                            <div className="p-4">
                                <div className="bg-gray-900 rounded-lg p-3 mb-4">
                                    <pre className="text-green-400 text-xs overflow-hidden">
                                        <code className="line-clamp-6">
                                            {snippet.code.length > 200
                                                ? snippet.code.substring(0, 200) + "..."
                                                : snippet.code}
                                        </code>
                                    </pre>
                                </div>

                                {/* Stats and Actions */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <div className="flex items-center space-x-1">
                                            <Eye className="w-4 h-4" />
                                            <span>{snippet.views}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <MessageCircle className="w-4 h-4" />
                                            <span>{snippet.comments.length}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => likeSnippet(snippet.id)}
                                            className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                                        >
                                            <Heart className="w-4 h-4" />
                                            <span className="text-sm">{snippet.likes}</span>
                                        </button>
                                        <Button variant="ghost" size="icon" className="w-8 h-8">
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* View Project Link */}
                            <div className="px-4 pb-4">
                                <Link
                                    to={`/project/${snippet.projectId}`}
                                    className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    <Code className="w-4 h-4 mr-1" />
                                    View in Project
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredAndSortedSnippets.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Search className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No code snippets found</h3>
                        <p className="text-gray-500">
                            Try adjusting your search terms or filters to find what you're looking for.
                        </p>
                    </div>
                )}

                {/* Trending Section */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center mb-4">
                        <TrendingUp className="w-5 h-5 text-orange-500 mr-2" />
                        <h2 className="text-xl font-semibold text-gray-900">Trending This Week</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {filteredAndSortedSnippets.slice(0, 3).map((snippet) => (
                            <div key={snippet.id} className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-2">{snippet.title}</h4>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>{snippet.author}</span>
                                    <div className="flex items-center space-x-2">
                                        <Heart className="w-4 h-4" />
                                        <span>{snippet.likes}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};