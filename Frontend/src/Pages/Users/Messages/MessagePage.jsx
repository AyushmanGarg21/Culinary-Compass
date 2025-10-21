import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Search as SearchIcon,
    ArrowBack as ArrowBackIcon,
    Menu as MenuIcon
} from '@mui/icons-material';
import {
    IconButton,
    TextField,
    InputAdornment,
    Fade,
    Drawer,
    useMediaQuery,
    useTheme
} from '@mui/material';
import ConversationList from '../../../components/Message/ConversationList';
import ChatWindow from '../../../components/Message/ChatWindow';
import {
    fetchConversations,
    clearCurrentConversation
} from '../../../redux/features/Messages/messagesSlice';

const MessagePage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Add custom animations
    const customStyles = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .animate-fade-in {
            animation: fadeInUp 0.6s ease-out;
        }
        .animate-fade-in-delay {
            animation: fadeInUp 0.6s ease-out 0.2s both;
        }
        .animate-fade-in-delay-2 {
            animation: fadeInUp 0.6s ease-out 0.4s both;
        }
    `;

    const {
        conversations,
        currentConversation,
        loading
    } = useSelector(state => state.messages);

    const [searchQuery, setSearchQuery] = useState('');
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchConversations());
    }, [dispatch]);

    // Filter conversations based on search query
    const filteredConversations = conversations.filter(conversation =>
        conversation.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleBackToList = () => {
        dispatch(clearCurrentConversation());
        if (isMobile) {
            setMobileDrawerOpen(true);
        }
    };

    const handleConversationSelect = () => {
        if (isMobile) {
            setMobileDrawerOpen(false);
        }
    };

    // Sidebar content
    const sidebarContent = (
        <div className="h-full flex flex-col bg-white">
            {/* Header - Fixed */}
            <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Messages</h2>

                {/* Search Bar */}
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '20px',
                            backgroundColor: 'white',
                            '& fieldset': {
                                borderColor: '#e5e7eb',
                            },
                            '&:hover fieldset': {
                                borderColor: '#d1d5db',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#3b82f6',
                            },
                        },
                    }}
                />
            </div>

            {/* Conversations List - Scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0">
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <ConversationList
                        conversations={filteredConversations}
                        onConversationSelect={handleConversationSelect}
                    />
                )}
            </div>
        </div>
    );

    return (
        <>
            <style>{customStyles}</style>
            <div className="h-[calc(100vh-64px)] flex bg-gray-50 overflow-hidden">
                {/* Desktop Sidebar */}
                {!isMobile && (
                    <div className="w-80 border-r border-gray-200 shadow-sm flex-shrink-0">
                        {sidebarContent}
                    </div>
                )}

                {/* Mobile Drawer */}
                {isMobile && (
                    <Drawer
                        anchor="left"
                        open={mobileDrawerOpen}
                        onClose={() => setMobileDrawerOpen(false)}
                        slotProps={{
                            paper: {
                                sx: {
                                    width: '85%',
                                    maxWidth: '320px',
                                    height: '100vh'
                                }
                            }
                        }}
                    >
                        {sidebarContent}
                    </Drawer>
                )}

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {currentConversation ? (
                        <>
                            {/* Mobile Header - Fixed */}
                            {isMobile && (
                                <div className="flex-shrink-0 flex items-center p-4 border-b border-gray-200 bg-white">
                                    <IconButton
                                        onClick={handleBackToList}
                                        className="mr-3"
                                    >
                                        <ArrowBackIcon />
                                    </IconButton>
                                    <img
                                        src={currentConversation.image}
                                        alt={currentConversation.username}
                                        className="w-8 h-8 rounded-full mr-3"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">
                                            {currentConversation.username}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Chat conversation
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Chat Window - Takes remaining height */}
                            <div className="flex-1 min-h-0">
                                <ChatWindow />
                            </div>
                        </>
                    ) : (
                        /* Welcome Screen */
                        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                            {isMobile && (
                                <div className="absolute top-4 left-4">
                                    <IconButton
                                        onClick={() => setMobileDrawerOpen(true)}
                                        className="bg-white shadow-md"
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                </div>
                            )}

                            <Fade in={true} timeout={800}>
                                <div className="text-center max-w-md px-6">
                                    <div className="text-6xl mb-6 animate-bounce">💬</div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-3 animate-fade-in">
                                        Welcome to Messages
                                    </h2>
                                    <p className="text-gray-600 mb-6 animate-fade-in-delay">
                                        Select a conversation from the sidebar to start chatting with other food enthusiasts.
                                    </p>
                                    {isMobile && (
                                        <button
                                            onClick={() => setMobileDrawerOpen(true)}
                                            className="bg-blue-500 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-fade-in-delay-2"
                                        >
                                            View Conversations
                                        </button>
                                    )}
                                </div>
                            </Fade>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MessagePage;