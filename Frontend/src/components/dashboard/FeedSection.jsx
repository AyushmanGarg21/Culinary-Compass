import React from 'react';
import { useSelector } from 'react-redux';

const FeedSection = ({ onViewPosts }) => {
  const { topPosts } = useSelector(state => state.dashboard);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Feed</h2>
        <button
          onClick={onViewPosts}
          className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 flex items-center space-x-1"
        >
          <span>See More</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {topPosts.length === 0 ? (
        <div className="text-center py-6">
          <div className="text-3xl mb-3">📱</div>
          <p className="text-gray-500 text-sm">No posts to show</p>
        </div>
      ) : (
        <div>
          {topPosts.slice(0, 1).map((post, index) => (
            <div
              key={post.id}
              className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-all duration-300 transform hover:scale-105 animate-fade-in"
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              {/* Post Header */}
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                  {post.author.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{post.author}</h3>
                  <p className="text-xs text-gray-500">{post.timeAgo}</p>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-3">
                <h4 className="font-medium text-gray-900 mb-2">{post.title}</h4>
                <p className="text-gray-700 text-sm line-clamp-3">{post.content}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Post Stats - Simplified */}
              <div className="text-right">
                <span className="text-xs text-gray-400">{post.timeAgo}</span>
              </div>
            </div>
          ))}
          
          {/* Show more indicator if there are more posts */}
          {topPosts.length > 1 && (
            <div className="text-center mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={onViewPosts}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
              >
                +{topPosts.length - 1} more posts
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedSection;