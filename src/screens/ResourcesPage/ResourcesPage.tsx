import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
    Search,
    Download,
    ExternalLink,
    User,
    Bell,
    FileText,
    Video,
    Code,
    Book,
    Headphones,
    Image as ImageIcon,
    Archive
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { UserProfile } from "../../components/UserProfile";

interface Resource {
    id: number;
    title: string;
    description: string;
    type: 'document' | 'video' | 'code' | 'book' | 'audio' | 'image' | 'archive';
    downloadUrl: string;
    previewUrl?: string;
    size: string;
    format: string;
    uploadDate: Date;
    downloads: number;
    category: string;
}

export const ResourcesPage = (): JSX.Element => {
    const { isAuthenticated } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedType, setSelectedType] = useState("all");

    // Sample resources data
    const [resources] = useState<Resource[]>([
        {
            id: 1,
            title: "React Development Guide",
            description: "Complete guide for React development with best practices, hooks, and modern patterns. Includes examples and code snippets.",
            type: 'document',
            downloadUrl: "#",
            previewUrl: "#",
            size: "2.5 MB",
            format: "PDF",
            uploadDate: new Date('2024-01-15'),
            downloads: 1250,
            category: "Development"
        },
        {
            id: 2,
            title: "JavaScript ES6+ Tutorial",
            description: "Learn modern JavaScript features including arrow functions, destructuring, async/await, and more advanced concepts.",
            type: 'video',
            downloadUrl: "#",
            previewUrl: "#",
            size: "450 MB",
            format: "MP4",
            uploadDate: new Date('2024-01-18'),
            downloads: 890,
            category: "Tutorial"
        },
        {
            id: 3,
            title: "Node.js API Boilerplate",
            description: "Production-ready Node.js API boilerplate with authentication, database integration, and comprehensive documentation.",
            type: 'code',
            downloadUrl: "#",
            previewUrl: "#",
            size: "15 MB",
            format: "ZIP",
            uploadDate: new Date('2024-01-20'),
            downloads: 2100,
            category: "Template"
        },
        {
            id: 4,
            title: "Clean Code Principles",
            description: "Essential book on writing clean, maintainable code. Learn best practices for naming, functions, and code organization.",
            type: 'book',
            downloadUrl: "#",
            previewUrl: "#",
            size: "8.2 MB",
            format: "EPUB",
            uploadDate: new Date('2024-01-12'),
            downloads: 3200,
            category: "Education"
        },
        {
            id: 5,
            title: "CSS Grid Layout Examples",
            description: "Collection of CSS Grid layout examples and templates for modern web design. Includes responsive patterns.",
            type: 'code',
            downloadUrl: "#",
            previewUrl: "#",
            size: "5.8 MB",
            format: "ZIP",
            uploadDate: new Date('2024-01-22'),
            downloads: 750,
            category: "Design"
        },
        {
            id: 6,
            title: "Programming Podcast Series",
            description: "Weekly podcast discussing latest programming trends, interviews with developers, and technology insights.",
            type: 'audio',
            downloadUrl: "#",
            previewUrl: "#",
            size: "120 MB",
            format: "MP3",
            uploadDate: new Date('2024-01-25'),
            downloads: 450,
            category: "Podcast"
        },
        {
            id: 7,
            title: "UI Design Assets Pack",
            description: "Professional UI design assets including icons, illustrations, and design elements for web and mobile applications.",
            type: 'image',
            downloadUrl: "#",
            previewUrl: "#",
            size: "95 MB",
            format: "PNG/SVG",
            uploadDate: new Date('2024-01-28'),
            downloads: 1800,
            category: "Design"
        },
        {
            id: 8,
            title: "Database Design Patterns",
            description: "Comprehensive guide to database design patterns, normalization, and optimization techniques for various database systems.",
            type: 'document',
            downloadUrl: "#",
            previewUrl: "#",
            size: "4.1 MB",
            format: "PDF",
            uploadDate: new Date('2024-01-30'),
            downloads: 920,
            category: "Database"
        },
        {
            id: 9,
            title: "DevOps Tools Collection",
            description: "Complete collection of DevOps tools, scripts, and configuration files for CI/CD, monitoring, and deployment automation.",
            type: 'archive',
            downloadUrl: "#",
            previewUrl: "#",
            size: "250 MB",
            format: "TAR.GZ",
            uploadDate: new Date('2024-02-01'),
            downloads: 680,
            category: "DevOps"
        }
    ]);

    // Filter resources based on search and filters
    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || resource.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesType = selectedType === "all" || resource.type === selectedType;

        return matchesSearch && matchesCategory && matchesType;
    });

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'document': return <FileText className="w-5 h-5" />;
            case 'video': return <Video className="w-5 h-5" />;
            case 'code': return <Code className="w-5 h-5" />;
            case 'book': return <Book className="w-5 h-5" />;
            case 'audio': return <Headphones className="w-5 h-5" />;
            case 'image': return <ImageIcon className="w-5 h-5" />;
            case 'archive': return <Archive className="w-5 h-5" />;
            default: return <FileText className="w-5 h-5" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'document': return 'text-blue-600 bg-blue-100';
            case 'video': return 'text-red-600 bg-red-100';
            case 'code': return 'text-green-600 bg-green-100';
            case 'book': return 'text-purple-600 bg-purple-100';
            case 'audio': return 'text-orange-600 bg-orange-100';
            case 'image': return 'text-pink-600 bg-pink-100';
            case 'archive': return 'text-gray-600 bg-gray-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const categories = ["all", "Development", "Tutorial", "Template", "Education", "Design", "Podcast", "Database", "DevOps"];
    const types = ["all", "document", "video", "code", "book", "audio", "image", "archive"];

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
                            <Link to="/community" className="text-gray-500 hover:text-gray-900">Community</Link>
                            <Link to="/resources" className="text-blue-600 font-medium">Resources</Link>
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Resources</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover and download valuable development resources, tutorials, templates, and tools
                        to accelerate your projects and enhance your skills.
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
                                placeholder="Search resources, titles, or categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category === "all" ? "All Categories" : category}
                                </option>
                            ))}
                        </select>

                        {/* Type Filter */}
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {types.map(type => (
                                <option key={type} value={type}>
                                    {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Resources Grid */}
                <div className="space-y-4 mb-8">
                    {filteredResources.map((resource) => (
                        <div key={resource.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-start space-x-4">
                                    {/* Resource Icon */}
                                    <div className={`p-3 rounded-lg ${getTypeColor(resource.type)}`}>
                                        {getTypeIcon(resource.type)}
                                    </div>

                                    {/* Resource Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                {resource.title}
                                            </h3>
                                            <div className="flex items-center space-x-2 ml-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center space-x-1"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    <span>Preview</span>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-1"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    <span>Download</span>
                                                </Button>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {resource.description}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                                    {resource.category}
                                                </span>
                                                <span>{resource.format}</span>
                                                <span>{resource.size}</span>
                                                <span>{resource.downloads.toLocaleString()} downloads</span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {resource.uploadDate.toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredResources.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <Search className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                        <p className="text-gray-500">
                            Try adjusting your search terms or filters to find what you're looking for.
                        </p>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex justify-center mt-8">
                    <div className="flex items-center space-x-2">
                    </div>
                </div>

                {/* Popular Resources Section */}
                <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Most Popular Resources</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {resources
                            .sort((a, b) => b.downloads - a.downloads)
                            .slice(0, 3)
                            .map((resource) => (
                                <div key={resource.id} className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <div className={`p-2 rounded ${getTypeColor(resource.type)}`}>
                                            {getTypeIcon(resource.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-900 truncate">{resource.title}</h4>
                                            <p className="text-sm text-gray-500">{resource.downloads.toLocaleString()} downloads</p>
                                        </div>
                                    </div>
                                    <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};