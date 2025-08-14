import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Users, MessageCircle, Github, Calendar, Star, ArrowRight, Heart, Zap, Globe, Shield, BookOpen, Code } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-bold neon-text mb-6">👥 Community</h1>
          <p className="text-xl text-gray-300 mb-8">
            Join developers, designers, and innovators building the future with HackForge. Connect, learn, and grow together in our vibrant community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="glass-effect border border-white/10 rounded-lg px-6 py-3">
              <Users className="h-6 w-6 text-primary mx-auto mb-2" />
              <span className="text-sm text-gray-300">10k+ Members</span>
            </div>
            <div className="glass-effect border border-white/10 rounded-lg px-6 py-3">
              <MessageCircle className="h-6 w-6 text-primary mx-auto mb-2" />
              <span className="text-sm text-gray-300">Active Discussions</span>
            </div>
            <div className="glass-effect border border-white/10 rounded-lg px-6 py-3">
              <Heart className="h-6 w-6 text-primary mx-auto mb-2" />
              <span className="text-sm text-gray-300">Supportive Environment</span>
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="glass-effect border border-white/10 rounded-xl p-6 text-center">
            <Users className="h-12 w-12 text-primary mx-auto mb-3" />
            <div className="text-3xl font-bold text-foreground mb-2">10,000+</div>
            <div className="text-gray-300">Active Members</div>
          </div>
          
          <div className="glass-effect border border-white/10 rounded-xl p-6 text-center">
            <MessageCircle className="h-12 w-12 text-primary mx-auto mb-3" />
            <div className="text-3xl font-bold text-foreground mb-2">50,000+</div>
            <div className="text-gray-300">Messages Shared</div>
          </div>
          
          <div className="glass-effect border border-white/10 rounded-xl p-6 text-center">
            <Code className="h-12 w-12 text-primary mx-auto mb-3" />
            <div className="text-3xl font-bold text-foreground mb-2">5,000+</div>
            <div className="text-gray-300">Projects Built</div>
          </div>
          
          <div className="glass-effect border border-white/10 rounded-xl p-6 text-center">
            <Star className="h-12 w-12 text-primary mx-auto mb-3" />
            <div className="text-3xl font-bold text-foreground mb-2">4.9★</div>
            <div className="text-gray-300">Community Rating</div>
          </div>
        </div>

        {/* Community Platforms */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Join the Conversation</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Forum */}
            <div className="glass-effect border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group">
              <div className="text-center mb-4">
                <MessageCircle className="h-16 w-16 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Forum</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4 text-center">
                Ask questions, share knowledge, and connect with fellow developers in our comprehensive discussion forum.
              </p>
              <ul className="text-sm text-gray-400 space-y-2 mb-6">
                <li>• Q&A Discussions</li>
                <li>• Technical Support</li>
                <li>• Best Practices</li>
                <li>• Project Showcases</li>
              </ul>
              <Link 
                href="https://forum.hackforge.dev" 
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-primary hover:text-accent transition-colors duration-200 group-hover:neon-text"
              >
                Visit Forum →
              </Link>
            </div>

            {/* Discord Server */}
            <div className="glass-effect border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group">
              <div className="text-center mb-4">
                <MessageCircle className="h-16 w-16 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Discord Server</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4 text-center">
                Real-time chat, voice channels, and instant support in our vibrant Discord community.
              </p>
              <ul className="text-sm text-gray-400 space-y-2 mb-6">
                <li>• Live Chat</li>
                <li>• Voice Channels</li>
                <li>• Bot Integration</li>
                <li>• Event Notifications</li>
              </ul>
              <Link 
                href="https://discord.gg/hackforge" 
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-blue-400 hover:text-blue-300 transition-colors duration-200 group-hover:neon-text"
              >
                Join Discord →
              </Link>
            </div>

            {/* GitHub Discussions */}
            <div className="glass-effect border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group">
              <div className="text-center mb-4">
                <Github className="h-16 w-16 text-gray-300 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="text-xl font-semibold text-foreground mb-2">GitHub Discussions</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4 text-center">
                Technical discussions, feature requests, and community feedback on our GitHub repository.
              </p>
              <ul className="text-sm text-gray-400 space-y-2 mb-6">
                <li>• Feature Requests</li>
                <li>• Bug Reports</li>
                <li>• Technical Q&A</li>
                <li>• Community Ideas</li>
              </ul>
              <Link 
                href="https://github.com/hackforge/hackforge/discussions" 
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-gray-300 hover:text-white transition-colors duration-200 group-hover:neon-text"
              >
                View Discussions →
              </Link>
            </div>

            {/* Monthly Meetups */}
            <div className="glass-effect border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group">
              <div className="text-center mb-4">
                <Calendar className="h-16 w-16 text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-200" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Monthly Meetups</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4 text-center">
                Virtual and in-person meetups to network, learn, and share experiences with the community.
              </p>
              <ul className="text-sm text-gray-400 space-y-2 mb-6">
                <li>• Virtual Events</li>
                <li>• Local Meetups</li>
                <li>• Guest Speakers</li>
                <li>• Networking</li>
              </ul>
              <Link 
                href="/community/meetups" 
                className="block text-center text-green-400 hover:text-green-300 transition-colors duration-200 group-hover:neon-text"
              >
                View Schedule →
              </Link>
            </div>
          </div>
        </div>

        {/* Community Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Community Features</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="glass-effect border border-white/10 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Heart className="h-8 w-8 text-red-400 mr-3" />
                  <h3 className="text-xl font-semibold text-foreground">Supportive Environment</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Our community is built on the principles of kindness, inclusivity, and mutual support. Whether you're a beginner or an expert, you'll find a welcoming space to learn and grow.
                </p>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• Zero-tolerance policy for harassment</li>
                  <li>• Inclusive language and behavior</li>
                  <li>• Mentorship opportunities</li>
                  <li>• Constructive feedback culture</li>
                </ul>
              </div>

              <div className="glass-effect border border-white/10 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Zap className="h-8 w-8 text-yellow-400 mr-3" />
                  <h3 className="text-xl font-semibold text-foreground">Knowledge Sharing</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Share your expertise, learn from others, and contribute to the collective knowledge of the HackForge community.
                </p>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• Technical blog posts</li>
                  <li>• Code reviews and feedback</li>
                  <li>• Tutorial creation</li>
                  <li>• Best practice sharing</li>
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="glass-effect border border-white/10 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Globe className="h-8 w-8 text-blue-400 mr-3" />
                  <h3 className="text-xl font-semibold text-foreground">Global Network</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Connect with developers from around the world, share cultural perspectives, and build international collaborations.
                </p>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• 50+ countries represented</li>
                  <li>• Multi-language support</li>
                  <li>• Timezone-friendly events</li>
                  <li>• Cultural exchange</li>
                </ul>
              </div>

              <div className="glass-effect border border-white/10 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Shield className="h-8 w-8 text-green-400 mr-3" />
                  <h3 className="text-xl font-semibold text-foreground">Trust & Safety</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Our dedicated team ensures a safe, respectful, and productive environment for all community members.
                </p>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• Active moderation</li>
                  <li>• Clear community guidelines</li>
                  <li>• Reporting system</li>
                  <li>• Regular policy updates</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="mb-16">
          <div className="glass-effect border border-primary/30 rounded-xl p-8">
            <h2 className="text-3xl font-bold text-foreground text-center mb-6">Community Guidelines</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 text-green-400">✅ What We Encourage</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Respectful and constructive discussions</li>
                  <li>• Sharing knowledge and experiences</li>
                  <li>• Asking questions and seeking help</li>
                  <li>• Celebrating others' successes</li>
                  <li>• Providing helpful feedback</li>
                  <li>• Reporting inappropriate behavior</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 text-red-400">❌ What We Don't Allow</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Harassment or bullying</li>
                  <li>• Spam or self-promotion</li>
                  <li>• Offensive or inappropriate content</li>
                  <li>• Sharing private information</li>
                  <li>• Impersonating others</li>
                  <li>• Violating intellectual property</li>
                </ul>
              </div>
            </div>
            <div className="text-center mt-6">
              <Link 
                href="/community/guidelines" 
                className="inline-flex items-center text-primary hover:text-accent transition-colors duration-200"
              >
                Read Full Guidelines →
              </Link>
            </div>
          </div>
        </div>

        {/* Get Involved */}
        <div className="text-center">
          <div className="glass-effect border border-primary/30 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Join?</h3>
            <p className="text-gray-300 mb-6">
              Become part of the most innovative and supportive developer community. Start connecting, learning, and building today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="https://discord.gg/hackforge" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 hover:neon-text"
              >
                Join Discord
              </Link>
              <Link 
                href="https://forum.hackforge.dev" 
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/20 hover:border-primary/50 text-foreground px-6 py-3 rounded-lg transition-all duration-200 hover:neon-text"
              >
                Visit Forum
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 