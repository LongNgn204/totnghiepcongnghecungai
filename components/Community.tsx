import React, { useState } from 'react';
import {
    MessageSquare,
    Heart,
    Share2,
    MoreHorizontal,
    ImageIcon,
    Send,
    Search,
    TrendingUp,
    Users,
    Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Card from './atoms/Card';
import Button from './atoms/Button';

interface Post { /* ... interface unchanged ... */ }
const MOCK_POSTS: Post[] = [ /* ... data unchanged ... */ ];

const Community: React.FC = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
    const [newPostContent, setNewPostContent] = useState('');

    const handlePost = () => { /* ... logic unchanged ... */ };
    const toggleLike = (id: number) => { /* ... logic unchanged ... */ };

    return (
        <div className="space-y-6 animate-fade-in">
            <Card className="text-center">
                <h2 className="text-h3 md:text-h2">Cộng Đồng Học Tập</h2>
                <p className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto mt-2">
                    Nơi chia sẻ kiến thức, kinh nghiệm và cùng nhau tiến bộ.
                </p>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <div className="flex gap-4">
                            <img src={user?.avatar || ''} alt="User" className="w-10 h-10 rounded-full object-cover" />
                            <div className="flex-1 space-y-2">
                                <textarea
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="Bạn đang nghĩ gì?"
                                    className="input w-full min-h-[80px]"
                                />
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="sm"><ImageIcon size={16} /></Button>
                                        <Button variant="ghost" size="sm"><TrendingUp size={16} /></Button>
                                    </div>
                                    <Button onClick={handlePost} disabled={!newPostContent.trim()}><Send size={16} /> Đăng</Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="hidden md:block space-y-6">
                        {posts.map(post => (
                            <Card key={post.id}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <h3 className="font-bold text-text-primary">{post.user.name}</h3>
                                            <p className="text-xs text-text-secondary">{post.timestamp}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm"><MoreHorizontal size={18} /></Button>
                                </div>
                                <p className="text-text-secondary whitespace-pre-wrap">{post.content}</p>
                                {post.image && <img src={post.image} alt="" className="mt-3 rounded-lg w-full" />}
                                <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
                                    <div className="flex gap-4">
                                        <Button variant="ghost" size="sm" onClick={() => toggleLike(post.id)} className={`${post.isLiked ? 'text-pink-500' : ''}`}>
                                            <Heart size={16} fill={post.isLiked ? "currentColor" : "none"} /> {post.likes}
                                        </Button>
                                        <Button variant="ghost" size="sm"><MessageSquare size={16} /> {post.comments}</Button>
                                        <Button variant="ghost" size="sm"><Share2 size={16} /> Chia sẻ</Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <Card>
                        <h3 className="text-h6 mb-3 flex items-center gap-2"><TrendingUp className="text-primary-500" />Chủ Đề Nổi Bật</h3>
                        <div className="space-y-2">
                            {['#OnThiTHPT', '#CongNghe12', '#GiaiDeChiTiet'].map(tag => (
                                <p key={tag} className="text-sm text-text-secondary hover:text-primary-600 cursor-pointer">{tag}</p>
                            ))}
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-h6 mb-3 flex items-center gap-2"><Award className="text-accent-yellow-500" />Top Đóng Góp</h3>
                        {/* ... Leaderboard items ... */}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Community;
